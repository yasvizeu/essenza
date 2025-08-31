// src/validators/is-cpf.decorator.ts
import { cpf } from 'cpf-cnpj-validator';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsCpf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return cpf.isValid(value);   // <-- aqui o certo
        },
        defaultMessage(args: ValidationArguments) {
          return 'O CPF informado é inválido.';
        },
      },
    });
  };
}