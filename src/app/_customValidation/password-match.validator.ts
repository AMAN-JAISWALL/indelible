import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('password_confirmation');

  if (!password || !confirmPassword) {
    return null; // Return null if either control is missing
  }

  return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
}

//this method for update/change password

export function passwordMatchValidatorForChangePassword(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('new_password');
  const confirmPassword = control.get('new_password_confirmation');

  if (!password || !confirmPassword) {
    return null; // Return null if either control is missing
  }

  return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
}

 // Custom validator function
 export function dateValidator(form: AbstractControl) {
  const checkInDate = form.get('checkInDate')?.value;
  const checkOutDate = form.get('checkOutDate')?.value;

  if (checkInDate && checkOutDate && new Date(checkInDate) > new Date(checkOutDate)) {
    return { dateMismatch: true };
  }
  return null;
}


export function noShowValidator(formGroup: FormGroup): ValidationErrors | null {
  const noShow = formGroup.get('no_show')?.value;
  const noShowFoc = formGroup.get('no_show_foc')?.value;

  if (noShow === true && noShowFoc === true) {
    return { noShowConflict: "No Show and No Show FOC cannot both be true." };
  }
  return null;
}


