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
      <!-- Header with improved responsive design -->
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div class="container-responsive py-4 sm:py-6">
          <div class="flex items-center justify-between">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <div class="hidden sm:flex items-center space-x-4">
              <span class="text-sm text-gray-500">Welcome back!</span>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main content with enhanced responsive layout -->
      <main class="container-responsive py-6 sm:py-8 lg:py-12">
        <div class="grid-responsive">
          <!-- Product Form Section -->
          <section class="space-y-4 sm:space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-lg sm:text-xl font-semibold text-gray-900">
                Product Management
              </h2>
              <span class="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Form
              </span>
            </div>
            <app-product-form></app-product-form>
          </section>
          
          <!-- Customer List Section -->
          <section class="space-y-4 sm:space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-lg sm:text-xl font-semibold text-gray-900">
                Customer Management
              </h2>
              <span class="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                List
              </span>
            </div>
            <app-customer-list></app-customer-list>
          </section>
        </div>
      </main>
      
      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-12">
        <div class="container-responsive py-6">
          <div class="text-center text-sm text-gray-500">
            <p>&copy; 2025 Angular Responsive App. Built with modern best practices.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'angular-responsive-app';
}