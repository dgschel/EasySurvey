import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-survey-section',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, BasicCardComponent],
  templateUrl: './survey-section.component.html',
  styleUrl: './survey-section.component.scss'
})
export class SurveySectionComponent {
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
