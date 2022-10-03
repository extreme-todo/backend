import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument, TodoSchema } from './schemas/todo.schema';

@Injectable()
export class TodoService {}
