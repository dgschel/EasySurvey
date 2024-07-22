import { computed, Injectable, signal, Type } from '@angular/core';
import { FormControlType } from '../../../util/type/survey-type';
import { createFormComponent, createFormControlComponent } from '../../../util/component/create';

@Injectable()
export class CreateComponentService<T> {
  private _formControlType = signal<FormControlType>('input'); // default form control type
  createFormComponentType = computed(() => {
    const controlType = this._formControlType();
    return this.createFormComponentInstance(controlType);
  });

  createFormComponentInstance(controlType: FormControlType = 'input'): Type<T> {
    return createFormComponent<T>(controlType);
  }

  createFormControlComponentInstance(controlType: FormControlType = 'input'): Type<T> {
    return createFormControlComponent<T>(controlType);
  }

  setFormControlType(controlType: FormControlType) {
    this._formControlType.set(controlType);
  }
}
