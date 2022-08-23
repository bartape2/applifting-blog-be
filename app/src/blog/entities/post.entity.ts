import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { PostRequestDto } from '../dto/postRequest.dto';
import { Comment } from './comment.entity';

@Entity()
@ObjectType({ description: 'Single post on the blog' })
export class Post {

    @PrimaryGeneratedColumn('uuid')
    @Field(type => ID)
    id: string;

    @Column()
    @Field()
    title: string;

    @Column()
    @Field()
    perex: string;

    @Column()
    @Field()
    content: string;

    @UpdateDateColumn()
    @Field()
    timestamp: Date;

    @OneToMany(() => Comment, (comment) => comment.post, {
        // Lazy loading may be a better option here - the comments are not always necessary
        eager: true
    })
    @Field(type => [Comment])
    comments: Comment[];

    static createFromDto(newPost: PostRequestDto): Post {
        const post = new Post();
        post.title = newPost.title;
        post.perex = newPost.perex;
        post.content = newPost.content;

        return post;
    }
}