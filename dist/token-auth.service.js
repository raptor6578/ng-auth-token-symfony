var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
// @ts-ignore
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';
var TokenAuthService = /** @class */ (function () {
    function TokenAuthService(config, http, router) {
        this.config = config;
        this.http = http;
        this.router = router;
        if (localStorage.getItem('token')) {
            // @ts-ignore
            var _a = JSON.parse(localStorage.getItem('token')), token = _a.token, refresh_token = _a.refresh_token;
            this.initializeToken(token, refresh_token);
        }
    }
    TokenAuthService.prototype.login = function (username, password) {
        var _this = this;
        var login$ = new Subject();
        this.http.post(this.config.url.login, { username: username, password: password })
            .subscribe(function (data) {
            _this.updateToken(data.token, data.refresh_token);
            _this.router.navigate([_this.config.path.login]);
            login$.next({
                iat: _this.iatToken,
                exp: _this.expToken,
                username: _this.username,
                roles: _this.roles
            });
        }, function (error) {
            login$.error(error);
        });
        return login$;
    };
    TokenAuthService.prototype.logout = function () {
        localStorage.removeItem('token');
        document.location.href = this.config.path.logout;
    };
    TokenAuthService.prototype.updateToken = function (token, refresh_token) {
        localStorage.setItem('token', JSON.stringify({ token: token, refresh_token: refresh_token }));
        this.initializeToken(token, refresh_token);
    };
    TokenAuthService.prototype.initializeToken = function (token, refresh_token) {
        this.connected = true;
        this.token = token;
        this.refreshToken = refresh_token;
        var splitToken = token.split('.');
        var tokenDecode = Base64.decode(splitToken[1]);
        var tokenData = JSON.parse(tokenDecode);
        this.iatToken = tokenData.iat;
        this.expToken = tokenData.exp;
        this.username = tokenData.username;
        this.roles = tokenData.roles;
    };
    TokenAuthService.prototype.refresh = function () {
        return this.http.post(this.config.url.refresh, { refresh_token: this.refreshToken });
    };
    TokenAuthService.prototype.tokenNotExpired = function () {
        if (this.token && this.expToken) {
            var dateNow = Math.floor(Date.now() / 1000);
            return this.expToken > dateNow;
        }
        return false;
    };
    TokenAuthService = __decorate([
        Injectable(),
        __param(0, Inject('config')),
        __metadata("design:paramtypes", [Object, HttpClient, Router])
    ], TokenAuthService);
    return TokenAuthService;
}());
export { TokenAuthService };
//# sourceMappingURL=token-auth.service.js.map