import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private repo: Repository<Category>){}

    async myCategories (user: User) {
        const categories = await this.repo.find({where: {author: user}});
        return categories
    }

    async findOrCreateCategories (user: User, categories: string[]): Promise<Category[]> {
        if(!categories) return null;
        const newCategories = await Promise.all(categories.map(async category => {
            const searched = await this.find(category);
            if(searched) return searched;
            else return await this.create(user, category);
        }))
        return newCategories;
    }

    async find (name: string): Promise<Category> | null {
        const category = await this.repo.findOne({where: {name}})
        return category
    }

    async create(user: User, name: string){
        try{
            const category = this.repo.create({name, author: user})
            return await this.repo.save(category)
        }catch(err){
            throw new BadRequestException('Category already exists')
        }
    }

}
