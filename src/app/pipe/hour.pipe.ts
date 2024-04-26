import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hour',
  standalone: true
})
export class HourPipe implements PipeTransform {

  transform(value: string): string {
    const stringParts = String(value).split(',');
    const hourSecondPart = stringParts[1] === '0' ? '00' : stringParts[1];
    let result: string =  stringParts[0] + ":" + hourSecondPart;
    console.log(result);
    return result;
  }

}
