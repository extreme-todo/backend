import { Test, TestingModule } from '@nestjs/testing';
import { SettingService } from './setting.service';
import { User } from '../user/entities/user.entity';
import { Setting } from './entities/setting.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockSettingRepo } from './mock-setting.repository';
import { NotFoundException } from '@nestjs/common';

describe('SettingService', () => {
  let service: SettingService;
  let fakeSettingRepo = mockSettingRepo;
  const fakeUser = { email: 'asd@asd.asd', username: 'asdasd', id: 1 } as User;

  beforeEach(async () => {
    fakeSettingRepo = { ...mockSettingRepo };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingService,
        { provide: getRepositoryToken(Setting), useValue: fakeSettingRepo },
      ],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('설정 조회', () => {
    it('설정 조회', async () => {
      const setting = await service.find(fakeUser);
      expect(setting).toBeDefined();
    });
    it('설정 조회 실패', async () => {
      fakeSettingRepo.findOne = () => null;
      await expect(service.find(fakeUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('설정변경', () => {
    it('다크 모드, 익스트림모드 on', async () => {
      const currMode = await service.update(fakeUser, {
        colorMode: 'dark',
        extremeMode: true,
      });
      expect(currMode.colorMode).toEqual('dark');
      expect(currMode.extremeMode).toEqual(true);
    });
    it('라이트모드, 익스트림모드 off', async () => {
      const currMode = await service.update(fakeUser, {
        colorMode: 'light',
        extremeMode: false,
      });
      expect(currMode.colorMode).toEqual('light');
      expect(currMode.extremeMode).toEqual(false);
    });
    it('자동색상, 익스트림모드 on', async () => {
      const currMode = await service.update(fakeUser, {
        colorMode: 'auto',
        extremeMode: true,
      });
      expect(currMode.colorMode).toEqual('auto');
      expect(currMode.extremeMode).toEqual(true);
    });
  });

  describe('설정 초기화', () => {
    it('설정 데이터 추가', async () => {
      const currMode = await service.init(fakeUser);
      expect(currMode.extremeMode).toEqual(true);
      expect(currMode.colorMode).toEqual('auto');
    });
    it('설정 리셋', async () => {
      const currMode = await service.reset(fakeUser);
      expect(currMode.extremeMode).toEqual(true);
      expect(currMode.colorMode).toEqual('auto');
    });
  });

  describe('설정삭제', () => {
    it('설정 데이터 추가', async () => {
      const currMode = await service.init(fakeUser);
      expect(currMode.extremeMode).toEqual(true);
      expect(currMode.colorMode).toEqual('auto');
    });
    it('설정삭제', async () => {
      fakeSettingRepo.findOne = () => undefined;
      await expect(service.remove(fakeUser)).rejects.toThrow(NotFoundException);
    });
  });
});
