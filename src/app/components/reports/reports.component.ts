import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-page">
      <div class="page-header">
        <h2>Reports & Analytics</h2>
        <button class="btn btn-primary" (click)="generateReport()">
          <i class="fas fa-file-alt"></i>
          Generate Report
        </button>
       <!--  <button class="theme-toggle-btn" (click)="toggleTheme()" [attr.aria-label]="isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'">
          <i class="fas" [ngClass]="isDarkTheme ? 'fa-sun' : 'fa-moon'"></i>
        </button> -->
      </div>

      <!-- Report Types -->
      <div class="report-types">
        <div class="card report-card" 
             [class.active]="selectedReport === 'sales'"
             (click)="selectReport('sales')">
          <div class="report-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="report-info">
            <h3>Sales Report</h3>
            <p>Revenue, orders, and sales performance analysis</p>
          </div>
        </div>

        <div class="card report-card" 
             [class.active]="selectedReport === 'inventory'"
             (click)="selectReport('inventory')">
          <div class="report-icon">
            <i class="fas fa-boxes"></i>
          </div>
          <div class="report-info">
            <h3>Inventory Report</h3>
            <p>Stock levels, valuation, and inventory analysis</p>
          </div>
        </div>

        <div class="card report-card" 
             [class.active]="selectedReport === 'customers'"
             (click)="selectReport('customers')">
          <div class="report-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="report-info">
            <h3>Customer Report</h3>
            <p>Customer behavior, loyalty, and demographics</p>
          </div>
        </div>

        <div class="card report-card" 
             [class.active]="selectedReport === 'products'"
             (click)="selectReport('products')">
          <div class="report-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="report-info">
            <h3>Product Report</h3>
            <p>Product performance and category analysis</p>
          </div>
        </div>
      </div>

      <!-- Report Filters -->
      <div class="card" *ngIf="selectedReport">
        <div class="card-header">
          <h3 class="card-title">Report Filters</h3>
        </div>
        
        <div class="filters-section">
          <div class="form-group">
            <label class="form-label">Date Range</label>
            <select class="form-control" [(ngModel)]="dateRange" (change)="updateDateRange()">
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div class="form-group" *ngIf="dateRange === 'custom'">
            <label class="form-label">Start Date</label>
            <input type="date" class="form-control" [(ngModel)]="startDate">
          </div>

          <div class="form-group" *ngIf="dateRange === 'custom'">
            <label class="form-label">End Date</label>
            <input type="date" class="form-control" [(ngModel)]="endDate">
          </div>

          <div class="form-group" *ngIf="selectedReport === 'inventory'">
            <label class="form-label">Category</label>
            <select class="form-control" [(ngModel)]="categoryFilter">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
            </select>
          </div>

          <div class="form-group" *ngIf="selectedReport === 'customers'">
            <label class="form-label">Customer Status</label>
            <select class="form-control" [(ngModel)]="customerStatusFilter">
              <option value="">All Customers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div class="report-actions">
          <button class="btn btn-primary" (click)="generateReport()">
            <i class="fas fa-chart-bar"></i>
            Generate Report
          </button>
          <button class="btn btn-outline" (click)="exportReport()">
            <i class="fas fa-download"></i>
            Export PDF
          </button>
          <button class="btn btn-success" (click)="exportExcel()">
            <i class="fas fa-file-excel"></i>
            Export Excel
          </button>
        </div>
      </div>

      <!-- Report Results -->
      <div class="report-results" *ngIf="reportData">
        <!-- Sales Report -->
        <div *ngIf="selectedReport === 'sales'" class="report-content">
          <div class="report-summary">
            <div class="summary-card">
              <div class="summary-value">{{ reportData.totalRevenue | number:'1.2-2' }}</div>
              <div class="summary-label">Total Revenue</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">{{ reportData.totalSales }}</div>
              <div class="summary-label">Total Sales</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">{{ reportData.averageOrderValue | number:'1.2-2' }}</div>
              <div class="summary-label">Avg Order Value</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Top Selling Products</h3>
            </div>
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let product of reportData.topProducts">
                    <td>{{ product.name }}</td>
                    <td>{{ product.quantity }}</td>
                    <td>{{ product.revenue | number:'1.2-2' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Inventory Report -->
        <div *ngIf="selectedReport === 'inventory'" class="report-content">
          <div class="report-summary">
            <div class="summary-card">
              <div class="summary-value">{{ reportData.totalProducts }}</div>
              <div class="summary-label">Total Products</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">{{ reportData.lowStockCount }}</div>
              <div class="summary-label">Low Stock Items</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">{{ reportData.totalInventoryValue | number:'1.2-2' }}</div>
              <div class="summary-label">Total Value</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Category Breakdown</h3>
            </div>
            <div class="category-breakdown">
              <div class="category-item" *ngFor="let category of getCategoryArray(reportData.categoryBreakdown)">
                <div class="category-info">
                  <div class="category-name">{{ category.name }}</div>
                  <div class="category-stats">{{ category.count }} products • {{ category.value | number:'1.2-2' }}</div>
                </div>
                <div class="category-bar">
                  <div class="category-fill" [style.width.%]="category.percentage"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card" *ngIf="reportData.lowStockProducts?.length">
            <div class="card-header">
              <h3 class="card-title">Low Stock Alert</h3>
            </div>
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Current Stock</th>
                    <th>Min Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let product of reportData.lowStockProducts">
                    <td>{{ product.name }}</td>
                    <td class="stock-low">{{ product.currentStock }}</td>
                    <td>{{ product.minStock }}</td>
                    <td>
                      <span class="badge badge-warning">Low Stock</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-page {
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

    .report-types {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .report-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }

    .report-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }

    .report-card.active {
      border-color: var(--primary-color);
      background-color: rgba(33, 150, 243, 0.05);
    }

    .report-icon {
      font-size: 2rem;
      color: var(--primary-color);
    }

    .report-info h3 {
      margin: 0 0 var(--spacing-xs) 0;
      font-size: 16px;
      font-weight: 600;
    }

    .report-info p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .filters-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .report-actions {
      display: flex;
      gap: var(--spacing-sm);
      justify-content: flex-end;
    }

    .report-results {
      margin-top: var(--spacing-lg);
    }

    .report-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .summary-card {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      color: white;
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      text-align: center;
    }

    .summary-value {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: var(--spacing-xs);
    }

    .summary-label {
      font-size: 14px;
      opacity: 0.9;
    }

    .table-container {
      overflow-x: auto;
    }

    .category-breakdown {
      space-y: var(--spacing-md);
    }

    .category-item {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--border-color);
    }

    .category-item:last-child {
      border-bottom: none;
    }

    .category-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-sm);
    }

    .category-name {
      font-weight: 500;
    }

    .category-stats {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .category-bar {
      height: 8px;
      background-color: var(--background-secondary);
      border-radius: 4px;
      overflow: hidden;
    }

    .category-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      transition: width 0.3s ease;
    }

    .stock-low {
      color: var(--error-color);
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
      }

      .report-types {
        grid-template-columns: 1fr;
      }

      .filters-section {
        grid-template-columns: 1fr;
      }

      .report-actions {
        flex-direction: column;
      }

      .report-summary {
        grid-template-columns: 1fr;
      }
    }

    .header {
      background: var(--background-card);
      color: var(--text-primary);
    }

    .user-dropdown {
      background: var(--background-card);
      color: var(--text-primary);
    }

    .user-dropdown-header,
    .user-details {
      color: var(--text-primary);
    }

    .user-dropdown-menu .dropdown-item {
      color: var(--text-primary);
    }

    .user-dropdown-menu .dropdown-item:hover,
    .user-dropdown-menu .dropdown-item.active {
      background: var(--background-secondary);
    }

    .user-dropdown-menu .dropdown-divider {
      border-color: var(--border-color);
    }

    .user-dropdown-header .user-name,
    .user-dropdown-header .user-email,
    .user-dropdown-header .user-role {
      color: var(--text-primary);
    }

    .notifications-dropdown {
      background: var(--background-card);
      color: var(--text-primary);
    }

    .notifications-header {
      color: var(--text-primary);
    }

    .notifications-list .notification-item {
      background: var(--background-secondary);
      color: var(--text-primary);
    }

    .notifications-list .notification-title {
      color: var(--text-primary);
    }

    .notifications-list .notification-message,
    .notifications-list .notification-time {
      color: var(--text-secondary);
    }

    .btn-outline.btn-sm {
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: var(--background-card);
    }
    .btn-outline.btn-sm:hover {
      background: var(--primary-color);
      color: #fff;
    }
  `]
})
export class ReportsComponent implements OnInit {
  selectedReport = '';
  dateRange = 'month';
  startDate = '';
  endDate = '';
  categoryFilter = '';
  customerStatusFilter = '';
  categories: string[] = [];
  reportData: any = null;
  isDarkTheme = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.updateDateRange();
    this.loadCategories();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.setDarkTheme();
      this.isDarkTheme = true;
    } else {
      this.setLightTheme();
      this.isDarkTheme = false;
    }
  }

  private loadCategories() {
    this.dataService.getProducts().subscribe(products => {
      this.categories = [...new Set(products.map(p => p.category))];
    });
  }

  selectReport(reportType: string) {
    this.selectedReport = reportType;
    this.reportData = null;
  }

  updateDateRange() {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    switch (this.dateRange) {
      case 'today':
        this.startDate = this.formatDate(new Date());
        this.endDate = this.formatDate(new Date());
        break;
      case 'week':
        this.startDate = this.formatDate(startOfWeek);
        this.endDate = this.formatDate(new Date());
        break;
      case 'month':
        this.startDate = this.formatDate(startOfMonth);
        this.endDate = this.formatDate(new Date());
        break;
      case 'quarter':
        this.startDate = this.formatDate(startOfQuarter);
        this.endDate = this.formatDate(new Date());
        break;
      case 'year':
        this.startDate = this.formatDate(startOfYear);
        this.endDate = this.formatDate(new Date());
        break;
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  generateReport() {
    if (!this.selectedReport) return;

    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    switch (this.selectedReport) {
      case 'sales':
        this.reportData = this.dataService.getSalesReport(startDate, endDate);
        break;
      case 'inventory':
        this.reportData = this.dataService.getInventoryReport();
        break;
      case 'customers':
        // Implement customer report
        this.reportData = { message: 'Customer report coming soon' };
        break;
      case 'products':
        // Implement product report
        this.reportData = { message: 'Product report coming soon' };
        break;
    }
  }

  getCategoryArray(categoryBreakdown: any) {
    if (!categoryBreakdown) return [];
    
    const total = Object.values(categoryBreakdown).reduce((sum: number, cat: any) => sum + cat.value, 0);
    
    return Object.entries(categoryBreakdown).map(([name, data]: [string, any]) => ({
      name,
      count: data.count,
      value: data.value,
      percentage: total > 0 ? (data.value / total) * 100 : 0
    }));
  }

  exportReport() {
    console.log('Export PDF functionality');
  }

  exportExcel() {
    console.log('Export Excel functionality');
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      this.setDarkTheme();
      localStorage.setItem('theme', 'dark');
    } else {
      this.setLightTheme();
      localStorage.setItem('theme', 'light');
    }
  }

  setDarkTheme() {
    document.body.classList.add('dark-theme');
    document.documentElement.style.setProperty('--background-primary', '#232946');
    document.documentElement.style.setProperty('--background-secondary', '#16161a');
    document.documentElement.style.setProperty('--background-card', '#232946');
    document.documentElement.style.setProperty('--text-primary', '#f4f4f4');
    document.documentElement.style.setProperty('--text-secondary', '#bdbdbd');
    document.documentElement.style.setProperty('--sidebar-color', '#232946');
  }

  setLightTheme() {
    document.body.classList.remove('dark-theme');
    document.documentElement.style.setProperty('--background-primary', '#FFFFFF');
    document.documentElement.style.setProperty('--background-secondary', '#F5F5F5');
    document.documentElement.style.setProperty('--background-card', '#FFFFFF');
    document.documentElement.style.setProperty('--text-primary', '#212121');
    document.documentElement.style.setProperty('--text-secondary', '#757575');
    document.documentElement.style.setProperty('--sidebar-color', '#48536A');
  }
}