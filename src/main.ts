import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { LayoutComponent } from './app/components/layout/layout.component';

@Component({
  selector: 'app-root',
  template: `<app-layout></app-layout>`,
  standalone: true,
  imports: [LayoutComponent]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
});