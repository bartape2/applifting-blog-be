import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CommentService } from './comment.service';
import { Vote } from '../entities/vote.entity';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class VoteService {
    constructor(
        @InjectRepository(Vote)
        private voteRepository: Repository<Vote>, private commentService: CommentService,
        private dataSource: DataSource
    ) {}

    findOne(commentId: string, ip: string): Promise<Vote | null> {
        return this.voteRepository.findOneBy({commentId, ip});
    }
    
    async create(commentId: string, ip: string, isUpvote: boolean): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingVote = await this.findOne(commentId, ip);
            if (existingVote !== null) {
                throw new ConflictException('You have already voted for this comment');
            }
            const comment = await this.commentService.findOne(commentId);
            if (isUpvote) {
                comment.score++;
            } else {
                comment.score--;
            }
            await queryRunner.manager.update(Comment, {id: comment.id}, {score: comment.score});
            await queryRunner.manager.insert(Vote, Vote.createFromDto(comment, isUpvote, ip));
        
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
