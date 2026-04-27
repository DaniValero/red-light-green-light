import { Injectable, inject } from '@angular/core';
import { StorageService, PlayerState } from './storage.service';
import { CURRENT_PLAYER_KEY } from '../constants';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private storage = inject(StorageService);
  private current?: PlayerState;
  private readonly CURRENT_KEY = CURRENT_PLAYER_KEY;

  public login(name: string): PlayerState {
    const key = name.trim().toLowerCase();
    let player = this.storage.getPlayer(key);
    if (!player) {
      player = { name: key, score: 0, maxScore: 0 };
      this.storage.savePlayer(player);
    }

    try {
      localStorage.setItem(this.CURRENT_KEY, key);
    } catch (e) {
      // ignore
    }

    this.current = player;
    return player;
  }

  public getCurrentPlayer(): PlayerState | null {
    if (this.current) return this.current;
    try {
      const key = localStorage.getItem(this.CURRENT_KEY);
      if (!key) return null;
      const p = this.storage.getPlayer(key);
      this.current = p ?? undefined;
      return p ?? null;
    } catch (e) {
      return null;
    }
  }

  public updatePlayer(player: PlayerState): void {
    this.storage.savePlayer(player);
    this.current = player;
  }
}