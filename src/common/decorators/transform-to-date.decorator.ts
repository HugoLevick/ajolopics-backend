import { Transform } from 'class-transformer';
import { isISO8601 } from 'class-validator';

export function TransformToDate() {
  return Transform(({ value }) => {
    const isValidDate = isISO8601(value, {
      strict: true,
      strictSeparator: true,
    });

    return isValidDate ? new Date(value) : false;
  });
}
