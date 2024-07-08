import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

import { TestControlComponent } from '../../ui/test-control/test-control.component';
import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [ReactiveFormsModule, BasicCardComponent, JsonPipe],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss'
})
export class SurveyFormComponent {
  form: FormGroup = this.fb.group({
    sections: new FormArray([])
  })

  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;

  comps: ComponentRef<any>[] = [];

  constructor(private fb: FormBuilder) { }

  get sections() {
    return this.form.get('sections') as FormArray;
  }

  addSection() {
    const compRef = this.componentContainer.createComponent(TestControlComponent);
    this.comps.push(compRef);
  }
}
