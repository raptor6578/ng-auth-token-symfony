var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenAuthService } from './token-auth.service';
import { mergeMap, tap } from 'rxjs/operators';
var TokenInterceptor = /** @class */ (function () {
    function TokenInterceptor(auth) {
        this.auth = auth;
    }
    TokenInterceptor_1 = TokenInterceptor;
    TokenInterceptor.getHeader = function (request, token) {
        return request.clone({
            setHeaders: {
                Authorization: "Bearer " + token
            }
        });
    };
    TokenInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        if (this.auth.connected && this.auth.tokenNotExpired()) {
            return next.handle(TokenInterceptor_1.getHeader(request, this.auth.token));
        }
        else if (this.auth.refreshToken && request.url !== this.auth.config.url.refresh) {
            return this.auth.refresh().pipe(mergeMap(function (data) {
                _this.auth.updateToken(data.token, data.refresh_token);
                return next.handle(TokenInterceptor_1.getHeader(request, data.token));
            }));
        }
        else {
            return next.handle(request).pipe(tap(function (event) {
                // Response
            }, function (err) {
                // Response error
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401 && _this.auth.connected && request.url === _this.auth.config.url.refresh) {
                        _this.auth.logout();
                    }
                }
            }));
        }
    };
    var TokenInterceptor_1;
    TokenInterceptor = TokenInterceptor_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [TokenAuthService])
    ], TokenInterceptor);
    return TokenInterceptor;
}());
export { TokenInterceptor };
//# sourceMappingURL=token-auth.interceptor.js.map