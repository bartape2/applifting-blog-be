import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { CommentRequestDto } from '../dto/commentRequest.dto';
import { Post } from './post.entity';
import { Vote } from './vote.entity';

@Entity()
@ObjectType({ description: 'Comment related to a post' })
export class Comment {

    @PrimaryGeneratedColumn('uuid')
    @Field(type => ID)
    id: string;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE', lazy: true })
    post: Promise<Post>;

    @Column()
    @Field()
    author: string;

    @Column()
    @Field()
    content: string;

    // The following properties could be used for nested comments
    @ManyToOne((type) => Comment, (comment) => comment.children)
    parent: Comment | null;

    @OneToMany((type) => Comment, (comment) => comment.parent)
    children: Comment[];

    /**
     * Score of the comment based on votes. Saved in the DB in order to avoid loading of votes every time the comment is shown
     */
    @Column({default: 0})
    @Field()
    score: number;

    @CreateDateColumn()
    @Field()
    timestamp: Date;

    @OneToMany(() => Vote, (vote) => vote.comment, { lazy: true })
    votes: Promise<Vote[]>;

    static createFromDto(post: Post, newComment: CommentRequestDto): Comment {
        const comment = new Comment();
        comment.post = Promise.resolve(post);
        comment.author = newComment.author;
        comment.content = newComment.content

        return comment;
    }
}