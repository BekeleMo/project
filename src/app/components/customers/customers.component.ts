import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Customer } from '../../services/data.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="customers-page">
      <div class="page-header">
        <h2>Customer Management</h2>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="exportCustomers()">
            <i class="fas fa-download"></i>
            Export
          </button>
          <button class="btn btn-primary" (click)="showAddCustomerForm = true">
            <i class="fas fa-user-plus"></i>
            Add Customer
          </button>
        </div>
      </div>

      <!-- Customer Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users" style="color: var(--primary-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ totalCustomers }}</div>
            <div class="stat-label">Total Customers</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-user-check" style="color: var(--success-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ activeCustomers }}</div>
            <div class="stat-label">Active Customers</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-dollar-sign" style="color: var(--info-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">\${{ averageSpent | number:'1.2-2' }}</div>
            <div class="stat-label">Average Customer Value</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-shopping-cart" style="color: var(--warning-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ averageOrders | number:'1.1-1' }}</div>
            <div class="stat-label">Average Orders</div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Customer Form -->
      <div class="card" *ngIf="showAddCustomerForm || editingCustomer">
        <div class="card-header">
          <h4 class="card-title">{{ editingCustomer ? 'Edit Customer' : 'Add New Customer' }}</h4>
         <!--  <button class="btn btn-outline" (click)="cancelForm()">
            <i class="fas fa-times"></i>
          </button> -->
        </div>
        
        <form (ngSubmit)="saveCustomer()" class="customer-form">
          <div class="form-two-columns">
            <!-- Left Column -->
            <div class="form-column">
              <div class="form-group-horizontal">
                <label class="form-label">Full Name *</label>
                <input type="text" class="styled-input" [(ngModel)]="customerForm.name" name="name" required>
              </div>
              <div class="form-group-horizontal">
                <label class="form-label">Phone</label>
                <input type="tel" class="styled-input" [(ngModel)]="customerForm.phone" name="phone">
              </div>
              <div class="form-group-horizontal">
                <label class="form-label">Address</label>
                <textarea class="styled-input" [(ngModel)]="customerForm.address" name="address" rows="2"></textarea>
              </div>
            </div>

            <!-- Right Column -->
            <div class="form-column">
              <div class="form-group-horizontal">
                <label class="form-label">Email *</label>
                <input type="email" class="styled-input" [(ngModel)]="customerForm.email" name="email" required>
              </div>
              <div class="form-group-horizontal">
                <label class="form-label">Status</label>
                <select class="styled-input" [(ngModel)]="customerForm.status" name="status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div class="form-group-horizontal">
                <label class="form-label">Notes</label>
                <textarea class="styled-input" [(ngModel)]="customerForm.notes" name="notes" rows="2"></textarea>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="!isValidForm()">
              {{ editingCustomer ? 'Update' : 'Submit' }}
            </button>
            <button type="button" class="btn btn-outline" (click)="cancelForm()">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </form>
      </div>

      <!-- Search and Filters -->
      <div class="card">
        
      </div>

      <!-- Customers Table -->
      <div class="card">
        <div class="card-header">
          <div class="filters-section">
          <div class="search-group">
            <input type="text" class="styled-input" placeholder="Search customers..." 
                   [(ngModel)]="searchTerm" (input)="filterCustomers()">
            <!-- <button class="btn btn-outline">
              <i class="fas fa-search"></i>
            </button> -->
          </div>
          
          <div class="filter-group">
            <select class="styled-input" [(ngModel)]="statusFilter" (change)="filterCustomers()">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
         <!--    <select class="form-control" [(ngModel)]="sortBy" (change)="sortCustomers()">
              <option value="name">Sort by Name</option>
              <option value="joinDate">Sort by Join Date</option>
              <option value="totalSpent">Sort by Total Spent</option>
              <option value="totalOrders">Sort by Total Orders</option>
            </select> -->
          </div>
        </div>
          <h3 class="card-title">Customers ({{ filteredCustomers.length }})</h3>
        </div>
        
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th (click)="sortByColumn('name')" style="cursor:pointer;">
                  Customer
                  <span *ngIf="sortBy === 'name'">
                    <i [ngClass]="sortDirection === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                  </span>
                </th>
                <th>Contact</th>
                <th (click)="sortByColumn('totalOrders')" style="cursor:pointer;">
                  Orders
                  <span *ngIf="sortBy === 'totalOrders'">
                    <i [ngClass]="sortDirection === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                  </span>
                </th>
                <th (click)="sortByColumn('totalSpent')" style="cursor:pointer;">
                  Total Spent
                  <span *ngIf="sortBy === 'totalSpent'">
                    <i [ngClass]="sortDirection === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                  </span>
                </th>
                <th (click)="sortByColumn('joinDate')" style="cursor:pointer;">
                  Last Order
                  <span *ngIf="sortBy === 'joinDate'">
                    <i [ngClass]="sortDirection === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                  </span>
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let customer of pagedCustomers">
                <td>
                  <div class="customer-info">
                    <div class="customer-name">{{ customer.name }}</div>
                    <div class="customer-since">Customer since {{ customer.joinDate | date:'MMM yyyy' }}</div>
                  </div>
                </td>
                <td>
                  <div class="contact-info">
                    <div class="email">{{ customer.email }}</div>
                    <div class="phone">{{ customer.phone }}</div>
                  </div>
                </td>
                <td>
                  <div class="orders-info">
                    <span class="orders-count">{{ customer.totalOrders }}</span>
                    <span class="orders-label">orders</span>
                  </div>
                </td>
                <td>
                  <div class="spent-amount">\${{ customer.totalSpent | number:'1.2-2' }}</div>
                </td>
                <td>
                  <div class="last-order" *ngIf="customer.lastOrderDate">
                    {{ customer.lastOrderDate | date:'short' }}
                  </div>
                  <div class="no-orders" *ngIf="!customer.lastOrderDate">
                    No orders yet
                  </div>
                </td>
                <td>
                  <span class="badge" 
                        [class.badge-success]="customer.status === 'active'"
                        [class.badge-warning]="customer.status === 'inactive'">
                    {{ customer.status }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-outline btn-sm" (click)="editCustomer(customer)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <a [routerLink]="['/customer-profile', customer.id]" class="btn btn-info btn-sm">
                      <i  class="fas fa-eye"></i>
                    </a>
                    <button class="btn btn-error btn-sm" (click)="deleteCustomer(customer)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination-container">
            <button class="pagination-btn" (click)="prevPage()" [disabled]="currentPage === 1">&laquo;</button>
            <ng-container *ngFor="let page of getVisiblePages(); let i = index">
              <button 
                class="pagination-btn" 
                [class.active]="currentPage === page"
                (click)="goToPage(page)">
                {{ page }}
              </button>
            </ng-container>
            <button class="pagination-btn" (click)="nextPage()" [disabled]="currentPage === totalPages">&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customers-page {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }

    .page-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .stat-card {
      background: var(--background-card);
      color: var(--text-primary);
      border-radius: var(--border-radius);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-light);
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: var(--spacing-xs);
      color: var(--text-primary);
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 14px;
    }

    .customer-form {
      space-y: var(--spacing-lg);
    }

    .form-row {
      display: flex;
      gap: 32px;
      margin-bottom: 16px;
    }

    .form-group {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      margin-top: var(--spacing-lg);
    }

    .filters-section {
      display: flex;
      gap: var(--spacing-lg);
      align-items: center;
      flex-wrap: wrap;
    }

    .search-group {
      display: flex;
      flex: 1;
      min-width: 300px;
    }

    .search-group .form-control {
      border-radius: var(--border-radius) 0 0 var(--border-radius);
    }

    .search-group .btn {
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      border-left: none;
    }

    .filter-group {
      display: flex;
      gap: var(--spacing-sm);
    }

    .filter-group .form-control {
      min-width: 150px;
    }

    .table-container {
      overflow-x: auto;
    }

    .customer-info {
      display: flex;
      flex-direction: column;
    }

    .customer-name {
      font-weight: 500;
      margin-bottom: 2px;
      color: var(--text-primary);
    }

    .customer-since {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .email {
      font-size: 14px;
    }

    .phone {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .orders-info {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .orders-count {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .orders-label {
      font-size: 11px;
      color: var(--text-secondary);
    }

    .spent-amount {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 16px;
    }

    .last-order {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .no-orders {
      font-size: 12px;
      color: var(--text-secondary);
      font-style: italic;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
      }

      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }

      .search-group {
        min-width: auto;
      }

      .filter-group {
        flex-direction: column;
      }

      .filter-group .form-control {
        min-width: auto;
      }

      .form-row {
        flex-direction: column;
      }

      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .stats-row {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      display: block;
      margin-bottom: 4px;
      font-size: 16px;
      color: var(--text-secondary);
    }

    .styled-input,
    textarea.styled-input,
    select.styled-input {
      color: var(--text-primary) !important;
      background: var(--background-card) !important;
      width: 100%;
      border: none;
      border-bottom: 1px solid var(--text-disabled, #bdbdbd);
      outline: none;
      font-size: 16px;
      padding: 4px 0;
      transition: border-color 0.2s;
      border-radius: 0;
      box-shadow: none;
      resize: none;
    }

    .styled-input::placeholder,
    textarea.styled-input::placeholder,
    select.styled-input::placeholder {
      color: var(--text-secondary);
      opacity: 1;
    }

    .styled-input:focus,
    textarea.styled-input:focus,
    select.styled-input:focus {
      border-bottom: 2px solid #1976d2;
      background: transparent;
    }

    .styled-input::selection,
    textarea.styled-input::selection,
    select.styled-input::selection {
      background: var(--primary-color);
      color: #fff;
    }

    input.styled-input:-webkit-autofill,
    textarea.styled-input:-webkit-autofill,
    select.styled-input:-webkit-autofill {
      -webkit-text-fill-color: var(--text-primary) !important;
      box-shadow: 0 0 0 1000px var(--background-card) inset !important;
      caret-color: var(--text-primary) !important;
    }

    select.styled-input {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background: transparent;
      border: none;
      border-bottom: 1px solid var(--text-disabled, #bdbdbd);
      color: var(--text-primary);
      padding-right: 24px;
      font-size: 16px;
      outline: none;
      box-shadow: none;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      position: relative;
    }

    select.styled-input::-ms-expand {
      display: none;
    }

    /* Custom arrow for the dropdown */
    select.styled-input {
      background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%231976d2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 4px center;
      background-size: 20px 20px;
    }

    textarea.styled-input {
      min-height: 32px;
      max-height: 120px;
      resize: vertical;
      border-radius: 0;
    }

    .form-group-horizontal {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .form-label {
      min-width: 100px;
      margin: 0;
    }

    .styled-input {
      flex: 1;
    }

    .form-two-columns {
      display: flex;
      gap: 40px;
    }

    .form-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .search-group input.styled-input {
      max-width: 540px; /* 3x the previous 180px */
      min-width: 360px; /* 3x the previous 120px */
      flex: none;
    }

    .filter-group select.styled-input {
      min-width: 360px; /* 2x the previous 180px */
      max-width: 480px; /* 2x the previous 240px */
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
      background-color: transparent;
    }

    .table th, .table td {
      border-top: 1px solid #bdbdbd;    /* Minimized border thickness */
      border-bottom: 1px solid #bdbdbd; /* Minimized border thickness */
      padding: 1rem;
      text-align: left;
      color: var(--text-secondary, #757575);
      font-size: 1.1rem;
    }

    .table th {
      font-weight: bold;
      background: #fafafa;
      border-top: 1px solid #bdbdbd;
      border-bottom: 1px solid #bdbdbd;
    }

    .table tr:not(:last-child) {
      border-bottom: none; /* Remove extra border */
    }

    .table thead tr {
      border-bottom: none; /* Remove extra border */
    }

    .table tbody tr:hover {
      background: #f5f5f5;
    }

    /* Pagination styles */
    .pagination-container {
      display: flex;
      justify-content: flex-end;
      align-items: right;
      margin-top: 1rem;
      gap: 8px;
      overflow-x: auto;
      max-width: 950px;
      padding-bottom: 4px;
      min-height: 48px; /* Ensures always visible even if 1 page */
      visibility: visible; /* Always visible */
    }
    .pagination-btn {
      background: #fff;
      border: 2px solid #bdbdbd;
      color:rgb(95, 146, 198);
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s, color 0.2s;
      min-width: 10px;
      text-align: center;
      flex: 0 0 auto;           /* Prevent shrinking */
    }
    .pagination-btn.active, .pagination-btn:hover {
      background:rgb(95, 146, 198);
      color: #fff;
      border-color:hsl(210, 40.10%, 53.50%);
    }
    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm = '';
  statusFilter = '';
  sortBy: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  showAddCustomerForm = false;
  editingCustomer: Customer | null = null;

  // Stats
  totalCustomers = 0;
  activeCustomers = 0;
  averageSpent = 0;
  averageOrders = 0;

  customerForm: any = {
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    notes: '',
    totalOrders: 0,
    totalSpent: 0
  };

  // Pagination
  pageSize = 10;
  currentPage = 1;

  get totalPages() {
    return Math.ceil(this.filteredCustomers.length / this.pageSize);
  }

  get pagedCustomers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCustomers.slice(start, start + this.pageSize);
  }

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.filteredCustomers = customers;
      this.updateStats();
      this.sortCustomers();
    });
  }

  private updateStats() {
    this.totalCustomers = this.customers.length;
    this.activeCustomers = this.customers.filter(c => c.status === 'active').length;
    this.averageSpent = this.customers.length > 0 ? 
      this.customers.reduce((sum, c) => sum + c.totalSpent, 0) / this.customers.length : 0;
    this.averageOrders = this.customers.length > 0 ? 
      this.customers.reduce((sum, c) => sum + c.totalOrders, 0) / this.customers.length : 0;
  }

  filterCustomers() {
    this.filteredCustomers = this.customers.filter(customer => {
      const matchesSearch = !this.searchTerm || 
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.phone.includes(this.searchTerm);
      
      const matchesStatus = !this.statusFilter || customer.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    this.currentPage = 1; // Reset to first page on filter
    this.sortCustomers();
  }

  sortCustomers() {
    this.filteredCustomers.sort((a, b) => {
      let result = 0;
      switch (this.sortBy) {
        case 'name':
          result = a.name.localeCompare(b.name);
          break;
        case 'joinDate':
          result = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        case 'totalSpent':
          result = a.totalSpent - b.totalSpent;
          break;
        case 'totalOrders':
          result = a.totalOrders - b.totalOrders;
          break;
        default:
          result = 0;
      }
      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  editCustomer(customer: Customer) {
    this.editingCustomer = customer;
    this.customerForm = { ...customer };
    this.showAddCustomerForm = false;
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`Are you sure you want to delete "${customer.name}"?`)) {
      this.dataService.deleteCustomer(customer.id);
    }
  }

  saveCustomer() {
    if (!this.isValidForm()) return;

    if (this.editingCustomer) {
      this.dataService.updateCustomer(this.editingCustomer.id, this.customerForm);
    } else {
      this.dataService.addCustomer(this.customerForm);
    }
    
    this.cancelForm();
  }

  cancelForm() {
    this.showAddCustomerForm = false;
    this.editingCustomer = null;
    this.customerForm = {
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
      notes: '',
      totalOrders: 0,
      totalSpent: 0
    };
  }

  isValidForm(): boolean {
    return this.customerForm.name && this.customerForm.email;
  }

  exportCustomers() {
    console.log('Export customers functionality');
  }

  sortByColumn(column: string) {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.sortCustomers();
  }

  // Pagination methods
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getVisiblePages() {
    const visiblePages = [];
    const totalPages = this.totalPages;

    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(totalPages, this.currentPage + 2);

    // Ensure at least 5 pages are shown in the pagination
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }
}