import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PostRequestDto } from '../dto/postRequest.dto';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostService } from '../service/post.service';
import { CommentRequestDto } from '../dto/commentRequest.dto';
import { CommentService } from '../service/comment.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { UuidValidationPipe } from 'src/validation/uuidValidation.pipe';
import { PublishSubscribe } from './publishSubscribe';

@Resolver(() => Post)
export class PostResolver {
    constructor(private readonly postService: PostService, private readonly commentService: CommentService) {}

    @Query(returns => Post, { description: 'Get post by ID; Post comments are included' })
    getPost(@Args('id', UuidValidationPipe) id: string): Promise<Post> {
        return this.postService.findOne(id);
    }

    @Query(returns => [Post], { description: 'Get all posts; Post comments are included' })
    getPosts(): Promise<Post[]> {
        return this.postService.findAll();
    }

    @Mutation(returns => Post, { description: 'Create new post' })
    @UseGuards(JwtAuthGuard)
    async createPost(@Args('newPost') newPost: PostRequestDto): Promise<Post> {
        return await this.postService.create(newPost);
    }

    @Mutation(returns => Comment, { description: 'Add comment for the post' })
    async createComment(@Args('postId', UuidValidationPipe) postId: string, @Args('newComment') newComment: CommentRequestDto): Promise<Comment> {
        const comment = this.commentService.create(postId, newComment);
        PublishSubscribe.pubSub.publish(`commentEvent_${postId}`, { commentEvent: comment });
        return comment;
    }

    @Mutation(returns => Boolean, { description: 'Edit existing post' })
    @UseGuards(JwtAuthGuard)
    async updatePost(@Args('id', UuidValidationPipe) id: string, @Args('updatedPost') updatedPost: PostRequestDto): Promise<Boolean> {
        return await this.postService.update(id, updatedPost);
    }

    @Mutation(returns => Boolean, { description: 'Delete post by ID' })
    @UseGuards(JwtAuthGuard)
    async removePost(@Args('id', UuidValidationPipe) id: string): Promise<Boolean> {
        return this.postService.remove(id).then(() => {return true;});
    }

    @Subscription(returns => Comment, { description: 'Subscribe to receive post comment changes (new comments, upvotes and downvotes)' })
    commentEvent(@Args('postId', UuidValidationPipe) postId: string) {
        return PublishSubscribe.pubSub.asyncIterator(`commentEvent_${postId}`);
    }
}
