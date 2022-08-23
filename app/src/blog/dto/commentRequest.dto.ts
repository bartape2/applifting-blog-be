import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@InputType()
export class CommentRequestDto {
    @ApiProperty()
    @Field()
    @IsString()
    author: string;

    @ApiProperty()
    @Field()
    @IsString()
    content: string;
}