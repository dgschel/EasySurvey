import { computed, Injectable, signal, Type } from '@angular/core';
import { FormControlType } from '../../../util/type/survey-type';
import { createFormControlComponent } from '../../../util/component/create';

@Injectable()
export class CreateComponentService<T> {
  private _formControlType = signal<FormControlType>('input'); // default form control type
  createFormComponentType = computed(() => {
    const controlType = this._formControlType();
    return this.createFormControlComponentInstance(controlType);
  });

  createFormControlComponentInstance(controlType: FormControlType = 'input'): Type<T> {
    return createFormControlComponent<T>(controlType);
  }

  setFormControlType(controlType: FormControlType) {
    this._formControlType.set(controlType);
  }
}
