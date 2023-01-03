import { Test, TestingModule } from '@nestjs/testing';
import { TimerService } from './timer.service';
import { NotFoundException } from '@nestjs/common';

describe('TimerService', () => {
  let service: TimerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimerService],
    }).compile();

    service = module.get<TimerService>(TimerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('init Timers', () => {
    it('특정 uid에 대해 새로운 타이머 정보 추가', () => {
      const res = service.initTimer(uid);
      expect(res).toBeDefined;
    });
  });

  describe('get TotalFocusTime', () => {
    it('특정 uid에 대한 TotalFocusTime', () => {
      const res = service.getTotalFocusTime(uid);
      expect(res).toBeDefined;
    });
    it('uid에 대한 TotalFocusTime이 존재하지 않을 경우', async () => {
      await expect(service.getTotalFocusTime(uid)).toThrow(NotFoundException);
    });
  });

  describe('get TotalRestTime', () => {
    it('특정 uid에 대한 TotalRestTime', () => {
      const res = service.getTotalRestTime(uid);
      expect(res).toBeDefined;
    });
    it('uid에 대한 TotalRestTime이 존재하지 않을 경우', async () => {
      await expect(service.getTotalRestTime(uid)).toThrow(NotFoundException);
    });
  });

  describe('update FocusTime', () => {
    it('특정 uid가 오늘 1분 더 집중한 경우', async () => {
      const focused = 60000;
      const res = service.updateFocusTime(focused);
      expect(res.today).toEqual(focused);
    });
  });

  describe('update RestTime', () => {
    it('특정 uid가 오늘 1분 더 휴식한 경우', async () => {
      const focused = 60000;
      const res = service.updateFocusTime(focused);
      expect(res.today).toEqual(focused);
    });
  });

  describe('update All', () => {
    it('오전 5시마다 업데이트', async () => {
      expect(service.updateDay()).toBeCalled();
    });
    it('매주 월요일 오전 5시 업데이트', async () => {
      expect(service.updateWeek().toBeDefined());
    });
    it('매달 1일 오전 5시 업데이트', async () => {
      expect(service.updateMonth()).toBeCalled();
    });
  });
});
