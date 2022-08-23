import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { PostResolver } from './resolver/post.resolver';
import { CommentService } from './service/comment.service';
import { VoteService } from './service/vote.service';
import { Vote } from './entities/vote.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommentController } from './controller/comment.controller';
import { CommentResolver } from './resolver/comment.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([Post, Comment, Vote]), AuthModule],
    controllers: [PostController, CommentController],
    providers: [PostResolver, CommentResolver, PostService, CommentService, VoteService],
})
export class BlogModule {}