import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RankingComponent } from './ranking.component';
import { StorageService } from '../../core/services/storage.service';

describe('RankingComponent', () => {
  let component: RankingComponent;
  let fixture: ComponentFixture<RankingComponent>;
  const mockPlayers = [
    { id: 'alice-id', name: 'alice', score: 2, maxScore: 5 },
    { id: 'bob-id', name: 'bob', score: 1, maxScore: 3 }
  ];

  beforeEach(async () => {
    const storageStub = {
      getAllPlayers: () => mockPlayers,
      clearAll: jasmine.createSpy('clearAll')
    } as unknown as StorageService;

    await TestBed.configureTestingModule({
      imports: [RankingComponent, RouterTestingModule],
      providers: [{ provide: StorageService, useValue: storageStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(RankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load players', () => {
    expect(component).toBeTruthy();
    expect(component.players.length).toBe(2);
    expect(component.players[0].name).toBe('alice');
  });
});
