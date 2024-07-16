import { AfterViewInit, Component, ComponentRef, Injector, input, ViewChild, ViewContainerRef } from '@angular/core';
import { CreateComponentComponent } from '../create-component/create-component.component';
import { FormControlComponentType, FormControlType } from '../../../util/type/survey-type';
import { CreateComponentService } from '../create-component/create-component.service';

@Component({
  selector: 'app-view-survey-group',
  standalone: true,
  imports: [CreateComponentComponent],
  providers: [CreateComponentService],
  templateUrl: './view-survey-group.component.html',
  styleUrl: './view-survey-group.component.scss',
})
export class ViewSurveyGroupComponent implements AfterViewInit {
  controlType = input.required<FormControlType>()
  cmpService: CreateComponentService<FormControlComponentType>;
  componentRef: ComponentRef<FormControlComponentType> | undefined;
  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;

  /**
   * Creates an instance of CreateComponentComponent.
   * @param injector - The injector used for dependency injection.
  */
  constructor(private injector: Injector) {
    this.cmpService = this.injector.get(CreateComponentService); // Fully typed service instance
  }

  ngAfterViewInit(): void {
    const cmp = this.cmpService.createFormControlComponentInstance(this.controlType())
    this.componentContainer.clear();
    this.componentRef = this.componentContainer.createComponent(cmp);
    this.componentRef.changeDetectorRef.detectChanges();
  }
}
