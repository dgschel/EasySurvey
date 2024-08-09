import { AfterViewInit, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

import { DynamicOptionComponent } from '../../ui/dynamic-option/dynamic-option.component';
import { FormControlType } from '../../../util/type/survey-type';

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [DynamicOptionComponent, NgSwitch, NgSwitchCase,],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss',
})
export class FormSelectComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);

  // Callback function to update options passed down from parent to child
  @Input() optionsChangedCallback = (options: string[]): string[] => options;
  @Input() controlModel: { modelType: Exclude<FormControlType, 'input'>, options: string[] } = { modelType: 'select', options: [] };

  dynamicOptions: string[] = [];

  // Will be used to populate options
  get values() {
    return this.dynamicOptions
      .filter(option => option !== '')
      .map(option => option.trim());
  }

  ngAfterViewInit(): void {
    this.dynamicOptions = [...this.controlModel.options];

    if (this.dynamicOptions.length === 0) this.dynamicOptions.push('')

    // After create component we need to detect changes so that the @for-loop will display an initial value
    this.cdr.detectChanges();
  }

  onBlur(cmp: DynamicOptionComponent) {
    this.dynamicOptions[cmp.index] = cmp.value;
    const lastItemIndex = this.dynamicOptions.indexOf(cmp.value);

    // Insert a new empty string if the last item is not empty and the current item is the last one
    if (this.dynamicOptions.length - 1 === cmp.index && this.dynamicOptions[lastItemIndex] !== '') {
      this.dynamicOptions.push('');
    }

    this.optionsChangedCallback(this.values);
  }

  onRemove(cmp: DynamicOptionComponent) {
    // Only remove if there is atleast one element
    if (this.dynamicOptions.length === 1) return;

    // Will also remove duplicate values
    this.dynamicOptions = this.dynamicOptions.filter(option => option !== cmp.value);
    this.optionsChangedCallback(this.values);
  }
}
