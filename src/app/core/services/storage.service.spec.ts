import { StorageService, PlayerState } from './storage.service';

describe('StorageService', () => {
  const KEY = 'rlgl_players_v1';
  let service: StorageService;

  beforeEach(() => {
    localStorage.removeItem(KEY);
    service = new StorageService();
  });

  it('saves and retrieves a player', () => {
    const p: PlayerState = { name: 'alice', score: 1, maxScore: 2 };
    service.savePlayer(p);
    const got = service.getPlayer('alice');
    expect(got).toBeTruthy();
    expect(got?.name).toBe('alice');
  });

  it('returns all players', () => {
    service.savePlayer({ name: 'a', score: 0, maxScore: 0 });
    service.savePlayer({ name: 'b', score: 0, maxScore: 1 });
    const all = service.getAllPlayers();
    expect(all.length).toBe(2);
  });

  it('clears all players', () => {
    service.savePlayer({ name: 'a', score: 0, maxScore: 0 });
    service.clearAll();
    const all = service.getAllPlayers();
    expect(all.length).toBe(0);
  });
});
