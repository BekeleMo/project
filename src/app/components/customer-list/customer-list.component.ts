import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

interface Customer {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  joinDate: Date;
  phone?: string;
  avatar?: string;
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-4 sm:space-y-6">
      <!-- Search and Filter Section -->
      <div class="card">
        <div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <!-- Search Input -->
          <div class="form-group mb-0 md:col-span-2 lg:col-span-1">
            <label for="searchCustomers" class="form-label">Search Customers</label>
            <div class="relative">
              <input
                id="searchCustomers"
                type="text"
                [formControl]="searchControl"
                class="search-input pr-10"
                placeholder="Search customers..."
                autocomplete="off"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="form-group mb-0">
            <label for="statusFilter" class="form-label">Filter by Status</label>
            <select
              id="statusFilter"
              [formControl]="statusFilterControl"
              class="search-input"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Sort Options -->
          <div class="form-group mb-0">
            <label for="sortBy" class="form-label">Sort By</label>
            <select
              id="sortBy"
              [formControl]="sortControl"
              class="search-input"
            >
              <option value="name">Name</option>
              <option value="joinDate">Join Date</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
          <div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            <div class="text-center">
              <div class="text-lg sm:text-2xl font-bold text-blue-600">{{ getTotalCustomers() }}</div>
              <div class="text-xs sm:text-sm text-gray-500">Total</div>
            </div>
            <div class="text-center">
              <div class="text-lg sm:text-2xl font-bold text-green-600">{{ getActiveCustomers() }}</div>
              <div class="text-xs sm:text-sm text-gray-500">Active</div>
            </div>
            <div class="text-center">
              <div class="text-lg sm:text-2xl font-bold text-gray-600">{{ getInactiveCustomers() }}</div>
              <div class="text-xs sm:text-sm text-gray-500">Inactive</div>
            </div>
            <div class="text-center">
              <div class="text-lg sm:text-2xl font-bold text-purple-600">{{ filteredCustomers.length }}</div>
              <div class="text-xs sm:text-sm text-gray-500">Filtered</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer List -->
      <div class="card">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">
            Customers ({{ filteredCustomers.length }})
          </h3>
          <div class="flex flex-col sm:flex-row gap-2">
            <button class="btn btn-secondary text-sm">
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Export
            </button>
            <button class="btn btn-primary text-sm">
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Add Customer
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex items-center justify-center py-8 sm:py-12">
          <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-sm sm:text-base text-gray-600">Loading customers...</span>
        </div>

        <!-- Desktop Table -->
        <div *ngIf="!isLoading" class="table-responsive">
          <div class="hidden lg:block">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th class="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th class="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th class="px-4 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let customer of filteredCustomers; trackBy: trackByCustomerId" 
                    class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8 xl:h-10 xl:w-10">
                        <div class="h-8 w-8 xl:h-10 xl:w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-xs xl:text-sm">
                          {{ getInitials(customer.name) }}
                        </div>
                      </div>
                      <div class="ml-3 xl:ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
                        <div class="text-xs xl:text-sm text-gray-500">ID: {{ customer.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ customer.email }}</div>
                    <div *ngIf="customer.phone" class="text-xs xl:text-sm text-gray-500">{{ customer.phone }}</div>
                  </td>
                  <td class="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <span 
                      class="status-badge"
                      [class.active]="customer.status === 'active'"
                      [class.inactive]="customer.status === 'inactive'"
                    >
                      {{ customer.status | titlecase }}
                    </span>
                  </td>
                  <td class="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ customer.joinDate | date:'mediumDate' }}
                  </td>
                  <td class="px-4 xl:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <button class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tablet View -->
          <div class="hidden md:block lg:hidden">
            <div class="space-y-3">
              <div *ngFor="let customer of filteredCustomers; trackBy: trackByCustomerId" 
                   class="mobile-card">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                      <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                        {{ getInitials(customer.name) }}
                      </div>
                    </div>
                    <div>
                      <h4 class="text-base sm:text-lg font-medium text-gray-900">{{ customer.name }}</h4>
                      <p class="text-sm text-gray-600">{{ customer.email }}</p>
                      <p *ngIf="customer.phone" class="text-sm text-gray-500">{{ customer.phone }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span 
                      class="status-badge mb-2 block"
                      [class.active]="customer.status === 'active'"
                      [class.inactive]="customer.status === 'inactive'"
                    >
                      {{ customer.status | titlecase }}
                    </span>
                    <div class="flex space-x-2">
                      <button class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="mt-3 pt-3 border-t border-gray-100">
                  <span class="text-sm text-gray-500">
                    Joined: {{ customer.joinDate | date:'mediumDate' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Cards -->
          <div class="md:hidden space-y-3 sm:space-y-4">
            <div *ngFor="let customer of filteredCustomers; trackBy: trackByCustomerId" 
                 class="mobile-card">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                      {{ getInitials(customer.name) }}
                    </div>
                  </div>
                  <div>
                    <h4 class="text-base font-medium text-gray-900">{{ customer.name }}</h4>
                    <p class="text-sm text-gray-600">{{ customer.email }}</p>
                    <p *ngIf="customer.phone" class="text-sm text-gray-500">{{ customer.phone }}</p>
                  </div>
                </div>
                <span 
                  class="status-badge"
                  [class.active]="customer.status === 'active'"
                  [class.inactive]="customer.status === 'inactive'"
                >
                  {{ customer.status | titlecase }}
                </span>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <span class="text-sm text-gray-500">
                  Joined: {{ customer.joinDate | date:'shortDate' }}
                </span>
                <div class="flex space-x-3">
                  <button class="text-blue-600 hover:text-blue-900 text-sm font-medium">Edit</button>
                  <button class="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && filteredCustomers.length === 0" class="text-center py-8 sm:py-12">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-10 w-10 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p class="text-sm sm:text-base text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
          <button class="btn btn-primary">
            Add Your First Customer
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CustomerListComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  statusFilterControl = new FormControl('');
  sortControl = new FormControl('name');
  
  isLoading = false;
  private destroy$ = new Subject<void>();
  
  customers: Customer[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      status: 'active',
      joinDate: new Date('2023-01-15'),
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      status: 'active',
      joinDate: new Date('2023-02-20'),
      phone: '+1 (555) 987-6543'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      status: 'inactive',
      joinDate: new Date('2023-03-10')
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      status: 'active',
      joinDate: new Date('2023-04-05'),
      phone: '+1 (555) 456-7890'
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie.wilson@example.com',
      status: 'active',
      joinDate: new Date('2023-05-12'),
      phone: '+1 (555) 321-0987'
    },
    {
      id: 6,
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
      status: 'inactive',
      joinDate: new Date('2023-06-08')
    }
  ];

  filteredCustomers: Customer[] = [];

  ngOnInit(): void {
    this.filteredCustomers = [...this.customers];
    this.setupFilters();
    this.simulateLoading();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private simulateLoading(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  private setupFilters(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.applyFilters());

    this.statusFilterControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());

    this.sortControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());
  }

  private applyFilters(): void {
    let filtered = [...this.customers];

    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        (customer.phone && customer.phone.includes(searchTerm))
      );
    }

    const statusFilter = this.statusFilterControl.value;
    if (statusFilter) {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    const sortBy = this.sortControl.value;
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    this.filteredCustomers = filtered;
  }

  trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getTotalCustomers(): number {
    return this.customers.length;
  }

  getActiveCustomers(): number {
    return this.customers.filter(c => c.status === 'active').length;
  }

  getInactiveCustomers(): number {
    return this.customers.filter(c => c.status === 'inactive').length;
  }
}