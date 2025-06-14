import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Product } from '../../services/data.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inventory-page">
      <div class="page-header">
        <h2>Inventory Management</h2>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="exportInventory()">
            <i class="fas fa-download"></i>
            Export
          </button>
          <button class="btn btn-primary" (click)="showAdjustmentModal = true">
            <i class="fas fa-edit"></i>
            Stock Adjustment
          </button>
        </div>
      </div>

      <!-- Inventory Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-boxes" style="color: var(--primary-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ totalProducts }}</div>
            <div class="stat-label">Total Products</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ lowStockCount }}</div>
            <div class="stat-label">Low Stock Items</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-dollar-sign" style="color: var(--success-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">\${{ totalValue | number:'1.2-2' }}</div>
            <div class="stat-label">Total Inventory Value</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line" style="color: var(--info-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ averageTurnover }}%</div>
            <div class="stat-label">Avg. Turnover Rate</div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="card">
        <div class="filters-section">
          <div class="search-group">
            <input type="text" class="form-control" placeholder="Search products..." 
                   [(ngModel)]="searchTerm" (input)="filterProducts()">
            <button class="btn btn-outline">
              <i class="fas fa-search"></i>
            </button>
          </div>
          
          <div class="filter-group">
            <select class="form-control" [(ngModel)]="selectedCategory" (change)="filterProducts()">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
            </select>
            
            <select class="form-control" [(ngModel)]="stockFilter" (change)="filterProducts()">
              <option value="">All Stock Levels</option>
              <option value="low">Low Stock</option>
              <option value="normal">Normal Stock</option>
              <option value="high">High Stock</option>
            </select>
            
            <select class="form-control" [(ngModel)]="statusFilter" (change)="filterProducts()">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min/Max</th>
                <th>Unit Price</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of filteredProducts" 
                  [class.low-stock]="product.currentStock <= product.minStock">
                <td>
                  <div class="product-info">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-supplier">{{ product.supplier }}</div>
                  </div>
                </td>
                <td>{{ product.sku }}</td>
                <td>{{ product.category }}</td>
                <td>
                  <div class="stock-info">
                    <span class="stock-value" 
                          [class.stock-low]="product.currentStock <= product.minStock"
                          [class.stock-normal]="product.currentStock > product.minStock && product.currentStock < product.maxStock * 0.8"
                          [class.stock-high]="product.currentStock >= product.maxStock * 0.8">
                      {{ product.currentStock }}
                    </span>
                    <div class="stock-bar">
                      <div class="stock-fill" 
                           [style.width.%]="(product.currentStock / product.maxStock) * 100"
                           [class.fill-low]="product.currentStock <= product.minStock"
                           [class.fill-normal]="product.currentStock > product.minStock && product.currentStock < product.maxStock * 0.8"
                           [class.fill-high]="product.currentStock >= product.maxStock * 0.8">
                      </div>
                    </div>
                  </div>
                </td>
                <td>{{ product.minStock }} / {{ product.maxStock }}</td>
                <td>\${{ product.price | number:'1.2-2' }}</td>
                <td>\${{ (product.currentStock * product.price) | number:'1.2-2' }}</td>
                <td>
                  <span class="badge" 
                        [class.badge-success]="product.status === 'active'"
                        [class.badge-warning]="product.status === 'inactive'"
                        [class.badge-error]="product.status === 'discontinued'">
                    {{ product.status }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-outline btn-sm" (click)="adjustStock(product)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-primary btn-sm" (click)="viewHistory(product)">
                      <i class="fas fa-history"></i>
                    </button>
                    <button class="btn btn-success btn-sm" (click)="restock(product)">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Stock Adjustment Modal -->
      <div class="modal-overlay" *ngIf="showAdjustmentModal" (click)="closeAdjustmentModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Stock Adjustment</h3>
            <button class="btn btn-outline" (click)="closeAdjustmentModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Product</label>
              <select class="form-control" [(ngModel)]="adjustmentForm.productId">
                <option value="">Select Product</option>
                <option *ngFor="let product of products" [value]="product.id">
                  {{ product.name }} (Current: {{ product.currentStock }})
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Adjustment Type</label>
              <select class="form-control" [(ngModel)]="adjustmentForm.type">
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Quantity</label>
              <input type="number" class="form-control" [(ngModel)]="adjustmentForm.quantity" min="1">
            </div>
            
            <div class="form-group">
              <label class="form-label">Reason</label>
              <textarea class="form-control" [(ngModel)]="adjustmentForm.reason" rows="3"></textarea>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-primary" (click)="submitAdjustment()">
              Submit Adjustment
            </button>
            <button class="btn btn-outline" (click)="closeAdjustmentModal()">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inventory-page {
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
      background: white;
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
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 14px;
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

    .low-stock {
      background-color: rgba(244, 67, 54, 0.05);
    }

    .product-info {
      display: flex;
      flex-direction: column;
    }

    .product-name {
      font-weight: 500;
      margin-bottom: 2px;
    }

    .product-supplier {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .stock-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stock-value {
      font-weight: 600;
    }

    .stock-value.stock-low { color: var(--error-color); }
    .stock-value.stock-normal { color: var(--warning-color); }
    .stock-value.stock-high { color: var(--success-color); }

    .stock-bar {
      width: 60px;
      height: 4px;
      background-color: var(--border-color);
      border-radius: 2px;
      overflow: hidden;
    }

    .stock-fill {
      height: 100%;
      transition: width 0.3s ease;
    }

    .stock-fill.fill-low { background-color: var(--error-color); }
    .stock-fill.fill-normal { background-color: var(--warning-color); }
    .stock-fill.fill-high { background-color: var(--success-color); }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-heavy);
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-color);
    }

    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .modal-body {
      padding: var(--spacing-lg);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      border-top: 1px solid var(--border-color);
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

      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .stats-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  searchTerm = '';
  selectedCategory = '';
  stockFilter = '';
  statusFilter = '';
  showAdjustmentModal = false;

  adjustmentForm = {
    productId: '',
    type: 'in',
    quantity: 0,
    reason: ''
  };

  // Stats
  totalProducts = 0;
  lowStockCount = 0;
  totalValue = 0;
  averageTurnover = 85;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
      this.updateStats();
      this.extractCategories();
    });
  }

  private updateStats() {
    this.totalProducts = this.products.length;
    this.lowStockCount = this.products.filter(p => p.currentStock <= p.minStock).length;
    this.totalValue = this.products.reduce((sum, p) => sum + (p.currentStock * p.price), 0);
  }

  private extractCategories() {
    this.categories = [...new Set(this.products.map(p => p.category))];
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      
      const matchesStock = !this.stockFilter || 
        (this.stockFilter === 'low' && product.currentStock <= product.minStock) ||
        (this.stockFilter === 'normal' && product.currentStock > product.minStock && product.currentStock < product.maxStock * 0.8) ||
        (this.stockFilter === 'high' && product.currentStock >= product.maxStock * 0.8);
      
      const matchesStatus = !this.statusFilter || product.status === this.statusFilter;
      
      return matchesSearch && matchesCategory && matchesStock && matchesStatus;
    });
  }

  adjustStock(product: Product) {
    this.adjustmentForm.productId = product.id;
    this.showAdjustmentModal = true;
  }

  viewHistory(product: Product) {
    console.log('View history for:', product);
  }

  restock(product: Product) {
    this.adjustmentForm.productId = product.id;
    this.adjustmentForm.type = 'in';
    this.adjustmentForm.quantity = product.maxStock - product.currentStock;
    this.showAdjustmentModal = true;
  }

  submitAdjustment() {
    const product = this.products.find(p => p.id === this.adjustmentForm.productId);
    if (product) {
      const previousStock = product.currentStock;
      let newStock = previousStock;
      
      if (this.adjustmentForm.type === 'in') {
        newStock += this.adjustmentForm.quantity;
      } else if (this.adjustmentForm.type === 'out') {
        newStock -= this.adjustmentForm.quantity;
      } else {
        newStock = this.adjustmentForm.quantity;
      }
      
      // Update product stock
      this.dataService.updateProduct(product.id, { currentStock: newStock });
      
      // Add stock movement record
      this.dataService.addStockMovement({
        productId: product.id,
        productName: product.name,
        type: this.adjustmentForm.type as any,
        quantity: this.adjustmentForm.quantity,
        previousStock,
        newStock,
        reason: this.adjustmentForm.reason,
        location: 'Main Warehouse',
        createdBy: 'Admin User'
      });
      
      this.closeAdjustmentModal();
    }
  }

  closeAdjustmentModal() {
    this.showAdjustmentModal = false;
    this.adjustmentForm = {
      productId: '',
      type: 'in',
      quantity: 0,
      reason: ''
    };
  }

  exportInventory() {
    console.log('Export inventory');
  }
}