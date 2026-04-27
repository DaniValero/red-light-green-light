import { Injectable } from '@angular/core';
import { STORAGE_KEY } from '../constants';

export interface PlayerState {
  name: string;
  score: number;
  maxScore: number;
  // extendable with other fields (lastState, timestamp...)
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly KEY = STORAGE_KEY;
  private cache: Record<string, PlayerState> = {};

  private loadCache(): Record<string, PlayerState> {
    if (Object.keys(this.cache).length > 0) return this.cache;
    try {
      const raw = localStorage.getItem(this.KEY);
      this.cache = raw ? JSON.parse(raw) : {};
    } catch (e) {
      this.cache = {};
    }
    return this.cache;
  }

  getPlayer(key: string): PlayerState | null {
    const players = this.loadCache();
    return players[key] ?? null;
  }

  savePlayer(player: PlayerState): void {
    const players = this.loadCache();
    players[player.name] = player;
    try {
      localStorage.setItem(this.KEY, JSON.stringify(players));
      this.cache = players;
    } catch (e) {
      // ignore localStorage failures
    }
  }

  getAllPlayers(): PlayerState[] {
    const players = this.loadCache();
    return Object.values(players);
  }

  clearAll(): void {
    try {
      localStorage.removeItem(this.KEY);
      this.cache = {};
    } catch (e) {
      // ignore
    }
  }
}
