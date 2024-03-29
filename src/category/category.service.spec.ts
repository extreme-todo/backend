import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { mockCategoryRepo } from './mock-category.repository';
import {
  categoryStub,
  fakeUserHasACategory_1,
  fakeUserHasNoCategory,
} from './stubs/category.stub';

describe('CategoryService', () => {
  let service: CategoryService;
  const fakeUser: User = fakeUserHasNoCategory;
  const fakeUser1: User = fakeUserHasACategory_1;
  const fakeRepository = mockCategoryRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: getRepositoryToken(Category), useValue: fakeRepository },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  describe('사용한 카테고리 목록 조회', () => {
    it('카테고리 목록 조회', async () => {
      const categories = await service.myCategories(fakeUser);
      expect(categories).toBeDefined();
    });
  });

  describe('string[]을 받아 Category[]를 리턴', () => {
    it('이미 등록된 카테고리 2개를 입력한 경우', async () => {
      const input = categoryStub()
        .slice(0, 2)
        .map((x) => x.name);
      const categories = await service.findOrCreateCategories(input);
      expect(categories).toEqual(categoryStub());
    });
    it('미등록 카테고리 2개만 입력한 경우', async () => {
      const input = ['study', 'work'];
      const categories = await service.findOrCreateCategories(input);
      expect(categories).toHaveLength(2);
    });
    it('등록된 카테고리 2개와 미등록 카테고리 2개를 입력한 경우', async () => {
      const input = [
        ...categoryStub()
          .slice(0, 2)
          .map((x) => x.name),
        'study',
        'work',
      ];
      const categories = await service.findOrCreateCategories(input);
      expect(categories).toHaveLength(4);
    });
  });

  describe('string을 받아 Category를 리턴', () => {
    it('등록된 카테고리인 경우', async () => {
      const input = categoryStub()[0].name;
      const category = await service.find(input);
      expect(category).toBeDefined();
      expect(category.name).toEqual(input);
    });
    it('미등록 카테고리인 경우', async () => {
      const input = 'study';
      const category = await service.find(input);
      expect(category).toBeUndefined();
    });
  });

  describe('string을 받아 새로운 Category 생성', () => {
    it('미등록 카테고리인 경우', async () => {
      const input = 'study';
      const category = await service.create(input);
      expect(category).toBeDefined();
      expect(category.name).toEqual(input);
    });
    it('등록된 카테고리인 경우 오류 발생', async () => {
      const input = 'math';
      fakeRepository.create = () => {
        throw new Error();
      };
      await expect(service.create(input)).rejects.toThrow(BadRequestException);
    });
  });
});
