import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { ButtonModule } from 'primeng/button';
import { GameService } from '../../core/services/game.service';
import type { PlayerState } from '../../core/services/storage.service';
import { signal } from '@angular/core';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  private _router = inject(Router);
  private _session = inject(SessionService);
  private _game = inject(GameService);

  public player = signal<PlayerState | null>(this._session.getCurrentPlayer());
  public score = signal<number>(0);
  public maxScore = signal<number>(0);
  public light = signal<'red' | 'green'>('red');

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.subs.push(this._game.player$.subscribe(p => this.player.set(p)));
    this.subs.push(this._game.score$.subscribe(s => this.score.set(s)));
    this.subs.push(this._game.maxScore$.subscribe(m => this.maxScore.set(m)));
    this.subs.push(this._game.light$.subscribe(l => this.light.set(l)));
    this._game.start();
  }

  ngOnDestroy(): void {
    this._game.stop();
    this.subs.forEach(s => s.unsubscribe());
  }

  onStepLeft(): void { this._game.handleStep('left'); }
  onStepRight(): void { this._game.handleStep('right'); }

  logout(): void {
    this._game.stop();
    this._session.logout();
    this._router.navigate(['/']);
  }
}
