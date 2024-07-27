import { AfterViewInit, Component, ComponentRef, Injector, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { CreateComponentComponent } from '../create-component/create-component.component';
import { FormControlComponentType, SurveyModel, SurveyModelStorage } from '../../../util/type/survey-type';
import { CreateComponentService } from '../create-component/create-component.service';
import { BasicCardComponent } from '../basic-card/basic-card.component';

@Component({
  selector: 'app-view-survey-group',
  standalone: true,
  imports: [CreateComponentComponent, BasicCardComponent],
  providers: [CreateComponentService],
  templateUrl: './view-survey-group.component.html',
  styleUrl: './view-survey-group.component.scss',
})
export class ViewSurveyGroupComponent implements AfterViewInit {
  @Input() model: SurveyModel = {} as SurveyModel;
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
    const cmp = this.cmpService.createFormControlComponentInstance(this.model.type)
    this.componentContainer.clear();
    this.componentRef = this.componentContainer.createComponent(cmp);

    this.componentRef.setInput('validator', this.model.validator);

    if (this.model.type === 'input') {
      this.componentRef.setInput('placeholder', this.model.placeholder);
    } else if (this.model.type === 'select') {
      this.componentRef.setInput('options', this.model.options);
    }
  }

  hasValidator(): boolean {
    return Object.keys(this.model.validator).length > 0
  }
}
