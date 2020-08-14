import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentenceCase',
})
export class SentenceCasePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    return value ? value.slice(0, 1).toUpperCase() + value.slice(1) : null;
  }
}
