import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import qs from 'qs';
import {} from 'gapi';

@Injectable()
export class UserService {
  constructor(private config: ConfigService) {}
  googleSignUp() {
    // OAUTH_ID
    // OAUTH_PW
    const CLIENT_ID = this.config.get('OAUTH_ID');
    const REDIRECT_URL = this.config.get('REDIRECT_URL');
    const AUTHORIZE_URI = 'https://accounts.google.com/o/oauth2/v2/auth';

    const queryStr = qs.stringify({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URL,
      response_type: 'token',
      scope: 'https://www.googleapis.com/auth/contacts.readonly',
    });

    const loginUrl = AUTHORIZE_URI + '?' + queryStr;
  }
}
