import { Controller, HttpStatus, Ip, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UuidValidationPipe } from 'src/validation/uuidValidation.pipe';
import { CommentResolver } from '../resolver/comment.resolver';

@Controller('comment')
@ApiTags('Comment voting')
export class CommentController {
    
    constructor(private commentResolver: CommentResolver) {}

    // Here could be CRUD operations for comments

    @Put(':commentId/upvote')
    @ApiOperation({ summary: 'Upvote given comment', description: 'Only one vote for comment from one IP allowed.' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Vote accepted'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Comment does not exist'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Vote for given command from clients IP already exists'
    })
    async upvoteComment(@Param('commentId', UuidValidationPipe) commentId: string, @Ip() ip: string): Promise<void> {
        await this.commentResolver.upvoteComment(commentId, ip);
    }

    @Put(':commentId/downvote')
    @ApiOperation({ summary: 'Downvote given comment', description: 'Only one vote for comment from one IP allowed.' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Vote accepted'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Comment does not exist'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Vote for given command from clients IP already exists'
    })
    async downvoteComment(@Param('commentId', UuidValidationPipe) commentId: string, @Ip() ip: string): Promise<void> {
        await this.commentResolver.downvoteComment(commentId, ip);
    }
}