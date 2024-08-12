import { FormArray, FormControl, FormGroup, ValidatorFn } from "@angular/forms";

import { BaseSurveyFormControl } from "../../core/model/base-form-control";
import { ValidatorConfig } from "../../util/type/survey-type";
import { createValidators } from "../form-validator/validators";

export class SurveyFormControl extends BaseSurveyFormControl {
  constructor(form: FormGroup, validator: Partial<ValidatorConfig>, controlName: string = 'controlName') {
    const validators = createValidators(validator);
    super(form, () => validators, controlName);
  }

  override get control() {
    return super.control as FormControl;
  }
}

export class SurveyFormCheckboxControl extends BaseSurveyFormControl {
  constructor(
    form: FormGroup,
    validator: Partial<ValidatorConfig>,
    private options: string[],
    controlName: string = 'controlName',
  ) {
    const validators = createValidators(validator);
    super(form, () => validators, controlName);
    this.initializeCheckboxes();
  }

  /**
   * Returns the control from base class as a FormArray of FormControl<boolean>.
   */
  override get control() {
    return super.control as FormArray<FormControl<boolean>>
  }

  /**
   * Initializes the checkboxes.
   */
  private initializeCheckboxes() {
    const controls = this.options.map(() => new FormControl(false));
    const formArrayControls = new FormArray(controls, { updateOn: 'blur' });

    // Override control in base class
    super.control = formArrayControls
  }

  /**
   * Gets the values of the selected checkboxes
   * @returns The values of the selected checkboxes
   */
  get selectedValues(): string[] {
    return this.options.filter((_, index) => this.isChecked(index));
  }

  /**
   * Checks if the checkbox at the specified index is checked
   * @param index The index of the checkbox
   * @returns True if the checkbox is checked, false otherwise
   */
  isChecked(index: number): boolean {
    const checkboxControl = this.control.controls[index];
    return checkboxControl.value;
  }
}