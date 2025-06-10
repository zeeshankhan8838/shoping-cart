import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/services/auth.interceptor';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';

// Importing the Aura theme from PrimeNG
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    RouterModule,
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};
