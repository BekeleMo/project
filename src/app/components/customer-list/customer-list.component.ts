import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface Customer {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  joinDate: Date;
  phone?: string;
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Search and Filter Section -->
      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Search Input -->
          <div class="form-group mb-0">
            <label for="searchCustomers" class="form-label">Search Customers</label>
            <input
              id="searchCustomers"
              type="text"
              [formControl]="searchControl"
              class="search-input"
              placeholder="Search customers..."
            />
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
        </div>
      </div>

      <!-- Customer List -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            Customers ({{ filteredCustomers.length }})
          </h3>
          <button class="btn btn-primary">
            Add Customer
          </button>
        </div>

        <!-- Mobile-first responsive table -->
        <div class="overflow-x-auto">
          <div class="hidden md:block">
            <!-- Desktop Table -->
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let customer of filteredCustomers; trackBy: trackByCustomerId" 
                    class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ customer.email }}</div>
                    <div *ngIf="customer.phone" class="text-sm text-gray-500">{{ customer.phone }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="status-badge"
                      [class.active]="customer.status === 'active'"
                      [class.inactive]="customer.status === 'inactive'"
                    >
                      {{ customer.status | titlecase }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ customer.joinDate | date:'mediumDate' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
                    <button class="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="md:hidden space-y-4">
            <div *ngFor="let customer of filteredCustomers; trackBy: trackByCustomerId" 
                 class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h4 class="text-lg font-medium text-gray-900">{{ customer.name }}</h4>
                  <p class="text-sm text-gray-600">{{ customer.email }}</p>
                  <p *ngIf="customer.phone" class="text-sm text-gray-500">{{ customer.phone }}</p>
                </div>
                <span 
                  class="status-badge"
                  [class.active]="customer.status === 'active'"
                  [class.inactive]="customer.status === 'inactive'"
                >
                  {{ customer.status | titlecase }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">
                  Joined: {{ customer.joinDate | date:'mediumDate' }}
                </span>
                <div class="flex space-x-3">
                  <button class="text-primary-600 hover:text-primary-900 text-sm font-medium">Edit</button>
                  <button class="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredCustomers.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p class="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CustomerListComponent implements OnInit {
  searchControl = new FormControl('');
  statusFilterControl = new FormControl('');
  
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
    }
  ];

  filteredCustomers: Customer[] = [];

  ngOnInit(): void {
    this.filteredCustomers = [...this.customers];
    this.setupFilters();
  }

  private setupFilters(): void {
    // Search filter
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());

    // Status filter
    this.statusFilterControl.valueChanges
      .subscribe(() => this.applyFilters());
  }

  private applyFilters(): void {
    let filtered = [...this.customers];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        (customer.phone && customer.phone.includes(searchTerm))
      );
    }

    // Apply status filter
    const statusFilter = this.statusFilterControl.value;
    if (statusFilter) {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    this.filteredCustomers = filtered;
  }

  trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }
}