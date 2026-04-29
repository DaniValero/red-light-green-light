import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreBadgeComponent } from './score-badge.component';

describe('ScoreBadgeComponent', () => {
  let component: ScoreBadgeComponent;
  let fixture: ComponentFixture<ScoreBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreBadgeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreBadgeComponent);
    component = fixture.componentInstance;
  });

  it('shows the provided score', () => {
    component.score = 42;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent?.trim()).toBe('42');
  });
});
