import { Body, Controller, Delete, Get, Param, Post as PostMethod, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { UuidValidationPipe } from 'src/validation/uuidValidation.pipe';
import { CommentRequestDto } from '../dto/commentRequest.dto';
import { PostRequestDto } from '../dto/postRequest.dto';
import { Comment } from '../entities/comment.entity';
import { Post } from '../entities/post.entity';
import { PostResolver } from '../resolver/post.resolver';

@Controller('post')
@ApiTags('Posts & Comments')
export class PostController {

    constructor(private postResolver: PostResolver) {}

    @Get()
    @ApiOperation({ summary: 'Get all posts', description: 'Post comments are included' })
    getAll(): Promise<Post[]> {
        return this.postResolver.getPosts();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get post by ID', description: 'Post comments are included' })
    async getOne(@Param('id', UuidValidationPipe) id: string): Promise<Post> {
        const post = await this.postResolver.getPost(id);
        return post;
    }

    @PostMethod()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create new post' })
    @ApiBearerAuth()
    create(@Body() newPost: PostRequestDto): Promise<Post> {
        return this.postResolver.createPost(newPost);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Edit existing post' })
    @ApiBearerAuth()
    update(@Param('id', UuidValidationPipe) id: string, @Body() updatedPost: PostRequestDto) {
        return this.postResolver.updatePost(id, updatedPost);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete post by ID' })
    @ApiBearerAuth()
    async delete(@Param('id', UuidValidationPipe) id: string) {
        await this.postResolver.removePost(id);
    }

    @PostMethod(':postId/comment')
    @ApiOperation({ summary: 'Add comment for the post' })
    addComment(@Param('postId', UuidValidationPipe) postId: string, @Body() newComment: CommentRequestDto): Promise<Comment> {
        return this.postResolver.createComment(postId, newComment);
    }
}
