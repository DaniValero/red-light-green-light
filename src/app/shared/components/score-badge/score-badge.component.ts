import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-badge.component.html',
  styleUrls: ['./score-badge.component.scss']
})
export class ScoreBadgeComponent {
  @Input() score?: number | null = 0;
}
