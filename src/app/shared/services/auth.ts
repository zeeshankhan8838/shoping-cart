import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from './token';
import { appRoutesPath } from '../constants/app-routes-path';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  router = inject(Router)
  tokenStorageService = inject(Token)

  constructor() { }

     async logout(redirectTo: boolean = true) : Promise<void> {
        this.tokenStorageService.clearTokens()
        if (redirectTo) {
          await this.router.navigate(['/' + appRoutesPath.loginPath])
        }
    }




}
