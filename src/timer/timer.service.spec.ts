import { Test, TestingModule } from '@nestjs/testing';
import { TimerService } from './timer.service';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { FocusService } from './focus.service';
import { userFocusStub } from './stubs/focusTime.stub';
import { RestService } from './rest.service';
import { userRestStub } from './stubs/restTime.stub';

describe('TimerService', () => {
  let service: TimerService;
  let fakeFocusService: Partial<FocusService>;
  let fakeRestService: Partial<RestService>;
  const fakeUser = { id: 1, email: 'asd@asd.asd', username: 'asd' } as User;

  beforeEach(async () => {
    fakeFocusService = {
      init: (user: User) => {
        return Promise.resolve(userFocusStub(user));
      },
      getTime: (user: User) => {
        return Promise.resolve(userFocusStub(user));
      },
      addTime: (user: User, time: number) => {
        const fakeData = userFocusStub(user);
        fakeData.total += time;
        fakeData.today += time;
        fakeData.thisWeek += time;
        fakeData.thisMonth += time;
        return Promise.resolve(fakeData);
      },
      updateDay: () => Promise.resolve(),
      updateWeek: () => Promise.resolve(),
      updateMonth: () => Promise.resolve(),
    };
    fakeRestService = {
      init: (user: User) => {
        return Promise.resolve(userRestStub(user));
      },
      getTime: (user: User) => {
        return Promise.resolve(userRestStub(user));
      },
      addTime: (user: User, time: number) => {
        const fakeData = userRestStub(user);
        fakeData.total += time;
        fakeData.today += time;
        fakeData.thisWeek += time;
        fakeData.thisMonth += time;
        return Promise.resolve(fakeData);
      },
      updateDay: () => Promise.resolve(),
      updateWeek: () => Promise.resolve(),
      updateMonth: () => Promise.resolve(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimerService,
        { provide: FocusService, useValue: fakeFocusService },
        { provide: RestService, useValue: fakeRestService },
      ],
    }).compile();

    service = module.get(TimerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('init Timers', () => {
    it('특정 fakeUser에 대해 새로운 타이머 정보 추가', async () => {
      const res = await service.initTimer(fakeUser);
      expect(res).toBeUndefined();
    });
  });

  describe('get TotalFocusTime', () => {
    it('특정 fakeUser에 대한 TotalFocusTime', async () => {
      const res = await service.getTotalFocusTime(fakeUser);
      expect(res).toBeDefined();
      expect(res.user).toEqual(fakeUser);
    });
    it('fakeUser에 대한 TotalFocusTime이 존재하지 않을 경우', async () => {
      fakeFocusService.getTime = () => null;
      await expect(service.getTotalFocusTime(fakeUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('get TotalRestTime', () => {
    it('특정 fakeUser에 대한 TotalRestTime', async () => {
      const res = await service.getTotalRestTime(fakeUser);
      expect(res).toBeDefined();
    });
    it('fakeUser에 대한 TotalRestTime이 존재하지 않을 경우', async () => {
      fakeRestService.getTime = () => null;
      await expect(service.getTotalRestTime(fakeUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update FocusTime', () => {
    it('특정 fakeUser가 오늘 1분 더 집중한 경우', async () => {
      const focused = 60000;
      const res = await service.updateFocusTime(focused, fakeUser);
      expect(res.today).toEqual(focused);
    });
  });

  describe('update RestTime', () => {
    it('특정 fakeUser가 오늘 1분 더 휴식한 경우', async () => {
      const focused = 60000;
      const res = await service.updateFocusTime(focused, fakeUser);
      expect(res.today).toEqual(focused);
    });
  });

  describe('update All', () => {
    it('오전 5시마다 업데이트', async () => {
      expect(await service.updateDay()).toBeUndefined();
    });
    it('매주 월요일 오전 5시 업데이트', async () => {
      expect(await service.updateWeek()).toBeUndefined();
    });
    it('매달 1일 오전 5시 업데이트', async () => {
      expect(await service.updateMonth()).toBeUndefined();
    });
  });
});
