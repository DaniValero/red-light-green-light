import { Injectable, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NAME_MAX_LENGTH } from '../constants';

@Injectable()
export class HomeFormService {
  private fb = inject(FormBuilder);

  createForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(NAME_MAX_LENGTH)]]
    });
  }

  normalizeName(value: string): string {
    return value.trim().toLowerCase();
  }
}