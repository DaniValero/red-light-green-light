import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { GameComponent } from './game.component';
import { GameService } from '../../core/services/game.service';
import { SessionService } from '../../core/services/session.service';

describe('GameComponent', () => {
  let fixture: ComponentFixture<GameComponent>;
  let component: GameComponent;
  let router: Router;

  const mockGameService: Partial<GameService> = {
    stop: jasmine.createSpy('stop'),
    start: jasmine.createSpy('start'),
    handleStep: jasmine.createSpy('handleStep'),
    player$: new BehaviorSubject(null) as any,
    score$: new BehaviorSubject(0) as any,
    maxScore$: new BehaviorSubject(0) as any,
    light$: new BehaviorSubject('red') as any
  };

  const mockSession: Partial<SessionService> = {
    getCurrentPlayer: () => null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent, RouterTestingModule],
      providers: [
        { provide: GameService, useValue: mockGameService },
        { provide: SessionService, useValue: mockSession }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should stop the game and navigate to /ranking when opening ranking', () => {
    spyOn(router, 'navigate');
    (mockGameService.stop as jasmine.Spy).calls.reset();

    component.openRanking();

    expect(mockGameService.stop).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/ranking']);
  });
});
