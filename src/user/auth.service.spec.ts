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
            getToken: jest.fn().mockResolvedValue({
              tokens: {
                access_token:
                  'ya29.a0AVVsqme_mjPXQ0l-nzQslSFL4S3_Mob1w-k0r72ZgHMVn9SPMhYg7vsi0Q1tx18Jx8Dvkz66gDPpzNRJjDh_9RTv62J3c8oQOkk1p9yuus-fB0VYwCIX-XkxP7LzKILlHMxBXaCgYKASYSARESFQGbdwaILDIS-lE1ri_Tt2bmQ0163',
                refresh_token:
                  '1//0ePT6C0cdSCfqCAGA4SNwF-L9IrKnQGB7JB8bJVZQUlQ__rDiBqB5er7CGjLZ2HpNLRRB-lxgLjRKeFiYjERu6FV0',
                scope:
                  'https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email',
                token_type: 'Bearer',
                id_token:
                  'eyJhbGciOiJCI6ImI0OWM1MDYyZDg5MGY1Y2U0NDllODkwYzg4ZThkZDZWUwYWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHR1bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MDExNTI5MDQ2NDctZ3Izb2IwcDNvZ3YwbmpsdTZlOHVhbTZhZTN2N3YXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MDExNTI5MDQ2NDctZ3Izb2IwcDNvZ3YwbmpsdTZlOHVhbTZhZTXAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTcxMTU4NjM2MDA4NDcwNDgwMzkiLCJlbWFpbCI6Indpbjk1OTJAZ21haWwuY29tIiwiZW1haWxpZWQiOnRydWUsImF0X2hhc2giOiJkZFNlWEd6NFh1eTc0ekI0ZHRjNTh3IiwibmFtZSI6Im9XSEVObyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BRWRGVHA2Z19rY001SjRud1dsyTHphT1YyaVMyZXJTVzlaWmpRPXM5Ni1jIiwiZ2l2ZW5fbmVObyIsImxvY2FsZSI6ImtvIiwiaWF0IjoxNjc1Nzg0NjA1LCJleHAiOjE2NzU3ODgyMDV9.q5vDYqBmpRGM1R_gpO7uEQ4bJoJHGqUZN4nTRMZGxiRn4CgKTWngG9AoaTByZUSPAmqjC15DBOfVz47xfbARQG5waLP7ouc12ANpGLkckebtrXShKpoFt2-DI3NpEzLzmuJRLIJny8U2nh1WVymqZpHIhwXn1-bwBB-TxXkJP4reif56IUsLpfiQxNa-MMaVrABDKYWxjwMYCBCc8EpsFTuPmkZSDNxEFhRjPKYJqQ92zZbxKBVI3lLS6RlFIglmoaLWrfufJubqZIq8PFRl4YoKpNGPI2-yzy_2tG1I-_H6hCCjemojTg3p7w',
                expiry_date: 1675788204335,
              },
              res: {
                config: {
                  method: 'POST',
                  url: 'https://oauth2.googleapis.com/token',
                  data: 'code=4%2F0AWtgzh5LItxvaKksaEWh391152904647-gr3ob0p3ogv0njlu6e8uam6ae3v7qmmp.apps.googleusercontent.com&client_secret=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&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fusers%2Fcallback%2Fgoogle%2Ffinish&grant_type=authocode&code_verifier=',
                  headers: [Object],
                  paramsSerializer: [Function, 'paramsSerializer'],
                  body: 'code=4%2F0AWtgzh5h39HYlQ0ZTaBNVRHvZKPZdKPJJvhsOTk5wOYTkcVGAWokswamhg&client_id=601152904647-gr3ob0p3u6e8uam6ae3v7qmmp.apps.googleusercontent.com&client_secret=GOCSPXBTr_oZ6anIoUiV3w&redirect_uri=http%3A%2F%2Flocalhost%3pi%2Fusers%2Fcallback%2Fgoogle%2Ffinish&grant_type=authion_code&code_verifier=',
                  validateStatus: [Function, 'validateStatus'],
                  responseType: 'json',
                },
                data: {
                  access_token:
                    'ya29.a0Aqme_mjPXQ0l-nzQTnOlslSFL4S3_Mob1w-k0rs82ZgHMVn9SPMhYg7vsi0Q1txFsGB618Jx8Dvkz66gDPpzNRJjDh_9RTv6k12uqvmkp9yuus-fB0VYwCIX-XkxP7LzKILlHMxBXaCgYKASYSARESFQGbdwaIL6DIS-lE1ri_Tt2bmdXzQ0163',
                  refresh_token:
                    '1//0ePT6C0cdSCfqCgYIASNwF-L9Ir7JB8bJVZQUlQ__rDiBqB5e2k4PHpNLRRB-lxgLjRKeFiYjERzou6FV0',
                  scope:
                    'https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email',
                  token_type: 'Bearer',
                  id_token:
                    'eyJhbGciWM1MDYyZDg5MGY1Y2U0NDllODkwYzg4ZThkZDk4YzRmZWUwYWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MDExNTI5MDQ2NDctZ3Izb2IwcDNvZ3Yw1OTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJkZFNlWEd6NFh1eTc0ekI0ZHRjNTh3IiwibmFtZSI6Im9XSEVObyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BRWRGVHA2Z19rY001SjRud1diSFJqN3NXMmsyTHphT1YyaVMyZXJTVzlaWmpRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Im9XSEVObyIsImxvY2FsZSI6ImtvIiwiaWF0IjoxNjc1Nzg0NjA1LCJleHAiOjE2NzU3ODgyMDV9.q5vDYqBmpRGM1Uy0W7uEQ4bJoJHGqUZN4nTRMZGxiRn4CgKTWngG9AoaTByZUSPAmqjC15DBOfVz47xfbARQG5waLP7ouc12ANpGLkckebtrXShKpoFt2-DI3NpEzLzmuJRLIJny8U2nh1WVymqZpHIhwXn1-bwBB-TxXkJP4reif56IUsLpfiLlgFCd3T6XRQxNa-MMaVrABDKYWxjwMYCBCc8EpsFTuPmkZSDNqQ92zZbxKBVI3lLS6RlFIglmoaLWrfufJubqZIq8PFRPHxsYl4YoKpNGPI2-yzy_2tG1I-_H6hCCjemojTg3p7w',
                  expiry_date: 1675788204335,
                },
                headers: {
                  'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
                  'cache-control':
                    'no-cache, no-store, max-age=0, must-revalidate',
                  connection: 'close',
                  'content-encoding': 'gzip',
                  'content-type': 'application/json; charset=utf-8',
                  date: 'Tue, 07 Feb 2023 15:43:25 GMT',
                  expires: 'Mon, 01 Jan 1990 00:00:00 GMT',
                  pragma: 'no-cache',
                  server: 'scaffolding on HTTPServer2',
                  'transfer-encoding': 'chunked',
                  vary: 'Origin, X-Origin, Referer',
                  'x-content-type-options': 'nosniff',
                  'x-frame-options': 'SAMEORIGIN',
                  'x-xss-protection': '0',
                },
                status: 200,
                statusText: 'OK',
                request: {
                  responseURL: 'https://oauth2.googleapis.com/token',
                },
              },
            }),
            setCredentials: jest.fn(),
            verifyIdToken: jest.fn(({ idToken }) => {
              console.log('⛔️⛔️⛔️ idToken ::: ', idToken);
              if (idToken.startsWith('Invalid')) {
                throw new Error('Invalid token signature');
              } else if (idToken.startsWith('Token used')) {
                throw new Error('Token used too late');
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
                    email: 'example@ex.com',
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
                    email: 'example@ex.com',
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
          id: 6,
          email: userinfo.email,
          username: userinfo.username,
          refresh: userinfo.refresh,
          access: userinfo.access,
          todo: `[{id: 1,date: new Date('Dec 27, 2022 18:00:30'),todo: 'Go to grocery store',duration: 60 * 60,done: true,category: '["chore", "family affair"]',},{id: 2,date: new Date('Dec 29, 2022 18:00:30'),todo: 'Go to Gym',duration: 60 * 60,done: false,category: '["health"]',}]`,
          totalFocusTime:
            '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
          totalRestTime:
            '{today: 123123123,yesterday: 123123123,thisWeek: 123123123,lastWeek: 123123123,thisMonth: 123123123,lastMonth: 123123123,}',
          setting: '{darkmode: true,extrememode: true,}',
        };
        mockUsers.push(newUser);
        return Promise.resolve(newUser);
      },
      updateUser(email: string, attr: Partial<User>) {
        const result = this.findUser(email);
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
    let tokens: Awaited<Promise<GetTokenResponse>>;

    // 새로운 유저인 경우

    // 기존 유저인 경우
    // refresh가 있는 경우..
    // access가 있는 경우...

    describe('getToken method to exchange tokens', () => {
      it('return tokens', async () => {});
    });

    describe('verifyIdToken method to get userinfo', () => {
      it('return userinfo', async () => {
        const mockVerified = await mockGoogleapis.verifyIdToken(
          tokens.tokens.id_token,
        );
        const mockUserinfo = mockGoogleapis.getPayload(mockVerified);

        expect(mockGoogleapis.verifyIdToken).toBeCalledTimes(1);
        expect(mockGoogleapis.verifyIdToken).toBeCalledWith(
          tokens.tokens.id_token,
        );
        expect(mockVerified).toStrictEqual({
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
            email: 'example@ex.com',
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
        });
        expect(mockGoogleapis.getPayload).toBeCalledTimes(1);
        expect(mockUserinfo).toStrictEqual({
          iss: 'https://accounts.google.com',
          azp: '60118052647-gr3gv0njlu6e8uam6ae3v7qmmp.apps.googlecontent.com',
          aud: '60114643757-gr3ob0p3ogv0njlam6ae3v7qmmp.apps.googlecontent.com',
          sub: '117113600847048',
          email: 'example@ex.com',
          email_verified: true,
          at_hash: 'y4woN5g4QGJelH14FjZj9w',
          name: 'owhenno',
          picture:
            'https://lh3.googlecontent.com/a/AEdFTp6g_kcM5J4nwWbHRj7sW2k2LzaOV2iS2erSW9ZZjQ=s96-c',
          given_name: 'owhenno',
          locale: 'ko',
          iat: 16757787,
          exp: 16757617,
        });
      });
    });

    describe('login process', () => {
      it('should register userinfo and return id_token if the user is not in DB', async () => {
        const newUser = {
          email: 'exampleFive@ex.com',
          username: 'mockUsername',
          refresh: 'mock.user.refresh.123123123.token',
          access: 'mock.user.access.123123123.token',
        };
        const isExist = await fakeUserService.createUser(newUser);

        expect(isExist).toBeDefined();
        expect(mockUsers).toHaveLength(5);
      });

      it('just return id_token if the user is in DB', async () => {
        const isExist = await fakeUserService.findUser('exampleFour@ex.com');

        expect(isExist).toBeDefined();
      });
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
