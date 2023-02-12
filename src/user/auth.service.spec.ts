import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { userStub } from './stub/user.stub';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { google } from 'googleapis';
jest.mock('googleapis', () => {
  return {
    google: {
      auth: {
        OAuth2: jest.fn().mockImplementation(() => {
          return {
            generateAuthUrl: jest
              .fn()
              .mockReturnValue('www.generateAuthUrl.com/callback/finish'),
            getToken: jest.fn((tokens) => {
              if (tokens === 'newUser') {
                return {
                  tokens: {
                    id_token: 'newUser',
                  },
                };
              } else {
                return {
                  tokens: {
                    id_token: 'oldOne',
                    refresh_token: 'aafi47s$dfAfiv9(43uqflc43iufahisd%$@sau',
                    access_token: 'aafi47s$dfAfiv9(43uqflc43iufahisd%$@sau',
                  },
                };
              }
            }),
            setCredentials: jest.fn(),
            verifyIdToken: jest.fn(({ idToken }) => {
              if (idToken.startsWith('Invalid')) {
                throw new Error('Invalid token signature');
              } else if (idToken.startsWith('Token used')) {
                throw new Error('Token used too late');
              } else if (idToken.startsWith('newUser')) {
                return {
                  envelope: {
                    alg: 'TS526',
                    kid: 'b49q5e32d8q6f5ce43ne8t33c88d98c4fee0ab',
                    typ: 'JWT',
                  },
                  payload: {
                    iss: 'https://accounts.google.com',
                    azp: '60118052647-gr3gv0njlu6e8uam6ae3v7qmmp.apps.googlecontent.com',
                    aud: '60114643757-gr3ob0p3ogv0njlam6ae3v7qmmp.apps.googlecontent.com',
                    sub: '117113600847048',
                    email: 'exampleSix@ex.com',
                    email_verified: true,
                    at_hash: 'y4woN5g4QGJelH14FjZj9w',
                    name: 'newOne',
                    picture:
                      'https://lh3.googlecontent.com/a/AEdFTp6g_kcM5J4nwWbHRj7sW2k2LzaOV2iS2erSW9ZZjQ=s96-c',
                    given_name: 'newOne',
                    locale: 'ko',
                    iat: 16757787,
                    exp: 16757617,
                  },
                  getPayload: jest.fn().mockReturnValue({
                    iss: 'https://accounts.google.com',
                    azp: '60118052647-gr3gv0njlu6e8uam6ae3v7qmmp.apps.googlecontent.com',
                    aud: '60114643757-gr3ob0p3ogv0njlam6ae3v7qmmp.apps.googlecontent.com',
                    sub: '117113600847048',
                    email: 'exampleSixth@ex.com',
                    email_verified: true,
                    at_hash: 'y4woN5g4QGJelH14FjZj9w',
                    name: 'newOne',
                    picture:
                      'https://lh3.googlecontent.com/a/AEdFTp6g_kcM5J4nwWbHRj7sW2k2LzaOV2iS2erSW9ZZjQ=s96-c',
                    given_name: 'newOne',
                    locale: 'ko',
                    iat: 16757787,
                    exp: 16757617,
                  }),
                };
              } else {
                return {
                  envelope: {
                    alg: 'TS526',
                    kid: 'b49q5e32d8q6f5ce43ne8t33c88d98c4fee0ab',
                    typ: 'JWT',
                  },
                  payload: {
                    iss: 'https://accounts.google.com',
                    azp: '60118052647-gr3gv0njlu6e8uam6ae3v7qmmp.apps.googlecontent.com',
                    aud: '60114643757-gr3ob0p3ogv0njlam6ae3v7qmmp.apps.googlecontent.com',
                    sub: '117113600847048',
                    email: 'exampleOne@ex.com',
                    email_verified: true,
                    at_hash: 'y4woN5g4QGJelH14FjZj9w',
                    name: 'owhenno',
                    picture:
                      'https://lh3.googlecontent.com/a/AEdFTp6g_kcM5J4nwWbHRj7sW2k2LzaOV2iS2erSW9ZZjQ=s96-c',
                    given_name: 'owhenno',
                    locale: 'ko',
                    iat: 16757787,
                    exp: 16757617,
                  },
                  getPayload: jest.fn().mockReturnValue({
                    iss: 'https://accounts.google.com',
                    azp: '60118052647-gr3gv0njlu6e8uam6ae3v7qmmp.apps.googlecontent.com',
                    aud: '60114643757-gr3ob0p3ogv0njlam6ae3v7qmmp.apps.googlecontent.com',
                    sub: '117113600847048',
                    email: 'exampleOne@ex.com',
                    email_verified: true,
                    at_hash: 'y4woN5g4QGJelH14FjZj9w',
                    name: 'owhenno',
                    picture:
                      'https://lh3.googlecontent.com/a/AEdFTp6g_kcM5J4nwWbHRj7sW2k2LzaOV2iS2erSW9ZZjQ=s96-c',
                    given_name: 'owhenno',
                    locale: 'ko',
                    iat: 16757787,
                    exp: 16757617,
                  }),
                };
              }
            }),
            refreshAccessToken: jest.fn().mockResolvedValue({
              credentials: {
                id_token: 'new321321321321',
                access_token: 'new123123123123',
              },
            }),
          };
        }),
      },
    },
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;
  let mockUsers: User[];

  beforeEach(async () => {
    mockUsers = userStub();
    fakeUserService = {
      findUser(email: string) {
        const user = mockUsers.filter((el) => el.email === email)[0];
        return Promise.resolve(user);
      },
      createUser(userinfo: CreateUserDto) {
        const newUser = {
          email: userinfo.email,
          username: userinfo.username,
          refresh: userinfo.refresh,
          access: userinfo.access,
          // todo: `[{id: 1,date: new Date('Dec 27, 2022 18:00:30'),todo: 'Go to grocery store',duration: 60 * 60,done: true,category: '["chore", "family affair"]',},{id: 2,date: new Date('Dec 29, 2022 18:00:30'),todo: 'Go to Gym',duration: 60 * 60,done: false,category: '["health"]',}]`,
          // totalFocusTime:
          //   '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
          // totalRestTime:
          //   '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
          // setting: '{darkmode: true,extrememode: true,}',
          // categories: '',
        } as User;
        mockUsers.push(newUser);
        return Promise.resolve(newUser);
      },
      async updateUser(email: string, attr: Partial<User>) {
        const result = await this.findUser(email);
        Object.assign(result, attr);
        return Promise.resolve(result);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: fakeUserService },
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('googleLoginApi', () => {
    it('return auth url', async () => {
      const url = service.googleLoginApi();
      expect(url).toBeDefined();
    });
  });

  describe('googleCallback', () => {
    // let tokens: Awaited<Promise<GetTokenResponse>>;

    it('should push new userinfo to DB', async () => {
      // getToken에 특정 문구를 인위적으로 넣어주면 새로운 유저 정보를 반환한다.
      await service.googleCallback('newUser');
      expect(mockUsers.length).toBeGreaterThan(4);
    });

    it('should update tokeninfo to DB', async () => {
      await service.googleCallback('oldOne');
      expect(userStub()[0].refresh).not.toEqual(mockUsers[0].refresh);
      expect(userStub()[0].access).not.toEqual(mockUsers[0].access);
    });
  });

  describe('verifiedTokens', () => {
    it('should return userinfo', async () => {
      const userinfo = await service.verifiedIdToken(
        'exampleTwo@ex.com',
        'Token used',
      );
      expect(userinfo).toBeDefined();
    });

    it('should refresh id_token tokens and return userinfo', async () => {
      const oldTokens = await service.verifiedIdToken(
        'exampleTwo@ex.com',
        'Token used',
      );
      expect(oldTokens).toBeDefined();
    });

    it('should throw BadRequestException', async () => {
      await expect(
        service.verifiedIdToken('exampleTwo@ex.com', 'Invalid'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
