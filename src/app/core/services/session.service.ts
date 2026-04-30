import { Injectable, inject, signal } from '@angular/core';
import { StorageService, PlayerState } from './storage.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly storage = inject(StorageService);

  readonly currentPlayer = signal<PlayerState | null>(null);

  login(name: string): PlayerState {
    const trimmed = name.trim();
    const existing = this.storage.getPlayerByName(trimmed);

    const player =
      existing ??
      this.storage.savePlayer({
        name: trimmed,
        score: 0,
        maxScore: 0,
      });

    this.storage.saveCurrentPlayerId(player.id);
    this.currentPlayer.set(player);

    return player;
  }

  logout(): void {
    this.storage.clearCurrentPlayer();
    this.currentPlayer.set(null);
  }

  loadFromStorage(): void {
    const id = this.storage.getCurrentPlayerId();
    if (!id) return;

    const player = this.storage.getPlayerById(id);
    this.currentPlayer.set(player);
  }

  updatePlayer(player: PlayerState): void {
    const updated = this.storage.savePlayer(player);
    this.currentPlayer.set(updated);
  }
}