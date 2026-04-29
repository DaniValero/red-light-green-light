import { Injectable, inject, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionService } from './session.service';
import { PlayerState } from './storage.service';

type Light = 'red' | 'green';

@Injectable({ providedIn: 'root' })
export class GameService implements OnDestroy {
  private session = inject(SessionService);

  public readonly light$ = new BehaviorSubject<Light>('red');
  public readonly score$ = new BehaviorSubject<number>(0);
  public readonly maxScore$ = new BehaviorSubject<number>(0);
  public readonly player$ = new BehaviorSubject<PlayerState | null>(null);

  private running = false;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private lastButton: 'left' | 'right' | null = null;

  constructor() {
    const p = this.session.getCurrentPlayer();
    if (p) {
      this.player$.next({ ...p });
      this.score$.next(p.score ?? 0);
      this.maxScore$.next(p.maxScore ?? 0);
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  public start(): void {
    if (this.running) return;
    this.running = true;
    this.clearTimer();
    this.lastButton = null;
    this.light$.next('red');
    this.scheduleNext('red');
  }

  public stop(): void {
    this.running = false;
    this.clearTimer();
    this.lastButton = null;
    this.light$.next('red');
  }

  public handleStep(button: 'left' | 'right'): void {
    const player = this.player$.value;
    if (!player) return;

    const light = this.light$.value;

    if (light === 'red') {
      if (this.score$.value !== 0) this.updateScore(0);
      this.lastButton = null;
      return;
    }

    if (this.lastButton === null || this.lastButton !== button) {
      this.updateScore(this.score$.value + 1);
      this.lastButton = button;
    } else {
      const newScore = Math.max(0, this.score$.value - 1);
      this.updateScore(newScore);
    }
  }

  private updateScore(newScore: number): void {
    const player = this.player$.value;
    if (!player) return;
    this.score$.next(newScore);
    if (newScore > this.maxScore$.value) {
      this.maxScore$.next(newScore);
      player.maxScore = newScore;
    }
    player.score = newScore;
    this.player$.next({ ...player });
    try {
      this.session.updatePlayer({ ...player });
    } catch {
      // ignore persistence errors
    }
  }

  private scheduleNext(current: Light): void {
    this.clearTimer();
    if (!this.running) return;

    if (current === 'red') {
      this.timerId = setTimeout(() => this.switchToGreen(), 3000);
    } else {
      const duration = this.computeGreenDuration();
      this.timerId = setTimeout(() => this.switchToRed(), duration);
    }
  }

  private switchToGreen(): void {
    if (!this.running) return;
    this.light$.next('green');
    this.lastButton = null;
    this.scheduleNext('green');
  }

  private switchToRed(): void {
    if (!this.running) return;
    this.light$.next('red');
    this.lastButton = null;
    this.scheduleNext('red');
  }

  private computeGreenDuration(): number {
    const score = this.score$.value ?? 0;
    const base = Math.max(10000 - score * 100, 2000);
    const jitter = Math.random() * 3000 - 1500; // random(-1500,1500)
    const duration = Math.round(base + jitter);
    return Math.max(2000, duration);
  }

  private clearTimer(): void {
    if (this.timerId != null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
