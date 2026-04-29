import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { SessionService } from '../../core/services/session.service';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  private readonly game = inject(GameService);

  readonly player = this.game.player;
  readonly score = this.game.score;
  readonly maxScore = this.game.maxScore;
  readonly light = this.game.light;

  ngOnInit(): void {
    this.game.start();
  }

  ngOnDestroy(): void {
    this.game.stop();
  }

  onStepLeft(): void {
    this.game.handleStep('left');
  }

  onStepRight(): void {
    this.game.handleStep('right');
  }

  logout(): void {
    this.game.stop();
    this.session.logout();
    this.router.navigate(['/']);
  }

  openRanking(): void {
    this.game.stop();
    this.router.navigate(['/ranking']);
  }
}