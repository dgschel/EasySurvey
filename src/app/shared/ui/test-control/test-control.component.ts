import { NgIf } from '@angular/common';
import { Component, ElementRef, Inject, inject, Optional, SkipSelf, ViewChild } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-test-control',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './test-control.component.html',
  styleUrl: './test-control.component.scss',
  viewProviders: [{ provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) }]
})
export class TestControlComponent {
  formParentContainer = inject(ControlContainer);
  fb = inject(FormBuilder);

  section: FormGroup = this.fb.group({
    name: ''
  });

  @ViewChild('mySelect') mySelect!: ElementRef;

  ngOnInit() {
    this.sections.push(this.section);
  }

  get form() {
    return this.formParentContainer.control as FormGroup;
  }

  get sections() {
    return this.form.get('sections') as FormArray;
  }

  get control() {
    return this.section.get('name') as FormControl;
  }

  toggleRequired(checked: boolean) {
    if (checked) {
      this.control.setValidators(Validators.required);
    }
    else {
      this.control.clearValidators();
    }
    this.control.updateValueAndValidity();
  }

  trackChange() {
    console.log("trackChange", this.mySelect.nativeElement.value);
  }
}
