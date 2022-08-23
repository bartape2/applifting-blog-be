import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType({ description: 'Succesfull login response' })
export class LoginResponseDto {

    @ApiProperty()
    @Field({description: 'To be used as a Bearer token for authorization for creation/modification of posts'})
    accessToken: string;

    constructor(authToken: string) {
        this.accessToken = authToken;
    }
}