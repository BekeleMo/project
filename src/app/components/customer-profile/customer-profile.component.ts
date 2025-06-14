import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService, Customer, Sale } from '../../services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="customer-profile-page" *ngIf="customer">
      <div class="page-header">
        <div class="header-left">
          <a routerLink="/customers" class="btn btn-outline">
            <i class="fas fa-arrow-left"></i>
            Back to Customers
          </a>
          <h2>{{ customer.name }}</h2>
        </div>
        <button class="btn btn-primary" (click)="editMode = !editMode">
          <i class="fas fa-edit"></i>
          {{ editMode ? 'Cancel Edit' : 'Edit Profile' }}
        </button>
      </div>

      <!-- Customer Overview -->
      <div class="customer-overview">
        <div class="overview-card">
          <div class="overview-stat">
            <div class="stat-value">{{ customer.totalOrders }}</div>
            <div class="stat-label">Total Orders</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="overview-stat">
            <div class="stat-value">\${{ customer.totalSpent | number:'1.2-2' }}</div>
            <div class="stat-label">Total Spent</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="overview-stat">
            <div class="stat-value">\${{ averageOrderValue | number:'1.2-2' }}</div>
            <div class="stat-label">Avg Order Value</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="overview-stat">
            <div class="stat-value">{{ customer.status | titlecase }}</div>
            <div class="stat-label">Status</div>
          </div>
        </div>
      </div>

      <div class="profile-content">
        <!-- Customer Details -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Customer Details</h3>
          </div>
          
          <div class="customer-details" *ngIf="!editMode">
            <div class="detail-grid">
              <div class="detail-item">
                <label>Full Name</label>
                <span>{{ customer.name }}</span>
              </div>
              
              <div class="detail-item">
                <label>Email</label>
                <span>{{ customer.email }}</span>
              </div>
              
              <div class="detail-item">
                <label>Phone</label>
                <span>{{ customer.phone || 'Not provided' }}</span>
              </div>
              
              <div class="detail-item">
                <label>Status</label>
                <span class="badge" 
                      [class.badge-success]="customer.status === 'active'"
                      [class.badge-warning]="customer.status === 'inactive'">
                  {{ customer.status }}
                </span>
              </div>
              
              <div class="detail-item">
                <label>Customer Since</label>
                <span>{{ customer.joinDate | date:'fullDate' }}</span>
              </div>
              
              <div class="detail-item" *ngIf="customer.lastOrderDate">
                <label>Last Order</label>
                <span>{{ customer.lastOrderDate | date:'medium' }}</span>
              </div>
            </div>
            
            <div class="detail-item full-width" *ngIf="customer.address">
              <label>Address</label>
              <p>{{ customer.address }}</p>
            </div>
            
            <div class="detail-item full-width" *ngIf="customer.notes">
              <label>Notes</label>
              <p>{{ customer.notes }}</p>
            </div>
          </div>

          <!-- Edit Form -->
          <form *ngIf="editMode" (ngSubmit)="saveCustomer()" class="edit-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" [(ngModel)]="editForm.name" name="name" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" [(ngModel)]="editForm.email" name="email" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Phone</label>
                <input type="tel" class="form-control" [(ngModel)]="editForm.phone" name="phone">
              </div>
              
              <div class="form-group">
                <label class="form-label">Status</label>
                <select class="form-control styled-input" [(ngModel)]="editForm.status" name="status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Address</label>
              <textarea class="form-control" [(ngModel)]="editForm.address" name="address" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Notes</label>
              <textarea class="form-control" [(ngModel)]="editForm.notes" name="notes" rows="2"></textarea>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Save Changes</button>
              <button type="button" class="btn btn-outline" (click)="cancelEdit()">Cancel</button>
            </div>
          </form>
        </div>

        <!-- Order History -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Order History</h3>
            <span class="order-count">{{ customerOrders.length }} orders</span>
          </div>
          
          <div class="table-container" *ngIf="customerOrders.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of customerOrders">
                  <td>#{{ order.id }}</td>
                  <td>{{ order.saleDate | date:'short' }}</td>
                  <td>{{ order.items.length }} items</td>
                  <td>\${{ order.total | number:'1.2-2' }}</td>
                  <td>
                    <span class="badge" 
                          [class.badge-success]="order.status === 'completed'"
                          [class.badge-warning]="order.status === 'pending'"
                          [class.badge-error]="order.status === 'cancelled'">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>{{ order.paymentMethod || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="no-orders" *ngIf="customerOrders.length === 0">
            <i class="fas fa-shopping-cart"></i>
            <p>No orders found for this customer</p>
          </div>
        </div>
      </div>
    </div>

    <div class="loading-state" *ngIf="!customer">
      <div class="loading-spinner"></div>
      <p>Loading customer profile...</p>
    </div>
  `,
  styles: [`
    .customer-profile-page {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .page-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .customer-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .overview-card {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      color: white;
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      text-align: center;
    }

    .overview-stat .stat-value {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: var(--spacing-xs);
    }

    .overview-stat .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }

    .profile-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
    }

    .customer-details {
      space-y: var(--spacing-lg);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-md);
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .detail-item.full-width {
      grid-column: 1 / -1;
    }

    .detail-item label {
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 12px;
      text-transform: uppercase;
    }

    .detail-item span,
    .detail-item p {
      color: var(--text-primary);
    }

    .edit-form {
      space-y: var(--spacing-lg);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-md);
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      margin-top: var(--spacing-lg);
    }

    .order-count {
      color: var(--text-secondary);
      font-size: 14px;
    }

    .table-container {
      overflow-x: auto;
    }

    .no-orders {
      text-align: center;
      padding: var(--spacing-xl);
      color: var(--text-secondary);
    }

    .no-orders i {
      font-size: 3rem;
      margin-bottom: var(--spacing-md);
      opacity: 0.5;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
      color: var(--text-secondary);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--spacing-md);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
      }

      .header-left {
        justify-content: space-between;
      }

      .customer-overview {
        grid-template-columns: repeat(2, 1fr);
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .customer-overview {
        grid-template-columns: 1fr;
      }
    }

    input,
    textarea,
    select {
      color: var(--text-primary) !important;
      background: var(--background-card) !important;
    }

    input::placeholder,
    textarea::placeholder {
      color: var(--text-secondary);
      opacity: 1;
    }

    .styled-input,
    textarea.styled-input,
    select.styled-input {
      font-weight: 400;
    }

    input[name="name"].styled-input {
      font-weight: 400;
    }

    select.styled-input {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background: transparent;
      border: none;
      border-bottom: 1px solid var(--text-disabled, #bdbdbd);
      color: var(--text-primary);
      padding-right: 24px; /* space for arrow */
      font-size: 16px;
      outline: none;
      box-shadow: none;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      position: relative;
    }

    /* Custom arrow using a pseudo-element */
    select.styled-input::-ms-expand {
      display: none;
    }
    select.styled-input::after {
      content: '';
      position: absolute;
      right: 8px;
      top: 50%;
      width: 0;
      height: 0;
      pointer-events: none;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #1976d2; /* or your primary color */
      transform: translateY(-50%);
    }
  `]
})
export class CustomerProfileComponent implements OnInit {
  customer: Customer | null = null;
  customerOrders: Sale[] = [];
  editMode = false;
  averageOrderValue = 0;
  editForm: any = {};

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.loadCustomer(customerId);
      this.loadCustomerOrders(customerId);
    }
  }

  private loadCustomer(id: string) {
    this.customer = this.dataService.getCustomer(id) ?? null;
    if (this.customer) {
      this.editForm = { ...this.customer };
      this.averageOrderValue = this.customer.totalOrders > 0 ? 
        this.customer.totalSpent / this.customer.totalOrders : 0;
    }
  }

  private loadCustomerOrders(customerId: string) {
    this.dataService.getSales().subscribe(sales => {
      this.customerOrders = sales.filter(sale => sale.customerId === customerId);
    });
  }

  saveCustomer() {
    if (this.customer) {
      this.dataService.updateCustomer(this.customer.id, this.editForm);
      this.customer = { ...this.customer, ...this.editForm };
      this.editMode = false;
    }
  }

  cancelEdit() {
    this.editForm = { ...this.customer };
    this.editMode = false;
  }
}