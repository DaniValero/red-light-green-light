import { Injectable, inject, OnDestroy, signal, computed, effect } from '@angular/core';
import { SessionService } from './session.service';
import { PlayerState } from './storage.service';

type Light = 'red' | 'green';
type Button = 'left' | 'right';

@Injectable({ providedIn: 'root' })
export class GameService implements OnDestroy {
  private readonly session = inject(SessionService);

  readonly light = signal<Light>('red');
  readonly score = signal<number>(0);
  readonly maxScore = signal<number>(0);
  readonly player = signal<PlayerState | null>(null);
  readonly running = signal<boolean>(false);

  readonly isGreen = computed(() => this.light() === 'green');

  private timerId: ReturnType<typeof setTimeout> | null = null;
  private lastButton: Button | null = null;

  constructor() {
    this.initializePlayer();


    effect(() => {
      const sessionPlayer = this.session.currentPlayer();

      if (!sessionPlayer) {
        this.player.set(null);
        this.score.set(0);
        this.maxScore.set(0);
        this.running.set(false);
        this.clearTimer();
        this.lastButton = null;
        return;
      }

      const current = this.player();
      if (!current || current.id !== sessionPlayer.id) {
        this.player.set({ ...sessionPlayer });
        this.score.set(sessionPlayer.score ?? 0);
        this.maxScore.set(sessionPlayer.maxScore ?? 0);
      }
    });

    effect(() => {
      const player = this.player();
      if (!player) return;

      try {
        this.session.updatePlayer(player);
      } catch {
        console.log('Error updating player');
      }
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  start(): void {
    if (this.running()) return;

    this.running.set(true);
    this.lastButton = null;
    this.setLight('red');
  }

  stop(): void {
    this.running.set(false);
    this.lastButton = null;
    this.clearTimer();
    this.light.set('red');
  }

  handleStep(button: Button): void {
    if (!this.running() || !this.isGreen()) {
      this.resetScoreIfNeeded();
      return;
    }

    if (this.lastButton !== button) {
      this.incrementScore();
      this.lastButton = button;
    } else {
      this.decrementScore();
    }
  }

  private initializePlayer(): void {
    const player = this.session.currentPlayer();
    if (!player) return;

    this.player.set({ ...player });
    this.score.set(player.score ?? 0);
    this.maxScore.set(player.maxScore ?? 0);
  }

  private incrementScore(): void {
    this.updateScore(this.score() + 1);
  }

  private decrementScore(): void {
    this.updateScore(Math.max(0, this.score() - 1));
  }

  private resetScoreIfNeeded(): void {
    if (this.score() !== 0) {
      this.updateScore(0);
    }
    this.lastButton = null;
  }

  private updateScore(score: number): void {
    const player = this.player();
    if (!player) return;

    const maxScore = Math.max(score, this.maxScore());

    this.score.set(score);
    this.maxScore.set(maxScore);

    this.player.set({
      ...player,
      score,
      maxScore,
    });
  }

  private setLight(light: Light): void {
    this.light.set(light);
    this.lastButton = null;

    if (!this.running()) return;

    this.clearTimer();

    const delay =
      light === 'red'
        ? 3000
        : this.computeGreenDuration();

    this.timerId = setTimeout(() => {
      this.setLight(light === 'red' ? 'green' : 'red');
    }, delay);
  }

  private computeGreenDuration(): number {
    const base = Math.max(10000 - this.score() * 100, 2000);
    const jitter = Math.random() * 3000 - 1500;
    return Math.max(2000, Math.round(base + jitter));
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}