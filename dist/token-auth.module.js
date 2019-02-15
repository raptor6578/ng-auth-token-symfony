var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenInterceptor } from './token-auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenAuthService } from './token-auth.service';
import { TokenAuthGuardService } from './token-auth-guard.service';
var TokenAuthModule = /** @class */ (function () {
    function TokenAuthModule() {
    }
    TokenAuthModule_1 = TokenAuthModule;
    TokenAuthModule.forRoot = function (config) {
        return {
            ngModule: TokenAuthModule_1,
            providers: [
                TokenAuthService,
                { provide: 'config', useValue: config }
            ],
        };
    };
    var TokenAuthModule_1;
    TokenAuthModule = TokenAuthModule_1 = __decorate([
        NgModule({
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
    ], TokenAuthModule);
    return TokenAuthModule;
}());
export { TokenAuthModule };
//# sourceMappingURL=token-auth.module.js.map