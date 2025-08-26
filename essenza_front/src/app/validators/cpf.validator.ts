import { cpf } from 'cpf-cnpj-validator';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (!value) return null; 
    if (!cpf.isValid(value)) {
      return { invalidCpf: true };
    }

    return null;
  };
}