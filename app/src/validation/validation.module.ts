import { Global, Module } from '@nestjs/common';
import { UuidValidationPipe } from './uuidValidation.pipe';

@Global()
@Module({
    providers: [UuidValidationPipe],
    exports: [UuidValidationPipe]
})
export class ValidationModule {}