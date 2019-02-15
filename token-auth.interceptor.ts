import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { TokenAuthService } from './token-auth.service';
import { Observable } from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';
import {IToken} from './token-auth';


@Injectable()

export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: TokenAuthService) {}

  private static getHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.connected && this.auth.tokenNotExpired()) {
      return next.handle(TokenInterceptor.getHeader(request, this.auth.token));

    } else if (this.auth.refreshToken && request.url !== this.auth.config.url.refresh) {

      return this.auth.refresh().pipe(mergeMap((data: IToken) => {
          this.auth.updateToken(data.token, data.refresh_token);
          return next.handle(TokenInterceptor.getHeader(request, data.token));
        }));

    } else {
      return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
        // Response
      }, (err: any) => {
        // Response error
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 && request.url === this.auth.config.url.refresh) {
            this.auth.logout();
          }
        }
      }));
    }
  }
}
