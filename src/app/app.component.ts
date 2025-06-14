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
        <div class="container-responsive py-3 sm:py-4 lg:py-6">
          <div class="flex items-center justify-between">
            <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <div class="hidden sm:flex items-center space-x-4">
              <span class="text-xs sm:text-sm text-gray-500">Welcome back!</span>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main content with enhanced responsive layout -->
      <main class="container-responsive py-4 sm:py-6 lg:py-8 xl:py-12">
        <div class="grid-responsive">
          <!-- Product Form Section -->
          <section class="space-y-3 sm:space-y-4 lg:space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 class="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
                Product Management
              </h2>
              <span class="inline-flex sm:hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                Form
              </span>
            </div>
            <app-product-form></app-product-form>
          </section>
          
          <!-- Customer List Section -->
          <section class="space-y-3 sm:space-y-4 lg:space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 class="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
                Customer Management
              </h2>
              <span class="inline-flex sm:hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                List
              </span>
            </div>
            <app-customer-list></app-customer-list>
          </section>
        </div>
      </main>
      
      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-8 sm:mt-12">
        <div class="container-responsive py-4 sm:py-6">
          <div class="text-center text-xs sm:text-sm text-gray-500">
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