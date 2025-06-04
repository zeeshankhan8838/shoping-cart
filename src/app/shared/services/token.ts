import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Token {

  private accessTokenKey = 'accessToken'
  private userInfoData = 'userInfo'

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey)
  }

  setAccessToken(token: string): void {
    localStorage.setItem(this.accessTokenKey, token)
  }

  getUserInfo<T>(): T | T {
    return localStorage.getItem(JSON.parse(this.userInfoData)) as T
  }

  setUserLoginInfo<T>(userData: T): void {
    localStorage.setItem(this.userInfoData, JSON.stringify(userData))
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey)
    localStorage.removeItem(this.userInfoData)
  }
}
