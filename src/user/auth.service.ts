import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private config: ConfigService,
  ) {}

  #CLIENT_ID = this.config.get('OAUTH_ID');
  #CLIENT_PW = this.config.get('OAUTH_PW');
  #REDIRECT_URL = this.config.get('REDIRECT_URL');
  #oauth2Client = new google.auth.OAuth2(
    this.#CLIENT_ID,
    this.#CLIENT_PW,
    this.#REDIRECT_URL,
  );

  // google oauth2 flow start
  googleLoginApi() {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const url = this.#oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      // 점진적 승인 => 어플리케이션이 점진적 승인을 사용하여 컨텍스트에서 추가 범위에 대한 엑세스를 요청할 수 있도록 한다. false로 하면 scope가 요청한 범위만 포함한다.
      include_granted_scopes: false,
    });
    return url;
  }

  // authCode를 token으로 바꾸기
  async googleCallback(authCode: string) {
    const { tokens } = await this.#oauth2Client.getToken(authCode);
    // QUESTION : 'setCredentials' :: Sets the auth credentials. 이거 뭔지 찾아보기..
    this.#oauth2Client.setCredentials(tokens);

    // token으로 로그인 처리해주기
    if (!tokens) {
      throw new BadRequestException('tokens not found');
    }

    const idtoken = await this.#oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
    });
    const userinfo = idtoken.getPayload();

    // 기존 유저인가요?
    const isExistUser = await this.userService.findUser(userinfo.email);

    const loginUser = {
      username: userinfo.name,
      email: userinfo.email,
      token: tokens.id_token,
    };

    // 기존 유저이면 로그인 처리 끝
    if (isExistUser) {
      if (tokens.refresh_token) {
        isExistUser.refresh = tokens.refresh_token;
        this.userService.createUser(isExistUser);
      }
      if (tokens.access_token) {
        isExistUser.access = tokens.access_token;
        this.userService.createUser(isExistUser);
      }
      return loginUser;
    }

    // 기존 유저가 아니라면 DB 새로 등록하기
    const newUserInfo = {
      username: userinfo.name,
      email: userinfo.email,
      refresh: tokens.refresh_token,
      access: tokens.access_token,
    };

    this.userService.createUser(newUserInfo);
    return loginUser;
  }
}
