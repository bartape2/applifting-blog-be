import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class UuidValidationPipe implements PipeTransform<string> {
    async transform(value: string, metatype: ArgumentMetadata) {
        const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

        if (uuidRegex.test(value)) {
            return value;
        }

        throw new BadRequestException('Incorrect UUID format');
    }
}