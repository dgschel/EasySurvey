import { NgIf } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-test-control',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './test-control.component.html',
  styleUrl: './test-control.component.scss',
})
export class TestControlComponent {
  parentformContainer = inject(ControlContainer);

  section: FormGroup = this.fb.group({
    name: ''
  });

  @ViewChild('mySelect') mySelect!: ElementRef;

  get form() {
    return this.parentformContainer.control as FormGroup;
  }

  get sections() {
    return this.form.get('sections') as FormArray;
  }

  get control() {
    return this.section.get('name') as FormControl;
  }

  constructor(private fb: FormBuilder) {
    this.sections.push(this.section);
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
