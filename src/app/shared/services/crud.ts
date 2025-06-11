import { inject, Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { environment } from "../../../environments/environments";
import { ApiHandlerService } from "./api-handler";

@Injectable({
    providedIn: 'root',
})
export class CrudService {
    
    apiService=inject(ApiHandlerService);

    constructor() {}

    private getApiUrl(endpoint: string, env?: string): string {
        return `${env ? env : environment.apiURL}${endpoint}`;
    }

    get(endpoint: string, params?: any, env?: string) {
        return lastValueFrom(this.apiService.Get(this.getApiUrl(endpoint, env), params));
    }

    post(endpoint: string, body?: any, params?: any) {
        return lastValueFrom(this.apiService.Post(this.getApiUrl(endpoint), body, params));
    }

    put(endpoint: string, body?: any) {
        return lastValueFrom(this.apiService.Put(this.getApiUrl(endpoint), body));
    }

    delete(endpoint: string, body?: any, params?: any) {
        return lastValueFrom(this.apiService.Delete(this.getApiUrl(endpoint), body, params));
    }
    
}