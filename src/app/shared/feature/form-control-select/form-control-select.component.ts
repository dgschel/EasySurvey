import { Component, inject, input } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-control-select',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-control-select.component.html',
  styleUrl: './form-control-select.component.scss',
  viewProviders: [{ // viewProviders is used to provide the parent form group to the child component. Useful for content projection
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, { skipSelf: true })
  }]
})
export class FormControlSelectComponent {
  formControlKey = input.required<string>();
  parentContainer = inject(ControlContainer);

  private fb = inject(FormBuilder);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(this.formControlKey(), this.fb.control(''));
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.formControlKey());
  }
}
