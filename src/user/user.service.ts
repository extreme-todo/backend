import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class UserService {
  constructor(private config: ConfigService) {}

  // #CLIENT_ID: string = this.config.get('OAUTH_ID');
  // #CLIENT_PW: string = this.config.get('CLIENT_PW');
  // #REDIRECT_URL: string = this.config.get('REDIRECT_URL');
  // #oauth2Client: OAuth2Client = new google.auth.OAuth2(
  //   this.CLIENT_ID,
  //   this.CLIENT_PW,
  //   this.REDIRECT_URL,
  // );

  googleLoginApi() {
    const CLIENT_ID = this.config.get('OAUTH_ID');
    const CLIENT_PW = this.config.get('CLIENT_PW');
    const REDIRECT_URL = this.config.get('REDIRECT_URL');
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_PW,
      REDIRECT_URL,
    );

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      // 점진적 승인 => 어플리케이션이 점진적 승인을 사용하여 컨텍스트에서 추가 범위에 대한 엑세스를 요청할 수 있도록 한다. false로 하면 scope가 요청한 범위만 포함한다.
      include_granted_scopes: false,
    });

    return authUrl;
  }

  async googleCallback(authCode: string) {
    const CLIENT_ID = this.config.get('OAUTH_ID');
    const CLIENT_PW = this.config.get('CLIENT_PW');
    const REDIRECT_URL = this.config.get('REDIRECT_URL');
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_PW,
      REDIRECT_URL,
    );

    // TODO : token 없을 때 or 오지 않았을 때 예외처리 해주기
    const { tokens } = await oauth2Client.getToken(authCode);
    console.log('🌟🌟🌟🌟 tokens :: ', tokens);

    // auth credentials에서 어떤 것을 설정해 둔 것으로 보임..
    oauth2Client.setCredentials(tokens);
    // console.log(userAuth);
  }
}
