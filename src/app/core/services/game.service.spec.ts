import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { SessionService } from './session.service';
import { PlayerState } from './storage.service';

describe('GameService', () => {
  let service: GameService;
  let sessionStub: Partial<SessionService>;

  beforeEach(async () => {
    sessionStub = {
      getCurrentPlayer: () => ({ name: 'p', score: 0, maxScore: 0 } as PlayerState),
      updatePlayer: jasmine.createSpy('updatePlayer')
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: SessionService, useValue: sessionStub },
        GameService
      ]
    }).compileComponents();

    service = TestBed.inject(GameService);
  });

  it('starts and switches to green after red timeout', fakeAsync(() => {
    service.start();
    expect((service as any).running).toBeTrue();
    expect((service as any).light$.value).toBe('red');
    tick(3000);
    expect((service as any).light$.value).toBe('green');
    service.stop();
  }));

  it('handleStep increments score on green', fakeAsync(() => {
    service.start();
    tick(3000); // become green
    // set player
    // @ts-ignore
    service['player$'].next({ name: 'p', score: 0, maxScore: 0 });
    service.handleStep('left');
    expect((service as any).score$.value).toBe(1);
    service.handleStep('left');
    expect((service as any).score$.value).toBe(0);
    service.stop();
  }));
});
