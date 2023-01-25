import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Credentials } from 'google-auth-library';
import { google } from 'googleapis';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

interface IUserdata {
  data: {
    sub: string;
    name: string;
    given_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
  };
}

@Injectable()
export class UserService {
  constructor(
    private config: ConfigService,
    @InjectRepository(User) private repo: Repository<User>,
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

    return this.login(tokens);
  }

  // token으로 로그인 처리해주기
  private async login(tokens: Credentials) {
    // 토큰이 없을 때 예외처리
    // TODO : 이 과정에서 어떻게 해야 하나? 아예 그럴 경우가 없는 것인가?
    if (!tokens) {
      throw new Error('token이 없습니다.');
    }

    const { data: userinfo }: Awaited<Promise<IUserdata>> = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    // 기존 유저인가요?
    const isExistUser = await this.repo.findOne({
      where: { email: userinfo.email },
    });

    const loginUser = {
      username: userinfo.name,
      email: userinfo.email,
      token: tokens.access_token,
    };

    // 기존 유저이면 로그인 처리 끝
    // QUESTION : refresh token의 expire이 없다면 굳이 새롭게 재발급 되었는지 확인해서 할 필요.. 가 있긴 하겠다. 설령 누군가 어플리케이션 승인을 해제했다가 재승인을 하면 refresh token을 재 저장해야 한다.
    if (isExistUser) {
      console.log('⛔️⛔️⛔️ 여기는 오면 안되는데..');
      if (tokens.refresh_token) {
        console.log('🔑🔑🔑 새로운 refresh 토큰!!');
        const newRefresh = { refresh: tokens.refresh_token };
        console.log(isExistUser.refresh, ' ::: ', newRefresh);
        Object.assign(isExistUser, newRefresh);
        this.repo.save(isExistUser);
      }
      return loginUser;
    }

    // 기존 유저가 아니라면 DB 새로 등록하기
    const newUserInfo = {
      username: userinfo.name,
      email: userinfo.email,
      refresh: tokens.refresh_token,
    };
    console.log(newUserInfo);
    this.repo.save(newUserInfo);
    return loginUser;
  }
}
