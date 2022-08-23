import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UuidValidationPipe } from 'src/validation/uuidValidation.pipe';
import { Comment } from '../entities/comment.entity';
import { CommentService } from '../service/comment.service';
import { VoteService } from '../service/vote.service';
import { Ip } from './ip.decorator';
import { PublishSubscribe } from './publishSubscribe';

@Resolver(() => Comment)
export class CommentResolver {
    
    constructor(private readonly voteService: VoteService, private readonly commentService: CommentService) {}

    @Mutation(returns => Boolean,
        { description: 'Upvote given comment; Only one vote for comment from one IP allowed.' })
    async upvoteComment(@Args('commentId', UuidValidationPipe) commentId: string, @Ip() ip: string): Promise<Boolean> {
        await this.voteService.create(commentId, ip, true);
        const comment = await this.commentService.findOne(commentId);
        const post = await comment.post;
        PublishSubscribe.pubSub.publish(`commentEvent_${post.id}`, { commentEvent: comment });
        return true;
    }

    @Mutation(returns => Boolean,
        { description: 'Downvote given comment; Only one vote for comment from one IP allowed.' })
    async downvoteComment(@Args('commentId', UuidValidationPipe) commentId: string, @Ip() ip: string): Promise<Boolean> {
        await this.voteService.create(commentId, ip, false);
        const comment = await this.commentService.findOne(commentId);
        const post = await comment.post;
        PublishSubscribe.pubSub.publish(`commentEvent_${post.id}`, { commentEvent: comment });
        return true;
    }
}