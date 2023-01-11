import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Credentials } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable()
export class UserService {
  constructor(private config: ConfigService) {}

  #CLIENT_ID = this.config.get('TEST_ID');
  #CLIENT_PW = this.config.get('TEST_PW');
  #REDIRECT_URL = this.config.get('REDIRECT_URL');
  #oauth2Client = new google.auth.OAuth2(
    this.#CLIENT_ID,
    this.#CLIENT_PW,
    this.#REDIRECT_URL,
  );

  // expire 관련해서 잠깐 토큰 저장할거임~
  #tempTokens: Credentials;

  googleLoginApi() {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'OpenID',
    ];
    this.#oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      // 점진적 승인 => 어플리케이션이 점진적 승인을 사용하여 컨텍스트에서 추가 범위에 대한 엑세스를 요청할 수 있도록 한다. false로 하면 scope가 요청한 범위만 포함한다.
      include_granted_scopes: false,
    });
  }

  // async googleCallback(authCode: string) {
  //   const { tokens } = await this.#oauth2Client.getToken(authCode);
  //   // QUESTION : 'setCredentials' :: Sets the auth credentials. 이거 뭔지 찾아보기..
  //   this.#oauth2Client.setCredentials(tokens);
  //   console.log(tokens);
  //   // TODO : token을 바탕으로 자동으로 로그인 메소드 만들면 그쪽으로 바로 호출하기
  //   // return tokens;
  // }

  // TODO : 위 과정을 이용한 login 구현 및 refresh Tokens 사용해보기
  // this.#oauth2Client.on()
  /**
   * <토큰이 있는 상황이면>
   * 1. access token expire 확인하기(이건 google에서 알아서 할 수도 있음)
   * 1-1. expire가 유효하다면 로그인 시켜주면서 유저 닉네임이나 email 담아서 돌려주기
   * 1-2-1. expire가 유효하지 않다면 refresh token 이용해서 새로운 access token과 함께 유저 닉네임과 email 담아서 돌려주기(이건 google에서 알아서 할 수도 있음)
   * 1-2-2. refresh token이 유효하지 않다면 자동으로 googleLoginApi 호출해줘서 다시 access token이랑 refresh token 담아주기
   */

  /**
   * <토큰이 없는 상황이면>
   * 1. google login 버튼을 눌렀을 때 토큰이 없으면 로그인 googleLoginApi 호출하기
   * 2. access token이랑 refresh token 받아서 DB에 유저 있는지 없는지 확인하고 없으면 새로 등록한 후 tokens 반환해주고 이미 존재하는 유저이면 그냥 tokens 유저들에게 돌려주기
   */
  // login(tokens: Credentials) {
  // }
}
