import {
  DeepPartial,
  FindOneOptions,
  RemoveOptions,
  SaveOptions,
} from 'typeorm';
import { Setting } from './entities/setting.entity';

export const mockSettingRepo = {
  create(entityLike: DeepPartial<Setting>) {
    return { id: 1, colorMode: 'auto', extremeMode: true } as Setting;
  },
  save(entity: Setting, options?: SaveOptions) {
    return Promise.resolve(entity);
  },
  findOne(options: FindOneOptions<Setting>) {
    return { id: 1, colorMode: 'auto', extremeMode: true } as Setting;
  },
  remove(entity: Setting, options?: RemoveOptions) {
    return Promise.resolve();
  },
};
