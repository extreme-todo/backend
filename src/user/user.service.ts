import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class UserService {
  constructor(private config: ConfigService) {}

  googleLoginApi() {
    const CLIENT_ID = this.config.get('OAUTH_ID');
    const CLIENT_PW = this.config.get('OAUTH_PW');
    const REDIRECT_URL = this.config.get('REDIRECT_URL');

    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_PW,
      REDIRECT_URL,
    );

    const scopes = ['https://www.googleapis.com/auth/contacts.readonly'];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      // 점진적 승인 => 어플리케이션이 점진적 승인을 사용하여 컨텍스트에서 추가 범위에 대한 엑세스를 요청할 수 있도록 한다. false로 하면 scope가 요청한 범위만 포함한다.
      include_granted_scopes: false,
    });

    // QUESTION : 내가 아래 과정을 해야 하는 건지 google이 알아서 해준다는 건지 모르겠네.. 아래 내용이 되어 있는데, 내가 해석하기엔 일단 사용자가 permission을 하면 구글은 우리가 query parameter로 정해둔 redirect URL로 redirect를 해준다고 한다. 이 다음 과정은 <Retrieve access token>이다.
    /* 
      <Retrieve authorization code>
      Once a user has given permissions on the consent page, Google will redirect the page to the redirect URL you have provided with a code query parameter.
    */
    /* 
      이걸 통해서 코드를 받고 나면 그 코드를 /콜백주소?code={code}로 redirect 하는 듯
    */
    // const authCode = await fetch(
    //   `/oauthcallback?code=${authCode}`,
    // );

    return authUrl;
  }

  googleCallback() {
    console.log('여기 도착했어요!');
  }
}
