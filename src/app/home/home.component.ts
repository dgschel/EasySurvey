import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule, JsonPipe, NgForOf, NgTemplateOutlet } from '@angular/common';
import { FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

import { customRequiredValidator, customMinLengthValidator } from '../shared/form-validator/validators';
import { BasicCardComponent } from '../shared/ui/basic-card/basic-card.component';
import { FormControlInputComponent } from '../shared/feature/form-control-input/form-control-input.component';
import { FormControlSelectComponent } from '../shared/feature/form-control-select/form-control-select.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, FormControlSelectComponent, NgForOf, NgTemplateOutlet, CommonModule, BasicCardComponent, FormControlInputComponent, JsonPipe, NgTemplateOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  form: FormGroup = new FormGroup({});
  fieldValidatorsFn: ValidatorFn[] = [customRequiredValidator(), customMinLengthValidator(3)];

  sections: { type: string }[] = [{ type: 'text' }];

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  submit() {
    console.log(this.form);
  }

  getValue(): number {
    const array: string[] = ['customInput', 'customSelect'];
    const randomIndex: number = Math.floor(Math.random() * array.length);
    return randomIndex + 1;
  }

  add() {
    this.sections.push({ type: this.getValue() === 1 ? 'text' : 'select' });

  }
}