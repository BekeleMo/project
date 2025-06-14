import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, StockMovement, Product } from '../../services/data.service';

@Component({
  selector: 'app-stock-movement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stock-movement-page">
      <div class="page-header">
        <h2>Stock Movement Tracking</h2>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="exportMovements()">
            <i class="fas fa-download"></i>
            Export
          </button>
          <button class="btn btn-primary" (click)="showNewMovementForm = true">
            <i class="fas fa-plus"></i>
            New Movement
          </button>
        </div>
      </div>

      <!-- Movement Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-arrow-up" style="color: var(--success-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ todayInbound }}</div>
            <div class="stat-label">Today Inbound</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-arrow-down" style="color: var(--error-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ todayOutbound }}</div>
            <div class="stat-label">Today Outbound</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-exchange-alt" style="color: var(--info-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ totalMovements }}</div>
            <div class="stat-label">Total Movements</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ adjustmentsCount }}</div>
            <div class="stat-label">Adjustments</div>
          </div>
        </div>
      </div>

      <!-- New Movement Form -->
      <div class="card" *ngIf="showNewMovementForm">
        <div class="card-header">
          <h3 class="card-title">Create New Stock Movement</h3>
          <button class="btn btn-outline" (click)="cancelNewMovement()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form (ngSubmit)="createMovement()" class="movement-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Product *</label>
              <select class="form-control" [(ngModel)]="movementForm.productId" name="productId" required>
                <option value="">Select Product</option>
                <option *ngFor="let product of products" [value]="product.id">
                  {{ product.name }} (Current: {{ product.currentStock }})
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Movement Type *</label>
              <select class="form-control" [(ngModel)]="movementForm.type" name="type" required>
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
                <option value="transfer">Transfer</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Quantity *</label>
              <input type="number" class="form-control" [(ngModel)]="movementForm.quantity" 
                     name="quantity" min="1" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Location *</label>
              <select class="form-control" [(ngModel)]="movementForm.location" name="location" required>
                <option value="">Select Location</option>
                <option value="Warehouse A">Warehouse A</option>
                <option value="Warehouse B">Warehouse B</option>
                <option value="Store Front">Store Front</option>
                <option value="Returns">Returns</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Reference</label>
              <input type="text" class="form-control" [(ngModel)]="movementForm.reference" 
                     name="reference" placeholder="PO#, Sale#, etc.">
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Reason *</label>
            <textarea class="form-control" [(ngModel)]="movementForm.reason" 
                      name="reason" rows="3" required></textarea>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="!isValidMovement()">
              Create Movement
            </button>
            <button type="button" class="btn btn-outline" (click)="cancelNewMovement()">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Filters -->
      <div class="card">
        <div class="filters-section">
          <div class="search-group">
            <input type="text" class="form-control" placeholder="Search movements..." 
                   [(ngModel)]="searchTerm" (input)="filterMovements()">
            <button class="btn btn-outline">
              <i class="fas fa-search"></i>
            </button>
          </div>
          
          <div class="filter-group">
            <select class="form-control" [(ngModel)]="typeFilter" (change)="filterMovements()">
              <option value="">All Types</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
              <option value="transfer">Transfer</option>
              <option value="adjustment">Adjustment</option>
            </select>
            
            <select class="form-control" [(ngModel)]="locationFilter" (change)="filterMovements()">
              <option value="">All Locations</option>
              <option value="Warehouse A">Warehouse A</option>
              <option value="Warehouse B">Warehouse B</option>
              <option value="Store Front">Store Front</option>
              <option value="Returns">Returns</option>
            </select>
            
            <input type="date" class="form-control" [(ngModel)]="dateFilter" (change)="filterMovements()">
          </div>
        </div>
      </div>

      <!-- Movements Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Stock Movements ({{ filteredMovements.length }})</h3>
        </div>
        
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Stock Change</th>
                <th>Location</th>
                <th>Reason</th>
                <th>Created By</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let movement of filteredMovements">
                <td>
                  <div class="datetime-info">
                    <div class="date">{{ movement.createdAt | date:'short' }}</div>
                  </div>
                </td>
                <td>
                  <div class="product-info">
                    <div class="product-name">{{ movement.productName }}</div>
                  </div>
                </td>
                <td>
                  <span class="badge movement-type" 
                        [class.badge-success]="movement.type === 'in'"
                        [class.badge-error]="movement.type === 'out'"
                        [class.badge-info]="movement.type === 'transfer'"
                        [class.badge-warning]="movement.type === 'adjustment'">
                    <i class="fas" 
                       [class.fa-arrow-up]="movement.type === 'in'"
                       [class.fa-arrow-down]="movement.type === 'out'"
                       [class.fa-exchange-alt]="movement.type === 'transfer'"
                       [class.fa-edit]="movement.type === 'adjustment'"></i>
                    {{ movement.type | titlecase }}
                  </span>
                </td>
                <td>
                  <span class="quantity" 
                        [class.quantity-positive]="movement.type === 'in'"
                        [class.quantity-negative]="movement.type === 'out'">
                    {{ movement.type === 'out' ? '-' : '+' }}{{ movement.quantity }}
                  </span>
                </td>
                <td>
                  <div class="stock-change">
                    <span class="stock-before">{{ movement.previousStock }}</span>
                    <i class="fas fa-arrow-right"></i>
                    <span class="stock-after">{{ movement.newStock }}</span>
                  </div>
                </td>
                <td>{{ movement.location }}</td>
                <td>
                  <div class="reason-text">{{ movement.reason }}</div>
                </td>
                <td>{{ movement.createdBy }}</td>
                <td>
                  <span class="reference" *ngIf="movement.reference">{{ movement.reference }}</span>
                  <span class="no-reference" *ngIf="!movement.reference">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stock-movement-page {
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

    .movement-form {
      space-y: var(--spacing-lg);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
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
      min-width: 120px;
    }

    .table-container {
      overflow-x: auto;
    }

    .datetime-info {
      display: flex;
      flex-direction: column;
    }

    .date {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .product-info {
      display: flex;
      flex-direction: column;
    }

    .product-name {
      font-weight: 500;
    }

    .movement-type {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .quantity {
      font-weight: 600;
    }

    .quantity-positive {
      color: var(--success-color);
    }

    .quantity-negative {
      color: var(--error-color);
    }

    .stock-change {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 12px;
    }

    .stock-before {
      color: var(--text-secondary);
    }

    .stock-after {
      font-weight: 600;
      color: var(--primary-color);
    }

    .reason-text {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .reference {
      font-family: monospace;
      background-color: var(--background-secondary);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
    }

    .no-reference {
      color: var(--text-secondary);
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

      .form-grid {
        grid-template-columns: 1fr;
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
export class StockMovementComponent implements OnInit {
  movements: StockMovement[] = [];
  filteredMovements: StockMovement[] = [];
  products: Product[] = [];
  showNewMovementForm = false;
  searchTerm = '';
  typeFilter = '';
  locationFilter = '';
  dateFilter = '';

  // Stats
  todayInbound = 0;
  todayOutbound = 0;
  totalMovements = 0;
  adjustmentsCount = 0;

  movementForm = {
    productId: '',
    type: 'in',
    quantity: 0,
    location: '',
    reason: '',
    reference: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getStockMovements().subscribe(movements => {
      this.movements = movements;
      this.filteredMovements = movements;
      this.updateStats();
    });

    this.dataService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  private updateStats() {
    const today = new Date().toDateString();
    const todayMovements = this.movements.filter(m => m.createdAt.toDateString() === today);
    
    this.todayInbound = todayMovements.filter(m => m.type === 'in').length;
    this.todayOutbound = todayMovements.filter(m => m.type === 'out').length;
    this.totalMovements = this.movements.length;
    this.adjustmentsCount = this.movements.filter(m => m.type === 'adjustment').length;
  }

  filterMovements() {
    this.filteredMovements = this.movements.filter(movement => {
      const matchesSearch = !this.searchTerm || 
        movement.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        movement.reason.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        movement.createdBy.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = !this.typeFilter || movement.type === this.typeFilter;
      const matchesLocation = !this.locationFilter || movement.location === this.locationFilter;
      
      let matchesDate = true;
      if (this.dateFilter) {
        const filterDate = new Date(this.dateFilter).toDateString();
        matchesDate = movement.createdAt.toDateString() === filterDate;
      }
      
      return matchesSearch && matchesType && matchesLocation && matchesDate;
    });
  }

  createMovement() {
    if (!this.isValidMovement()) return;

    const product = this.products.find(p => p.id === this.movementForm.productId);
    if (!product) return;

    const previousStock = product.currentStock;
    let newStock = previousStock;
    
    if (this.movementForm.type === 'in') {
      newStock += this.movementForm.quantity;
    } else if (this.movementForm.type === 'out') {
      newStock -= this.movementForm.quantity;
    } else if (this.movementForm.type === 'adjustment') {
      newStock = this.movementForm.quantity;
    }

    // Update product stock
    this.dataService.updateProduct(product.id, { currentStock: newStock });

    // Add stock movement record
    this.dataService.addStockMovement({
      productId: product.id,
      productName: product.name,
      type: this.movementForm.type as any,
      quantity: this.movementForm.quantity,
      previousStock,
      newStock,
      reason: this.movementForm.reason,
      location: this.movementForm.location,
      createdBy: 'Current User',
      reference: this.movementForm.reference
    });

    this.cancelNewMovement();
  }

  cancelNewMovement() {
    this.showNewMovementForm = false;
    this.movementForm = {
      productId: '',
      type: 'in',
      quantity: 0,
      location: '',
      reason: '',
      reference: ''
    };
  }

  isValidMovement(): boolean {
    return this.movementForm.productId !== '' && 
           this.movementForm.quantity > 0 && 
           this.movementForm.location !== '' && 
           this.movementForm.reason !== '';
  }

  exportMovements() {
    console.log('Export movements functionality');
  }
}