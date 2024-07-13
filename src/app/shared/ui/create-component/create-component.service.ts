import { computed, Injectable, signal, Type } from '@angular/core';
import { FormControlType } from '../../../util/type/survey-type';
import { createFormControlComponent } from '../../../util/component/create';

@Injectable({
  providedIn: 'root'
})
export class CreateComponentService<T> {
  private _formControlType = signal<FormControlType>('input'); // default form control type
  formControlTypeComputed = computed(() => this._formControlType());

  createFormControlComponentInstance(controlType: FormControlType = 'input'): Type<T> {
    return createFormControlComponent<T>(controlType);
  }

  setFormControlType(controlType: FormControlType) {
    this._formControlType.set(controlType);
  }
}
