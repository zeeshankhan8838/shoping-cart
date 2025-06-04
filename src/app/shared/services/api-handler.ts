import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { tap } from 'rxjs/internal/operators/tap'
import { IApiBaseActions, IApiBaseResponse, ParamsType } from '../interfaces/api-base-action.inteface'
import { responseMessages } from '../constants/response-message'


@Injectable({
    providedIn: 'root',
})
export class ApiHandlerService implements IApiBaseActions {
    constructor(public readonly httpClient: HttpClient) {}

    Get<T>(url: string, params?: ParamsType) {
        return this.httpClient.get<T>(url, { params: this.createParams(params) }).pipe(tap(x => this.HandleResponse(x)));
    }

    GetAll<T>(url: string, params?: ParamsType) {
        return this.httpClient.get<T>(url, { params: this.createParams(params) }).pipe(tap(x => this.HandleResponse(x)));
    }

    Post<T>(url: string, data: any, params?: ParamsType) {
        return this.httpClient
            .post<T>(url, data, { params: this.createParams(params) })
            .pipe(tap(x => this.HandleResponse(x)));
    }

    Delete<T>(url: string, data: any, params?: ParamsType) {
        return this.httpClient.delete<T>(url, { params: this.createParams(params) }).pipe(tap(x => this.HandleResponse(x)));
    }

    Put<T>(url: string, data: any, params?: ParamsType) {
        return this.httpClient
            .put<T>(url, data, { params: this.createParams(params) })
            .pipe(tap(x => this.HandleResponse(x)));
    }

    HandleResponse(response: any) {
        if (response.Status === 500) {
            alert(responseMessages.serverError)
        }
    }

    createParams(params?: ParamsType) {
        let httpParams = new HttpParams()
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                httpParams = httpParams.append(key, value)
            })
        }
        return httpParams
    }
}