import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environments';
import { Auth } from './auth';
import { Token } from './token';

/**
 *   HTTP interceptor to attach JWT token to outgoing requests and handle authentication errors.
 * - Adds Authorization header if access token is present and URL matches API.
 * - Handles 401 errors by logging out the user.
 * - Displays error messages for other HTTP errors.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(Auth);
  const tokenStorageService = inject(Token);
  const messageService = inject(MessageService);

  const accessToken = tokenStorageService.getAccessToken();

  // Attach token only if present
  if (accessToken) {
    req = addTokenToRequest(req, accessToken);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized: log out user
        authService.logout();
        return throwError(() => error);
      } else {
        // Show detailed error message if available
        messageService.add({
          severity: 'error',
          summary: 'Request Failed',
          detail: error.error?.message || error.message || 'An unexpected error occurred.',
        });
        return throwError(() => error);
      }
    })
  );
};

/**
 * Adds the Authorization header with the Bearer token to the request if the URL matches the API URL.
 * Does not override Content-Type if already set (to support file uploads, etc.).
 * @param request The HTTP request to modify.
 * @param token The Bearer token to add to the request headers.
 * @returns The modified HTTP request with the Authorization header.
 */
function addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
  if (request.url.includes(environment.apiURL) && token) {
    const headers: { [header: string]: string } = {
      Authorization: `Bearer ${token}`,
    };
    // Only set Content-Type if not already present
    if (!request.headers.has('Content-Type')) {
      headers['Content-Type'] = 'application/json';
    }
    return request.clone({ setHeaders: headers });
  }
  return request;
}

