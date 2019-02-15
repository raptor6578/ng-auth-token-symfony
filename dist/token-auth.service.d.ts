import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ITokenConfig } from './token-auth';
import { Router } from '@angular/router';
export declare class TokenAuthService {
    config: ITokenConfig;
    private http;
    private router;
    connected: boolean;
    token: string;
    refreshToken: string;
    iatToken: number;
    expToken: number;
    username: string;
    roles: string[];
    constructor(config: ITokenConfig, http: HttpClient, router: Router);
    login(username: string, password: string): Subject<object>;
    logout(): void;
    updateToken(token: string, refresh_token: string): void;
    private initializeToken;
    refresh(): Observable<object>;
    tokenNotExpired(): boolean;
}
