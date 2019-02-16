(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/common/http'), require('rxjs'), require('js-base64'), require('@angular/router'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/common/http', 'rxjs', 'js-base64', '@angular/router', 'rxjs/operators'], factory) :
    (global = global || self, factory(global['token-auth'] = {}, global.vendor._angular_core, global.vendor._angular_common, global.vendor._angular_common_http, global.vendor._rxjs, global.jsBase64, global.vendor._angular_router, global.vendor._rxjs_operators));
}(this, function (exports, core, common, http, rxjs, jsBase64, router, operators) { 'use strict';

    var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (undefined && undefined.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var TokenAuthService = /** @class */ (function () {
        function TokenAuthService(config, http$$1, router$$1) {
            this.config = config;
            this.http = http$$1;
            this.router = router$$1;
            if (localStorage.getItem('token')) {
                // @ts-ignore
                var _a = JSON.parse(localStorage.getItem('token')), token = _a.token, refresh_token = _a.refresh_token;
                this.initializeToken(token, refresh_token);
            }
        }
        TokenAuthService.prototype.login = function (username, password) {
            var _this = this;
            var login$ = new rxjs.Subject();
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
            var tokenDecode = jsBase64.Base64.decode(splitToken[1]);
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
            core.Injectable(),
            __param(0, core.Inject('config')),
            __metadata("design:paramtypes", [Object, http.HttpClient, router.Router])
        ], TokenAuthService);
        return TokenAuthService;
    }());

    var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$1 = (undefined && undefined.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
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
                return this.auth.refresh().pipe(operators.mergeMap(function (data) {
                    _this.auth.updateToken(data.token, data.refresh_token);
                    return next.handle(TokenInterceptor_1.getHeader(request, data.token));
                }));
            }
            else {
                return next.handle(request).pipe(operators.tap(function (event) {
                    // Response
                }, function (err) {
                    // Response error
                    if (err instanceof http.HttpErrorResponse) {
                        if (err.status === 401 && _this.auth.connected && request.url === _this.auth.config.url.refresh) {
                            _this.auth.logout();
                        }
                    }
                }));
            }
        };
        var TokenInterceptor_1;
        TokenInterceptor = TokenInterceptor_1 = __decorate$1([
            core.Injectable(),
            __metadata$1("design:paramtypes", [TokenAuthService])
        ], TokenInterceptor);
        return TokenInterceptor;
    }());

    var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$2 = (undefined && undefined.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var TokenAuthGuardService = /** @class */ (function () {
        function TokenAuthGuardService(auth, router$$1) {
            this.auth = auth;
            this.router = router$$1;
        }
        TokenAuthGuardService.prototype.canActivate = function () {
            if (this.auth.connected) {
                return true;
            }
            else {
                this.router.navigate([this.auth.config.path.logout]);
                return false;
            }
        };
        TokenAuthGuardService = __decorate$2([
            core.Injectable(),
            __metadata$2("design:paramtypes", [TokenAuthService, router.Router])
        ], TokenAuthGuardService);
        return TokenAuthGuardService;
    }());

    var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
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
        TokenAuthModule = TokenAuthModule_1 = __decorate$3([
            core.NgModule({
                declarations: [],
                imports: [
                    common.CommonModule
                ],
                providers: [
                    {
                        provide: http.HTTP_INTERCEPTORS,
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

    exports.TokenAuthModule = TokenAuthModule;
    exports.TokenAuthService = TokenAuthService;
    exports.TokenAuthGuardService = TokenAuthGuardService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
