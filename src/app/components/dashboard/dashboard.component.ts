import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Stats Cards -->
      <div class="stats-grid grid-4 gap-md mb-lg">
        <div class="card stats-card">
          <div class="stats-icon">
            <i class="fas fa-boxes"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ stats.totalProducts }}</div>
            <div class="stats-label">Total Products</div>
          </div>
        </div>
        
        <div class="card stats-card-warning">
          <div class="stats-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ stats.lowStockProducts }}</div>
            <div class="stats-label">Low Stock Items</div>
          </div>
        </div>
        
        <div class="card stats-card-success">
          <div class="stats-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ stats.totalCustomers }}</div>
            <div class="stats-label">Total Customers</div>
          </div>
        </div>
        
        <div class="card stats-card-info">
          <div class="stats-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="stats-content">
            <div class="stats-value">\${{ stats.monthlyRevenue | number:'1.2-2' }}</div>
            <div class="stats-label">Monthly Revenue</div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Recent Sales -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Sales</h3>
            <a href="/sales" class="btn btn-outline">View All</a>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let sale of stats.recentSales">
                  <td>#{{ sale.id }}</td>
                  <td>{{ sale.customerName }}</td>
                  <td>\${{ sale.total | number:'1.2-2' }}</td>
                  <td>
                    <span class="badge" [class.badge-success]="sale.status === 'completed'"
                          [class.badge-warning]="sale.status === 'pending'"
                          [class.badge-error]="sale.status === 'cancelled'">
                      {{ sale.status }}
                    </span>
                  </td>
                  <td>{{ sale.saleDate | date:'short' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Low Stock Alert -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Low Stock Alert</h3>
            <a href="/inventory" class="btn btn-outline">View Inventory</a>
          </div>
          <div class="alert-list">
            <div class="alert-item" *ngFor="let item of stats.lowStockItems">
              <div class="alert-info">
                <div class="alert-title">{{ item.name }}</div>
                <div class="alert-subtitle">SKU: {{ item.sku }}</div>
              </div>
              <div class="alert-stock">
                <span class="stock-current">{{ item.currentStock }}</span>
                <span class="stock-separator">/</span>
                <span class="stock-min">{{ item.minStock }}</span>
              </div>
              <div class="alert-actions">
                <button class="btn btn-primary btn-sm">Restock</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sales Chart Placeholder -->
        <div class="card chart-card">
          <div class="card-header">
            <h3 class="card-title">Sales Overview</h3>
            <select class="form-control" style="width: auto;">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div class="chart-placeholder">
            <div class="chart-mock">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 70%"></div>
                <div class="bar" style="height: 85%"></div>
                <div class="bar" style="height: 95%"></div>
              </div>
              <div class="chart-labels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quick Actions</h3>
          </div>
          <div class="quick-actions">
            <a href="/products" class="action-btn">
              <i class="fas fa-plus"></i>
              <span>Add Product</span>
            </a>
            <a href="/sales" class="action-btn">
              <i class="fas fa-shopping-cart"></i>
              <span>New Sale</span>
            </a>
            <a href="/customers" class="action-btn">
              <i class="fas fa-user-plus"></i>
              <span>Add Customer</span>
            </a>
            <a href="/reports" class="action-btn">
              <i class="fas fa-file-alt"></i>
              <span>Generate Report</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    .stats-card {
      background: #48536A;
      color: white;
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
    }

    .stats-card-warning {
      background: linear-gradient(135deg, var(--warning-color), #f57c00);
      color: white;
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
    }

    .stats-card-success {
      background: linear-gradient(135deg, var(--success-color), #388e3c);
      color: white;
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
    }

    .stats-card-info {
      background: linear-gradient(135deg, var(--info-color), #1565c0);
      color: white;
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
    }

    .stats-icon {
      font-size: 2rem;
      opacity: 0.9;
    }

    .stats-content {
      flex: 1;
    }

    .stats-value {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: var(--spacing-xs);
    }

    .stats-label {
      font-size: 14px;
      opacity: 0.9;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--spacing-lg);
      grid-template-areas: 
        "sales low-stock"
        "chart actions";
    }

    .dashboard-grid .card:nth-child(1) { grid-area: sales; }
    .dashboard-grid .card:nth-child(2) { grid-area: low-stock; }
    .dashboard-grid .card:nth-child(3) { grid-area: chart; }
    .dashboard-grid .card:nth-child(4) { grid-area: actions; }

    .table-container {
      overflow-x: auto;
    }

    .alert-list {
      space-y: var(--spacing-sm);
    }

    .alert-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md);
      background-color: var(--background-secondary);
      border-radius: var(--border-radius);
      margin-bottom: var(--spacing-sm);
    }

    .alert-info {
      flex: 1;
    }

    .alert-title {
      font-weight: 500;
      margin-bottom: 2px;
    }

    .alert-subtitle {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .alert-stock {
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0 var(--spacing-md);
    }

    .stock-current {
      font-weight: 600;
      color: var(--error-color);
    }

    .stock-separator {
      color: var(--text-secondary);
    }

    .stock-min {
      color: var(--text-secondary);
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .chart-card {
      min-height: 300px;
    }

    .chart-placeholder {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chart-mock {
      width: 100%;
      max-width: 400px;
    }

    .chart-bars {
      display: flex;
      align-items: end;
      justify-content: space-between;
      height: 150px;
      margin-bottom: var(--spacing-sm);
      gap: var(--spacing-xs);
    }

    .bar {
      flex: 1;
      background: linear-gradient(to top, var(--primary-color), var(--secondary-color));
      border-radius: 4px 4px 0 0;
      min-height: 20px;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    .bar:hover {
      opacity: 1;
    }

    .chart-labels {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--spacing-lg);
      background-color: var(--background-secondary);
      border-radius: var(--border-radius);
      text-decoration: none;
      color: var(--text-primary);
      transition: all 0.2s ease;
      gap: var(--spacing-sm);
    }

    .action-btn:hover {
      background-color: var(--primary-color);
      color: white;
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }

    .action-btn i {
      font-size: 24px;
    }

    .action-btn span {
      font-size: 12px;
      font-weight: 500;
    }

    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
        grid-template-areas: 
          "sales"
          "low-stock"
          "chart"
          "actions";
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any = {};

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.stats = this.dataService.getDashboardStats();
  }
}