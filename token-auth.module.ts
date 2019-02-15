import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TokenInterceptor} from './token-auth.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenAuthService} from './token-auth.service';
import {TokenAuthGuardService} from './token-auth-guard.service';
import {ITokenConfig} from './token-auth';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    TokenAuthService,
    TokenAuthGuardService
  ],
  exports: []
})

export class TokenAuthModule {
  static forRoot(config: ITokenConfig): ModuleWithProviders {
    return {
      ngModule: TokenAuthModule,
      providers: [
        TokenAuthService,
        { provide: 'config', useValue: config }
        ],
    };
  }
}

