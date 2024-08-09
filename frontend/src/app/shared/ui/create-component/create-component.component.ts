import { AfterViewInit, Component, Injector, Input, output, Type } from '@angular/core';
import { KeyValuePipe } from '@angular/common';

import { CreateComponentService } from './create-component.service';
import { FormComponentType, FormControlNameMap, FormControlType } from '../../../util/type/survey-type';

/**
 * Represents the CreateComponentComponent class.
 * This component is responsible for creating form control components dynamically.
 */
@Component({
  selector: 'app-create-component',
  standalone: true,
  imports: [KeyValuePipe],
  providers: [CreateComponentService], // Provide service to the component. Every instance of the component will have its own instance of the service
  templateUrl: './create-component.component.html',
  styleUrl: './create-component.component.scss'
})
export class CreateComponentComponent implements AfterViewInit {
  @Input('controlType') controlType: FormControlType = 'input';
  private cmpService: CreateComponentService<FormComponentType>;
  cmpTypeOutput = output<Type<FormComponentType>>();
  controlTypeChanged = output<FormControlType>();
  controlTypeMap = FormControlNameMap;

  /**
   * Creates an instance of CreateComponentComponent.
   * @param injector - The injector used for dependency injection.
   */
  constructor(private injector: Injector) {
    this.cmpService = this.injector.get(CreateComponentService); // Fully typed service instance
  }

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   * Emits the created form component type using cmpTypeOutput.
   */
  ngAfterViewInit(): void {
    this.updateFormControlType(this.controlType);
  }

  /**
   * Tracks the change of the control type.
   * Sets the form control type in cmpService and emits the updated form component type using cmpTypeOutput.
   * @param controlType - The new control type.
   */
  updateFormControlType(controlType: string) {
    this.cmpService.setFormControlType(controlType as FormControlType);
    this.controlTypeChanged.emit(controlType as FormControlType)
  }
}
