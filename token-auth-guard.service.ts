import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { TokenAuthService } from './token-auth.service';

@Injectable()
export class TokenAuthGuardService implements CanActivate {

  constructor(public auth: TokenAuthService, public router: Router) {}

  canActivate(): boolean {

    if (this.auth.connected) {
      return true;
    } else {
      this.router.navigate([this.auth.config.path.logout]);
      return false;
    }
  }

}
