import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { StorageService } from './storage.service';

describe('SessionService', () => {
  let service: SessionService;
  let storageStub: Partial<StorageService>;

  beforeEach(async () => {
    localStorage.removeItem('rlgl_current_player');
    storageStub = {
      getPlayer: (k: string) => null,
      savePlayer: (player: any) => {
        // emulate StorageService assigning an id when saving
        player.id = `${player.name}-id`;
      }
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageStub },
        SessionService
      ]
    }).compileComponents();

    service = TestBed.inject(SessionService);
  });

  it('login creates and persists player', () => {
    const p = service.login('Alice');
    expect(p.name).toBe('alice');
    expect(p.id).toBe('alice-id');
    expect(localStorage.getItem('rlgl_current_player')).toBe('alice-id');
  });

  it('getCurrentPlayer returns null if none', () => {
    expect(service.getCurrentPlayer()).toBeNull();
  });

  it('logout clears current player', () => {
    localStorage.setItem('rlgl_current_player', 'x');
    service.logout();
    expect(localStorage.getItem('rlgl_current_player')).toBeNull();
  });
});
