import { Component, OnInit, inject, input } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-control-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-control-input.component.html',
  styleUrl: './form-control-input.component.scss',
  viewProviders: [{ // viewProviders is used to provide the parent form group to the child component. Useful for content projection
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, { skipSelf: true })
  }]
})
export class FormControlInputComponent implements OnInit {
  inputControlName = input.required<string>();
  inputPlaceholder = input<string>();
  parentContainer = inject(ControlContainer);

  private nnfb = inject(FormBuilder);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(this.inputControlName(), this.nnfb.control<string>(''));
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.inputControlName())
  }
}
