import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { StorageService, PlayerState } from '../../core/services/storage.service';
import { SessionService } from '../../core/services/session.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ScoreBadgeComponent } from '../../shared/components/score-badge/score-badge.component';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, ButtonModule, ScoreBadgeComponent, TitleCasePipe],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  private storage = inject(StorageService);
  private session = inject(SessionService);
  private router = inject(Router);

  public players: PlayerState[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.players = this.storage.getAllPlayers().sort((a, b) => (b.maxScore ?? 0) - (a.maxScore ?? 0));
  }

  back(): void {
    if (this.session.currentPlayer()) {
      this.router.navigate(['/game']);
    } else {
      this.router.navigate(['/']);
    }
  }

  clear(): void { this.storage.clearAll(); this.load(); }
}
