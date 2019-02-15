import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
// @ts-ignore
import {Base64} from 'js-base64';
import {IToken, ITokenConfig, ITokenData} from './token-auth';
import {Router} from '@angular/router';

@Injectable()
export class TokenAuthService {

  public connected: boolean;
  public token: string;
  public refreshToken: string;
  public iatToken: number;
  public expToken: number;
  public username: string;
  public roles: string[];

  constructor(@Inject('config') public config: ITokenConfig, private http: HttpClient, private router: Router) {
    if (localStorage.getItem('token')) {
      // @ts-ignore
      const {token, refresh_token} = JSON.parse(localStorage.getItem('token'));
      this.initializeToken(token, refresh_token);
    }
  }

  public login(username: string, password: string): Subject<object> {
    const login$ = new Subject<object>();
    this.http.post(this.config.url.login, {username, password})
      .subscribe((data: IToken) => {
        this.updateToken(data.token, data.refresh_token);
        this.router.navigate([this.config.path.login]);
        login$.next({
          iat: this.iatToken,
          exp: this.expToken,
          username: this.username,
          roles: this.roles
        });
      }, (error) => {
        login$.error(error);
      });
    return login$;
  }

  public logout(): void {
    localStorage.removeItem('token');
    document.location.href = this.config.path.logout;
  }

  public updateToken(token: string, refresh_token: string) {
    localStorage.setItem('token', JSON.stringify({token, refresh_token}));
    this.initializeToken(token, refresh_token);
  }

  private initializeToken(token: string, refresh_token: string) {
    this.connected = true;
    this.token = token;
    this.refreshToken = refresh_token;
    const splitToken = token.split('.');
    const tokenDecode = Base64.decode(splitToken[1]);
    const tokenData: ITokenData = JSON.parse(tokenDecode);
    this.iatToken = tokenData.iat;
    this.expToken = tokenData.exp;
    this.username = tokenData.username;
    this.roles = tokenData.roles;
  }

  public refresh(): Observable<object> {
    return this.http.post(this.config.url.refresh, {refresh_token: this.refreshToken});
  }

  public tokenNotExpired(): boolean {
    if (this.token && this.expToken) {
      const dateNow = Math.floor(Date.now() / 1000);
      return this.expToken > dateNow;
    }
    return false;
  }

}
