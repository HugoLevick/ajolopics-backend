import { HttpException } from '@nestjs/common';

export class ErrorDefinition {
  constructor(
    public readonly errorCode: string,
    public readonly description: string,
    public readonly defaultStatusCode: number = 500,
  ) {}

  build(
    statusCode?: number,
    additionalInfo?: Record<string, any>,
  ): HttpException {
    const finalStatus = statusCode ?? this.defaultStatusCode;

    return new HttpException(
      {
        message: this.description,
        error: this.errorCode,
        statusCode: finalStatus,
        details: additionalInfo ?? undefined,
      },
      finalStatus,
    );
  }

  format(...values: any[]): ErrorDefinition {
    let index = 0;

    const formattedDescription = this.description.replace(/\{\}/g, () => {
      return values[index++] ?? '{}';
    });

    return new ErrorDefinition(
      this.errorCode,
      formattedDescription,
      this.defaultStatusCode,
    );
  }
}
