import { AfterViewInit, Component, Injector, output, Type } from '@angular/core';
import { CreateComponentService } from './create-component.service';
import { FormControlComponentType, FormControlType } from '../../../util/type/survey-type';

/**
 * Represents the CreateComponentComponent class.
 * This component is responsible for creating a form component.
 */
@Component({
  selector: 'app-create-component',
  standalone: true,
  imports: [],
  providers: [CreateComponentService], // Provide service to the component. Every instance of the component will have its own instance of the service
  templateUrl: './create-component.component.html',
  styleUrl: './create-component.component.scss'
})
export class CreateComponentComponent implements AfterViewInit {
  private cmpService: CreateComponentService<FormControlComponentType>;
  componentTypeOutput = output<Type<FormControlComponentType>>();

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
    this.componentTypeOutput.emit(this.cmpService.createFormComponentType());
  }

  /**
   * Tracks the change of the control type.
   * Sets the form control type in cmpService and emits the updated form component type using cmpTypeOutput.
   * @param controlType - The new control type.
   */
  updateFormControlType(controlType: string) {
    this.cmpService.setFormControlType(controlType as FormControlType);
    this.componentTypeOutput.emit(this.cmpService.createFormComponentType());
  }
}
