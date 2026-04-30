import { Injectable } from '@angular/core';
import { STORAGE_KEY, CURRENT_PLAYER_KEY } from '../constants';

export interface PlayerState {
  id: string;
  name: string;
  score: number;
  maxScore: number;
}

export type CreatePlayerInput = Omit<PlayerState, 'id'>;

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly KEY = STORAGE_KEY;
  private cache: Map<string, PlayerState> | null = null;

  private generateId(): string {
    return crypto.randomUUID();
  }

  private isValid(value: unknown): value is PlayerState {
    if (!value || typeof value !== 'object') return false;
    const p = value as Record<string, unknown>;
    return (
      typeof p['id'] === 'string' &&
      typeof p['name'] === 'string' &&
      typeof p['score'] === 'number' &&
      typeof p['maxScore'] === 'number'
    );
  }

  private loadCache(): Map<string, PlayerState> {
    if (this.cache !== null) return this.cache;

    try {
      const raw = localStorage.getItem(this.KEY);
      const parsed = raw ? JSON.parse(raw) : {};

      this.cache = new Map(
        Object.values(parsed)
          .filter(this.isValid.bind(this))
          .map((p) => [p.id, p])
      );
    } catch {
      this.cache = new Map();
    }

    return this.cache;
  }

  private persist(): void {
    try {
      const obj = Object.fromEntries(this.cache!);
      localStorage.setItem(this.KEY, JSON.stringify(obj));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }

  getPlayerById(id: string): PlayerState | null {
    return this.loadCache().get(id) ?? null;
  }

  getPlayerByName(name: string): PlayerState | null {
    const lower = name.toLowerCase();
    for (const player of this.loadCache().values()) {
      if (player.name.toLowerCase() === lower) return player;
    }
    return null;
  }

  savePlayer(input: PlayerState | CreatePlayerInput): PlayerState {
    const player: PlayerState = {
      ...input,
      id: 'id' in input && input.id ? input.id : this.generateId(),
    };
    this.loadCache().set(player.id, player);
    this.persist();
    return player;
  }

  getAllPlayers(): PlayerState[] {
    return [...this.loadCache().values()];
  }

  clearAll(): void {
    try {
      localStorage.removeItem(this.KEY);
      this.cache = null;
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  }

  saveCurrentPlayerId(id: string): void {
  try {
    localStorage.setItem(CURRENT_PLAYER_KEY, id);
  } catch (e) {
    console.error('Failed to save current player:', e);
  }
}

getCurrentPlayerId(): string | null {
  try {
    return localStorage.getItem(CURRENT_PLAYER_KEY);
  } catch {
    return null;
  }
}

clearCurrentPlayer(): void {
  try {
    localStorage.removeItem(CURRENT_PLAYER_KEY);
  } catch (e) {
    console.error('Failed to clear current player:', e);
  }
}
}