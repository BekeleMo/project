import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Sale, Product, Customer } from '../../services/data.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sales-page">
      <div class="page-header">
        <h2>Sales Management</h2>
        <button class="btn btn-primary" (click)="showNewSaleForm = true">
          <i class="fas fa-plus"></i>
          New Sale
        </button>
      </div>

      <!-- New Sale Form -->
      <div class="card" *ngIf="showNewSaleForm">
        <div class="card-header">
          <h3 class="card-title">Create New Sale</h3>
          <button class="btn btn-outline" (click)="cancelNewSale()">Cancel</button>
        </div>
        
        <form (ngSubmit)="createSale()" class="sale-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Customer</label>
              <select class="form-control" [(ngModel)]="newSale.customerId" name="customerId" required>
                <option value="">Select Customer</option>
                <option *ngFor="let customer of customers" [value]="customer.id">
                  {{ customer.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="sale-items">
            <div class="items-header">
              <h4>Items</h4>
              <button type="button" class="btn btn-outline" (click)="addItem()">
                <i class="fas fa-plus"></i>
                Add Item
              </button>
            </div>

            <div class="item-row" *ngFor="let item of newSale.items; let i = index">
              <select class="form-control" [(ngModel)]="item.productId" name="productId_{{i}}" 
                      (change)="updateItemProduct(i)" required>
                <option value="">Select Product</option>
                <option *ngFor="let product of products" [value]="product.id">
                  {{ product.name }} - \${{ product.price }}
                </option>
              </select>
              
              <input type="number" class="form-control" [(ngModel)]="item.quantity" 
                     name="quantity_{{i}}" (input)="updateItemTotal(i)" min="1" required>
              
              <input type="number" class="form-control" [(ngModel)]="item.price" 
                     name="price_{{i}}" (input)="updateItemTotal(i)" step="0.01" required>
              
              <span class="item-total">\${{ item.total | number:'1.2-2' }}</span>
              
              <button type="button" class="btn btn-error" (click)="removeItem(i)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <div class="sale-totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>\${{ newSale.subtotal | number:'1.2-2' }}</span>
            </div>
            <div class="total-row">
              <span>Tax (8%):</span>
              <span>\${{ newSale.tax | number:'1.2-2' }}</span>
            </div>
            <div class="total-row total-final">
              <span>Total:</span>
              <span>\${{ newSale.total | number:'1.2-2' }}</span>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-success" [disabled]="!isValidSale()">
              Complete Sale
            </button>
            <button type="button" class="btn btn-outline" (click)="cancelNewSale()">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Sales List -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Sales</h3>
          <div class="search-controls">
            <input type="text" class="form-control" placeholder="Search sales..." 
                   [(ngModel)]="searchTerm" (input)="filterSales()">
          </div>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let sale of filteredSales">
                <td>#{{ sale.id }}</td>
                <td>{{ sale.customerName }}</td>
                <td>{{ sale.items.length }} items</td>
                <td>\${{ sale.total | number:'1.2-2' }}</td>
                <td>
                  <span class="badge" [class.badge-success]="sale.status === 'completed'"
                        [class.badge-warning]="sale.status === 'pending'"
                        [class.badge-error]="sale.status === 'cancelled'">
                    {{ sale.status }}
                  </span>
                </td>
                <td>{{ sale.saleDate | date:'short' }}</td>
                <td>
                  <button class="btn btn-outline btn-sm" (click)="viewSale(sale)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-primary btn-sm" (click)="printInvoice(sale)">
                    <i class="fas fa-print"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sales-page {
      max-width: 1200px;
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

    .sale-form {
      space-y: var(--spacing-lg);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-md);
    }

    .sale-items {
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: var(--spacing-lg);
      background-color: var(--background-secondary);
    }

    .items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }

    .items-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .item-row {
      display: grid;
      grid-template-columns: 2fr 100px 120px 100px auto;
      gap: var(--spacing-sm);
      align-items: center;
      margin-bottom: var(--spacing-sm);
      padding: var(--spacing-sm);
      background: white;
      border-radius: var(--border-radius);
    }

    .item-total {
      font-weight: 600;
      color: var(--primary-color);
    }

    .sale-totals {
      border-top: 1px solid var(--border-color);
      padding-top: var(--spacing-md);
      margin-top: var(--spacing-md);
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xs);
    }

    .total-final {
      font-size: 18px;
      font-weight: 600;
      border-top: 1px solid var(--border-color);
      padding-top: var(--spacing-sm);
      margin-top: var(--spacing-sm);
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
    }

    .search-controls {
      display: flex;
      gap: var(--spacing-sm);
      align-items: center;
    }

    .search-controls .form-control {
      width: 250px;
    }

    .table-container {
      overflow-x: auto;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
      margin-right: var(--spacing-xs);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
      }

      .item-row {
        grid-template-columns: 1fr;
        gap: var(--spacing-xs);
      }

      .search-controls .form-control {
        width: 100%;
      }
    }
  `]
})
export class SalesComponent implements OnInit {
  showNewSaleForm = false;
  searchTerm = '';
  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  products: Product[] = [];
  customers: Customer[] = [];

  newSale: any = {
    customerId: '',
    customerName: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    status: 'completed'
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getSales().subscribe(sales => {
      this.sales = sales;
      this.filteredSales = sales;
    });

    this.dataService.getProducts().subscribe(products => {
      this.products = products;
    });

    this.dataService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });
  }

  addItem() {
    this.newSale.items.push({
      productId: '',
      productName: '',
      quantity: 1,
      price: 0,
      total: 0
    });
  }

  removeItem(index: number) {
    this.newSale.items.splice(index, 1);
    this.calculateTotals();
  }

  updateItemProduct(index: number) {
    const item = this.newSale.items[index];
    const product = this.products.find(p => p.id === item.productId);
    if (product) {
      item.productName = product.name;
      item.price = product.price;
      this.updateItemTotal(index);
    }
  }

  updateItemTotal(index: number) {
    const item = this.newSale.items[index];
    item.total = item.quantity * item.price;
    this.calculateTotals();
  }

  calculateTotals() {
    this.newSale.subtotal = this.newSale.items.reduce((sum: number, item: any) => sum + item.total, 0);
    this.newSale.tax = this.newSale.subtotal * 0.08; // 8% tax
    this.newSale.total = this.newSale.subtotal + this.newSale.tax;
  }

  isValidSale(): boolean {
    return this.newSale.customerId && 
           this.newSale.items.length > 0 && 
           this.newSale.items.every((item: any) => item.productId && item.quantity > 0);
  }

  createSale() {
    if (!this.isValidSale()) return;

    const customer = this.customers.find(c => c.id === this.newSale.customerId);
    if (customer) {
      this.newSale.customerName = customer.name;
    }

    this.dataService.addSale(this.newSale);
    this.cancelNewSale();
  }

  cancelNewSale() {
    this.showNewSaleForm = false;
    this.newSale = {
      customerId: '',
      customerName: '',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: 'completed'
    };
  }

  filterSales() {
    if (!this.searchTerm) {
      this.filteredSales = this.sales;
    } else {
      this.filteredSales = this.sales.filter(sale =>
        sale.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sale.id.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  viewSale(sale: Sale) {
    // Implementation for viewing sale details
    console.log('View sale:', sale);
  }

  printInvoice(sale: Sale) {
    // Implementation for printing invoice
    console.log('Print invoice for sale:', sale);
  }
}