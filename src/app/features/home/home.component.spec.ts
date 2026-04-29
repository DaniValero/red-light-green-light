import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeFormService } from '../../core/services/home-form.service';
import { SessionService } from '../../core/services/session.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let sessionSpy: jasmine.SpyObj<SessionService>;
  let formService: HomeFormService;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    sessionSpy = jasmine.createSpyObj('SessionService', ['login']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: SessionService, useValue: sessionSpy },
        HomeFormService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    formService = TestBed.inject(HomeFormService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('startGame navigates to /game when form valid', () => {
    component.homeForm.get('name')?.setValue(' Alice ');
    component.startGame();
    expect(sessionSpy.login).toHaveBeenCalledWith('alice');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/game']);
  });

  it('startGame does not navigate when form invalid', () => {
    component.homeForm.get('name')?.setValue('a');
    component.startGame();
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/game']);
  });
});
