import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentRequestDto } from '../dto/commentRequest.dto';
import { Comment } from '../entities/comment.entity';
import { PostService } from './post.service';

@Injectable()
export class CommentService {
    
    constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>,
        private readonly postService: PostService) {}
    
    async findOne(id: string): Promise<Comment> {
        const comment = await this.commentRepository.findOneBy({ id });
        if (!comment) {
            throw new NotFoundException(id);
        }
        return comment;
    }

    async create(postId: string, newComment: CommentRequestDto): Promise<Comment> {
        return this.postService.findOne(postId).then(async (post) => {
            const comment = Comment.createFromDto(post, newComment);
            return await this.commentRepository.save(comment);
        });
    }
}
