import { ChangeDetectorRef, Component, ComponentRef, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
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
  private cdr = inject(ChangeDetectorRef);
  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;
  comps: ComponentRef<SurveySectionComponent>[] = [];

  form: FormGroup = new FormGroup({
    sections: new FormArray([])
  })

  addSection() {
    const compRef = this.componentContainer.createComponent(SurveySectionComponent);
    compRef.instance.remove.subscribe(() => this.removeSurveySection(compRef));
    this.comps.push(compRef);
    compRef.changeDetectorRef.detectChanges();
    this.cdr.detectChanges();
  }

  removeSurveySection(compRef: ComponentRef<SurveySectionComponent>) {
    const index = this.comps.indexOf(compRef);
    if (index !== -1) {
      this.comps.splice(index, 1);
      compRef.destroy();
    }
  }
}
