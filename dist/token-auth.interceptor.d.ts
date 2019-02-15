import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { TokenAuthService } from './token-auth.service';
import { Observable } from 'rxjs';
export declare class TokenInterceptor implements HttpInterceptor {
    auth: TokenAuthService;
    constructor(auth: TokenAuthService);
    private static getHeader;
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
