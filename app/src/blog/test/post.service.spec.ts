import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { PostRequestDto } from '../dto/postRequest.dto';
import { Post } from '../entities/post.entity';
import { PostService } from '../service/post.service';
import { randomUUID } from 'crypto';

const post1 = new Post();
post1.id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
post1.title = 'Post 1 Title';
post1.perex = 'Post 1 perex';
post1.content = 'Post 1 content';

const post2 = new Post();
post2.id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
post2.title = 'Post 2 Title';
post2.perex = 'Post 2 perex';
post2.content = 'Post 2 content';

let mockedStorage = [post1, post2];

let createdPostId: string;

describe('PostService', () => {
    let service: PostService;


    const mockedRepo = {
        // mock the repo `findOneOrFail`
        findOneBy: jest.fn((filter: {id: string}) => {
            for (const p of mockedStorage) {
                if (p.id === filter.id) {
                    return p;
                }
            }
            return null;
        }),
        find: jest.fn(() => {
            return mockedStorage;
        }),
        save: jest.fn((newPost: PostRequestDto) => {
            const newPostEntity = Post.createFromDto(newPost);
            newPostEntity.id = randomUUID();
            newPostEntity.timestamp = new Date();

            mockedStorage.push(newPostEntity);

            return newPostEntity;
        }),
        update: jest.fn((id: string, post: Post) => {
            for (const p of mockedStorage) {
                if (p.id === id) {
                    p.title = post.title;
                    p.perex = post.perex;
                    p.content = post.content;
                    return {affected: 1};
                }
            }
            return {affected: 0};
        }),
        delete: jest.fn((id: string) => {
            const originalSize = mockedStorage.length;
            mockedStorage = mockedStorage.filter((post) => post.id != id);
            const newSize = mockedStorage.length;
            return {affected: originalSize - newSize};
        })
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                {
                    provide: getRepositoryToken(Post),
                    useValue: mockedRepo,
                },
            ]
        })
        .compile();

        service = module.get<PostService>(PostService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return all posts', async () => {
        expect(await service.findAll()).toEqual([post1, post2]);
    });

    it('should return post 1', async () => {
        expect(await service.findOne('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')).toEqual(post1);
    });

    it('should return post 2', async () => {
        expect(await service.findOne('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')).toEqual(post2);
    });

    it('should throw NotFoundException when accessing non-existent post', async () => {
        try {
            await service.findOne('cccccccc-cccc-cccc-cccc-cccccccccccc');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            return;
        }
        throw new Error('Should have thrown NotFoundException');
    });

    it('should delete post 1', async () => {
        expect(await service.remove('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')).toEqual(true);
    });

    it('should throw an exception when deleting a deleted post', async () => {
        try {
            await service.findOne('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            return;
        }
        throw new Error('Should have thrown NotFoundException');
    });

    it('should throw NotFoundException when accessing deleted post 1', async () => {
        try {
            await service.findOne('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            return;
        }
        throw new Error('Should have thrown NotFoundException');
    });

    it('should return post 2 only', async () => {
        expect(await service.findAll()).toEqual([post2]);
    });

    it('should delete post 2', async () => {
        expect(await service.remove('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')).toEqual(true);
    });

    it('should return an empty array', async () => {
        expect(await service.findAll()).toEqual([]);
    });

    it('should create new post', async () => {
        const postToCreate = new PostRequestDto();
        postToCreate.title = 'Added post';
        postToCreate.perex = 'p';
        postToCreate.content = 'c';
        
        const createdPost = await service.create(postToCreate)

        expect(createdPost.title).toEqual(postToCreate.title);
        expect(createdPost.perex).toEqual(postToCreate.perex);
        expect(createdPost.content).toEqual(postToCreate.content);
        expect(typeof createdPost.id).toBe('string');
        expect(createdPost.timestamp).toBeInstanceOf(Date);
    });

    it('should create existing post', async () => {
        const postToCreate = new PostRequestDto();
        postToCreate.title = 'Added post';
        postToCreate.perex = 'p';
        postToCreate.content = 'c';
        
        const createdPost = await service.create(postToCreate);

        expect(createdPost.title).toEqual(postToCreate.title);
        expect(createdPost.perex).toEqual(postToCreate.perex);
        expect(createdPost.content).toEqual(postToCreate.content);
        expect(typeof createdPost.id).toEqual('string');
        expect(createdPost.timestamp).toBeInstanceOf(Date);

        createdPostId = createdPost.id;
    });

    it('should edit existing post', async () => {
        const postToEdit = new PostRequestDto();
        postToEdit.title = 'Edited post';
        postToEdit.perex = 'p - e';
        postToEdit.content = 'c - e';
        
        expect(await service.update(createdPostId, postToEdit)).toEqual(true);

        const editedPost = await service.findOne(createdPostId);

        expect(editedPost.title).toEqual(postToEdit.title);
        expect(editedPost.perex).toEqual(postToEdit.perex);
        expect(editedPost.content).toEqual(postToEdit.content);
        expect(editedPost.id).toEqual(createdPostId);
        expect(editedPost.timestamp).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException when trying to edit non existing post', async () => {
        try {
            const postToEdit = new PostRequestDto();
            postToEdit.title = 'Edited post';
            postToEdit.perex = 'p - e';
            postToEdit.content = 'c - e';
            
            expect(await service.update('ffffaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaf', postToEdit)).toEqual(true);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            return;
        }
        throw new Error('Should have thrown NotFoundException');
    });
});
