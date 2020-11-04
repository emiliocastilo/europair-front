import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function endDateNotBeforeStartDateValidator(
  startControlName: string,
  endControlName: string
): ValidatorFn {
  return (group: FormGroup): ValidationErrors | null => {
    const startDateTime = new Date(
      group.get(startControlName)?.value
    ).getTime();
    const endDateTime = new Date(group.get(endControlName)?.value).getTime();
    return group.get(endControlName).enabled &&
      !isNaN(startDateTime) &&
      !isNaN(endDateTime) &&
      startDateTime > endDateTime
      ? { endDateNotBeforeStartDateValidator: true }
      : null;
  };
}
