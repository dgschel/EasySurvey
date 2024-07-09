import { Component, ComponentRef, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

import { SurveySectionComponent } from '../survey-section/survey-section.component';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss',
})
export class SurveyFormComponent {
  fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    sections: new FormArray([])
  })

  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;

  comps: ComponentRef<any>[] = [];

  addSection() {
    const compRef = this.componentContainer.createComponent(SurveySectionComponent);
    this.comps.push(compRef);
    compRef.changeDetectorRef.detectChanges();
  }
}
