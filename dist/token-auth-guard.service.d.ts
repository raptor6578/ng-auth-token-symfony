import { Router, CanActivate } from '@angular/router';
import { TokenAuthService } from './token-auth.service';
export declare class TokenAuthGuardService implements CanActivate {
    auth: TokenAuthService;
    router: Router;
    constructor(auth: TokenAuthService, router: Router);
    canActivate(): boolean;
}
