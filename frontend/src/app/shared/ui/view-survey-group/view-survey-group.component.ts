import { AfterViewInit, Component, ComponentRef, Injector, Input, ViewChild, ViewContainerRef } from '@angular/core';

import { CreateComponentComponent } from '../create-component/create-component.component';
import { FormControlComponentType, SurveyModel } from '../../../util/type/survey-type';
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

  getFormControlComponentValue() {
    // TODO: Add correct type to get rid of any. GetValue-method is defined in an interface that is implemented by all form control components
    return (this.componentRef?.instance as any).getValue();
  }

  resetFormControlComponent() {
    // TODO: Add correct type to get rid of any. Reset-method is defined in an interface that is implemented by all form control components
    (this.componentRef?.instance as any).reset();
  }

  ngAfterViewInit(): void {
    const cmpType = this.cmpService.createFormControlComponentInstance(this.model.type);
    this.componentContainer.clear();
    this.componentRef = this.componentContainer.createComponent(cmpType);

    // A dot in the key name will cause an error when trying to access the object property
    const title = this.model.title.replace(".", "");

    this.componentRef.setInput('controlKeyName', title);
    this.componentRef.setInput('validator', this.model.validator);

    if (this.model.type === 'input') {
      this.componentRef.setInput('placeholder', this.model.placeholder);
    } else if (this.model.type === 'select') {
      this.componentRef.setInput('options', this.model.options);
    }
    else if (this.model.type === 'radio') {
      this.componentRef.setInput('options', this.model.options);
      this.componentRef.setInput('name', this.model.name);
    }
    else if (this.model.type === 'checkbox') {
      this.componentRef.setInput('options', this.model.options);
    }
  }

  hasValidator(): boolean {
    return Object.keys(this.model.validator).length > 0
  }
}

