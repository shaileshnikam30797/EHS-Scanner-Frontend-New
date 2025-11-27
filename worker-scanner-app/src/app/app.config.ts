import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http'; 

export const appConfig: ApplicationConfig = {
  providers: [
    // Routing is removed as it's not needed for a single-component app.
    provideHttpClient() // Essential for making API calls
  ]
};