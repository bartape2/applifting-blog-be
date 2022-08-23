import { IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class PostRequestDto {
    @ApiProperty()
    @Field()
    @IsString()
    title: string;

    @ApiProperty()
    @Field()
    @IsString()
    perex: string;

    @ApiProperty()
    @Field()
    @IsString()
    content: string;
}