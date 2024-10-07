import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { URLSearchParams } from 'node:url';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private config: ConfigService,
  ) {}

  private CLIENT_ID = this.config.get('OAUTH_ID');
  private CLIENT_PW = this.config.get('OAUTH_PW');
  private REDIRECT_URL = this.config.get('REDIRECT_URL');
  private CLIENT_URL = this.config.get('CLIENT_URL');
  private oauth2Client = new google.auth.OAuth2(
    this.CLIENT_ID,
    this.CLIENT_PW,
    this.REDIRECT_URL,
  );

  // google oauth2 flow start
  googleLoginApi() {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      // 점진적 승인 => 어플리케이션이 점진적 승인을 사용하여 컨텍스트에서 추가 범위에 대한 엑세스를 요청할 수 있도록 한다. false로 하면 scope가 요청한 범위만 포함한다.
      include_granted_scopes: false,
    });
    return url;
  }

  // authCode를 token으로 바꾸기
  async googleCallback(authCode: string) {
    const { tokens } = await this.oauth2Client.getToken(authCode);
    // QUESTION : 'setCredentials' :: Sets the auth credentials. 이거 뭔지 찾아보기..
    this.oauth2Client.setCredentials(tokens);
    // token으로 로그인 처리해주기
    if (!tokens) {
      throw new BadRequestException('tokens not found');
    }

    const idtoken = await this.oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: this.CLIENT_ID,
    });
    const userinfo = idtoken.getPayload();

    // 기존 유저인가요?
    const isExistUser = await this.userService.findUser(userinfo.email);

    const loginUser = {
      username: userinfo.name,
      email: userinfo.email,
      token: tokens.id_token,
    };

    const params = new URLSearchParams(loginUser);
    const client = `${this.CLIENT_URL}?${params}`;

    // 기존 유저이면 로그인 처리 끝
    if (isExistUser) {
      if (tokens.refresh_token) {
        this.userService.updateUser(userinfo.email, {
          refresh: tokens.refresh_token,
        });
      }
      if (tokens.access_token) {
        this.userService.updateUser(userinfo.email, {
          access: tokens.access_token,
        });
      }
      return client;
    }

    // 기존 유저가 아니라면 DB 새로 등록하기
    const newUserInfo = {
      username: userinfo.name,
      email: userinfo.email,
      refresh: tokens.refresh_token,
      access: tokens.access_token,
    };

    this.userService.createUser(newUserInfo);

    return client;
  }

  // id_tokens 토큰 검증
  async verifiedIdToken(email: string, token: string) {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: token,
        audience: this.CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.userService.findUser(email);

      return {
        userdata: user,
        id_token: token,
      };
    } catch (err) {
      if (err.message.startsWith('Invalid token signature')) {
        throw new BadRequestException('invalid id tokens');
      } else if (err.message.startsWith('Token used too late')) {
        // 토큰 재발급!
        const newUserInfo = await this.refreshTokens(email);
        return { ...newUserInfo, old_token: token };
      } else if (err.message.includes('No pem found for envelope')) {
        // 인증서 캐시 문제 : 새로 인증서 가져오기
        await this.oauth2Client.getFederatedSignonCertsAsync(); // 인증서 강제 갱신
        throw new UnauthorizedException('Invalid certificate for token');
      } else {
        // 그 외의 경우 에러처리(아예 권한이 없는 경우?.. 토큰이 없거나 등등)
        throw new UnauthorizedException('unauthorized user');
      }
    }
  }

  // 토큰 재발급받기
  private async refreshTokens(email: string) {
    const user = await this.userService.findUser(email);
    this.oauth2Client.setCredentials({ refresh_token: user.refresh });
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      user.access = credentials.access_token;
      this.userService.updateUser(email, { access: user.access });
      const userinfo = {
        userdata: user,
        id_token: credentials.id_token,
      };
      return userinfo;
    } catch (err) {
      throw new BadRequestException('invalid refreshTokens', err);
    }
  }

  async revokeToken(user: User) {
    try {
      await this.userService.removeUser(user);
      const res2 = await this.oauth2Client.revokeToken(user.access);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
