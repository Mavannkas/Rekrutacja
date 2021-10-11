import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ParseDatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const date = new Date(value);
    if (!(date instanceof Date)) {
      throw new BadRequestException(
        'Validation failed (date string is expected)',
      );
    }

    return date;
  }
}
