# Description

This module was designed with a Symfony 3 API using LexikJWTAuthenticationBundle and JWTRefreshTokenBundle.  
  
# Installation

```
npm i --save ng-token-auth-symfony
```

# Configuration
Add TokenAuthModule to your app.module.ts :

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenAuthModule, ITokenConfig } from 'ng-token-auth-symfony';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

const tokenConfig: ITokenConfig = {
  url: {
    login: 'http://api-url/login_check',
    refresh: 'http://api-url/token/refresh'
  },
  path: {
    login: 'member',
    logout: '/'
  }
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    TokenAuthModule.forRoot(tokenConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Add AuthGuard to your app-routing.module.ts :

```js
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MemberComponent} from './member/member.component';
import {IndexComponent} from './index/index.component';
import {TokenAuthGuardService as AuthGuard} from 'token-auth';

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'member', component: MemberComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

You can redirect your already identified users, for example from your main component app.component.ts

```js
import { Component } from '@angular/core';
import {TokenAuthService} from 'ng-token-auth-symfony';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private auth: TokenAuthService, private router: Router) {
    if (auth.connected) {
      this.router.navigate([this.auth.config.path.login]);
    }
  }
}
```

# Example login

## Component:
```js
import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {ITokenData, TokenAuthService} from 'ng-token-auth-symfony';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private auth: TokenAuthService) { }

  ngOnInit() {
  }

  public login(form: NgForm) {
    this.auth.login(form.value.username, form.value.password).subscribe((token: ITokenData) => {
      console.log(token);
    }, (error) => {
      console.log(error);
    });
  }
}
```

this console.log returns token information or errors:

```json
exp: 1550234278,
​iat: 1550234273,
​roles: [ "ROLE_ADMIN", "ROLE_USER" ],
​username: "your-username"
```

## Html

```html
<form novalidate #loginForm="ngForm" (ngSubmit)="login(loginForm)">
  <label>
    <input type="text" name="username" ngModel />
  </label>
  <label>
    <input type="password" name="password" ngModel />
  </label>
  <input type="submit" />
</form>
```

# Example logout

## Component

```js
import { Component, OnInit } from '@angular/core';
import {TokenAuthService} from 'ng-token-auth-symfony';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  constructor(private auth: TokenAuthService) { }

  ngOnInit() {
  }

  public logout() {
    this.auth.logout();
  }

}
```

## html

```html
<button (click)="logout()">logout</button>
```

