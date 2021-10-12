import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ParseDatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const inputedDate = new Date(value);
    const date = new Date(inputedDate.getTime());

    if (date.toLocaleDateString() === 'Invalid Date') {
      throw new BadRequestException(
        'Validation failed (date string is expected)',
      );
    }

    return date;
  }
}
