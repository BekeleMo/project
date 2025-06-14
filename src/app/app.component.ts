import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProductFormComponent, CustomerListComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="container-responsive py-4">
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      
      <main class="container-responsive py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Product Form Section -->
          <div class="space-y-6">
            <h2 class="text-xl font-semibold text-gray-900">Product Management</h2>
            <app-product-form></app-product-form>
          </div>
          
          <!-- Customer List Section -->
          <div class="space-y-6">
            <h2 class="text-xl font-semibold text-gray-900">Customer Management</h2>
            <app-customer-list></app-customer-list>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'angular-responsive-app';
}