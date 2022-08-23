import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Comment } from './comment.entity';

// Comment vote. Max one vote for each comment from one IP
@Entity()
export class Vote {

    @PrimaryColumn('uuid')
    commentId: string;

    @ManyToOne(() => Comment, (comment) => comment.votes, {
        createForeignKeyConstraints: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'commentId'})
    comment: Comment;

    @PrimaryColumn()
    ip: string;

    @Column()
    isUpvote: boolean;

    static createFromDto(comment: Comment, isUpvote: boolean, ip: string): Vote {
        const vote = new Vote();
        vote.comment = comment;
        vote.isUpvote = isUpvote;
        vote.ip = ip;

        return vote;
    }
}