import { ModuleWithProviders } from '@angular/core';
import { ITokenConfig } from './token-auth';
export declare class TokenAuthModule {
    static forRoot(config: ITokenConfig): ModuleWithProviders;
}
