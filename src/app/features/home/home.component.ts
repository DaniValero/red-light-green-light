import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeFormService } from '../../core/services/home-form.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SessionService } from '../../core/services/session.service';
import { NAME_MAX_LENGTH } from '../../core/constants';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeFormService]
})
export class HomeComponent {
  private _router = inject(Router);
  private _sessionService = inject(SessionService);
  private _formService = inject(HomeFormService);

  public homeForm: FormGroup = this._formService.createForm();
  public maxNameLength = NAME_MAX_LENGTH;

  startGame(): void {
    if (this.homeForm.invalid) {
      this.homeForm.markAllAsTouched();
      return;
    }

    const rawName = this.homeForm.get('name')?.value ?? '';
    const name = this._formService.normalizeName(rawName);

    this._sessionService.login(name);

    this._router.navigate(['/game']);
  }
}