import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { PostRequestDto } from '../dto/postRequest.dto';

@Injectable()
export class PostService {
    constructor(@InjectRepository(Post) private postsRepository: Repository<Post>) {}
    
    findAll(): Promise<Post[]> {
        return this.postsRepository.find();
    }

    async findOne(id: string): Promise<Post> {
        const post = await this.postsRepository.findOneBy({ id });
        if (!post) {
            throw new NotFoundException(id);
        }
        return post;
    }

    async remove(id: string): Promise<boolean> {
        const deleteResult = await this.postsRepository.delete(id);
        if (deleteResult.affected !== undefined && deleteResult.affected !== null && deleteResult.affected > 0) {
            return true;
        }
        throw new NotFoundException(id);
    }

    async create(newPost: PostRequestDto): Promise<Post> {
        return this.postsRepository.save(Post.createFromDto(newPost));
    }

    async update(id: string, updatedPost: PostRequestDto): Promise<boolean>  {
        const updateResult = await this.postsRepository.update(id, Post.createFromDto(updatedPost));
        if (updateResult.affected !== undefined && updateResult.affected !== null && updateResult.affected > 0) {
            return true;
        }
        throw new NotFoundException(id);
    }
}
