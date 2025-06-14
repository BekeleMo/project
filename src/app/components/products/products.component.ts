import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DataService, Product } from "../../services/data.service";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-page">
       <div class="card">
        
      <div class="page-header">
        <h3 class="page-section-header">Product Management</h3>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="exportProducts()">
            <i class="fas fa-download"></i>
            Export
          </button>
          <button class="btn btn-success" (click)="importProducts()">
            <i class="fas fa-upload"></i>
            Import Excel
          </button>
          <button class="btn btn-primary" (click)="showAddProductForm = true">
            <i class="fas fa-plus"></i>
            Add Product
          </button>
        </div>
           </div>
      </div>

      <!-- Add/Edit Product Form -->
      <div class="card" *ngIf="showAddProductForm || editingProduct">
        <div class="card-header">
          <h4 class="card-title">
            {{ editingProduct ? "Edit Product" : "Add New Product" }}
          </h4> 
         <!--  <button class="btn btn-outline" (click)="cancelForm()">
            <i class="fas fa-times"></i>
          </button> -->
        </div>

        <form (ngSubmit)="saveProduct()" class="product-form">
          <!-- Document Detail Accordion -->
          <div class="accordion-section">
            <div class="accordion-header"
              (click)="activePanel = activePanel === 'detail' ? null : 'detail'">
              <span class="accordion-arrow" [class.open]="activePanel === 'detail'">&#9654;</span>
              <span class="accordion-title">Document Detail</span>
            </div>
            <div class="accordion-body" *ngIf="activePanel === 'detail'">
              <div class="form-two-columns">
                <div class="form-column">
                  <div class="form-group-horizontal">
                    <label class="form-label">Product Name *</label>
                    <input
                      type="text"
                      class="styled-input"
                      [(ngModel)]="productForm.name"
                      name="name"
                      required />
                  </div>
                  <div class="form-group-horizontal">
                    <label class="form-label" title="Stock Keeping Unit"
                      >SKU *</label >
                    <input
                      type="text"
                      class="styled-input"
                      [(ngModel)]="productForm.sku"
                      name="sku"
                      placeholder="Stock Keeping Unit"
                      required />
                  </div>
                  <div class="form-group-horizontal">
                    <label class="form-label">Category *</label>
                    <select
                      class="styled-input"
                      [(ngModel)]="productForm.category"
                      name="category"
                      required >
                      <option value="">Select</option>
                      <option
                        *ngFor="let category of categories"
                        [value]="category" >
                        {{ category }}
                      </option>
                      <option value="new">+ Add New Category</option>
                    </select>
                  </div>
                  <div class="form-group-horizontal">
                    <label class="form-label">Supplier</label>
                    <input
                      type="text"
                      class="styled-input"
                      [(ngModel)]="productForm.supplier"
                      name="supplier"
                    />
                  </div>
                </div>
                <div class="form-column">
                  <div class="form-group-horizontal">
                    <label class="form-label">Status</label>
                    <select
                      class="styled-input"
                      [(ngModel)]="productForm.status"
                      name="status"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>
                  <div class="form-group-horizontal">
                    <label class="form-label">Barcode</label>
                    <input
                      type="text"
                      class="styled-input"
                      [(ngModel)]="productForm.barcode"
                      name="barcode"
                    />
                  </div>
                  <div class="form-group-horizontal">
                    <label class="form-label">Description</label>
                    <textarea
                      class="styled-input"
                      [(ngModel)]="productForm.description"
                      name="description"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- General Info Accordion -->
          <div class="accordion-section">
            <div
              class="accordion-header"
              (click)="activePanel = activePanel === 'info' ? null : 'info'">
              <span
                class="accordion-arrow"
                [class.open]="activePanel === 'info'"
                >&#9654;</span>
              <span class="accordion-title">General Info</span>
            </div>
            <div class="accordion-body" *ngIf="activePanel === 'info'">
              <div class="form-two-columns">
                <div class="form-column">
                  <div class="form-group-horizontal">
                    <label class="form-label">Current Stock</label>
                    <input
                      type="number"
                      class="styled-input"
                      [(ngModel)]="productForm.currentStock"
                      name="currentStock"
                      min="0" />
                  </div>
                  <div class="form-group-horizontal">
                    <label class="form-label">Min Stock</label>
                    <input
                      type="number"
                      class="styled-input"
                      [(ngModel)]="productForm.minStock"
                      name="minStock"
                      min="0" />
                  </div>
                  <div class="form-group-horizontal">
                    <label class="form-label">Max Stock</label>
                    <input
                      type="number"
                      class="styled-input"
                      [(ngModel)]="productForm.maxStock"
                      name="maxStock"
                      min="0"/>
                  </div>
                </div>
                <div class="form-column">
                  <div class="form-group-horizontal">
                    <label class="form-label">Sale Price *</label>
                    <input
                      type="number"
                      class="styled-input"
                      [(ngModel)]="productForm.price"
                      name="price"
                      required/>
                  </div>
                  <div class="form-group-horizontal">
                    <label class="form-label">Cost Price</label>
                    <input
                      type="number"
                      class="styled-input"
                      [(ngModel)]="productForm.cost"
                      name="cost"
                      step="0.01"
                      min="0" />
                  </div>
                  <div class="form-group-horizontal">
                    <label class="form-label">Weight (kg)</label>
                    <input
                      type="number"
                      class="styled-input"
                      [(ngModel)]="productForm.weight"
                      name="weight"
                      step="0.01"
                      min="0"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button
              type="submit" title="Update Product"
              class="btn btn-primary"
              [disabled]="!isValidForm()">
              {{ editingProduct ? "Update" : "Add Product" }}
            </button>
            <button
              type="button"
              class="btn btn-outline"
              (click)="cancelForm()">
              Cancel
            </button>
          </div>
        </form>
      </div>
     
      <!-- Products Table, Search and Filters -->
      <div class="card">
        <div class="card-header">
        <div class="filters-section">
          <div class="search-group">
            <input
              type="text"
              class="form-control"
              placeholder="Search products..."
              [(ngModel)]="searchTerm"
              (input)="filterProducts()"/>
            
          </div>
          <div class="filter-group">
            <select
              class="form-control"
              [(ngModel)]="selectedCategory"
              (change)="filterProducts()">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category">
                {{ category }}
              </option>
            </select>
            <select
              class="form-control"
              [(ngModel)]="statusFilter"
              (change)="filterProducts()">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>
        <h4 class="card-title">Products ({{ filteredProducts.length }})</h4>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let product of filteredProducts"
                [class.low-stock]="product.currentStock <= product.minStock"
              >
                <td>
                  <div class="product-info">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-details">{{ product.supplier }}</div>
                  </div>
                </td>
                <td>{{ product.sku }}</td>
                <td>{{ product.category }}</td>
                <td>
                  <div class="stock-info">
                    <span
                      class="stock-value"
                      [class.stock-low]="
                        product.currentStock <= product.minStock
                      "
                      [class.stock-normal]="
                        product.currentStock > product.minStock &&
                        product.currentStock < product.maxStock * 0.8
                      "
                      [class.stock-high]="
                        product.currentStock >= product.maxStock * 0.8
                      "
                    >
                      {{ product.currentStock }}
                    </span>
                    <div class="stock-range">
                      Min: {{ product.minStock }} | Max: {{ product.maxStock }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="price-info">
                    <div class="sale-price">
                      \${{ product.price | number : "1.2-2" }}
                    </div>
                    <div class="cost-price">
                      Cost: \${{ product.cost | number : "1.2-2" }}
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    class="badge"
                    [class.badge-success]="product.status === 'active'"
                    [class.badge-warning]="product.status === 'inactive'"
                    [class.badge-error]="product.status === 'discontinued'"
                  >
                    {{ product.status }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="btn btn-outline btn-sm"
                      (click)="editProduct(product)"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-info btn-sm"
                      (click)="viewProduct(product)"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      class="btn btn-error btn-sm"
                      (click)="deleteProduct(product)"
                      *ngIf="product.status !== 'active'"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Product Details Modal -->
      <div
        class="modal-overlay"
        *ngIf="viewingProduct"
        (click)="closeProductView()"
      >
        <div class="modal modal-large" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ viewingProduct.name }}</h3>
            <button class="btn btn-outline" (click)="closeProductView()">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="product-details-grid">
              <div class="detail-item">
                <label>SKU:</label>
                <span>{{ viewingProduct.sku }}</span>
              </div>
              <div class="detail-item">
                <label>Category:</label>
                <span>{{ viewingProduct.category }}</span>
              </div>
              <div class="detail-item">
                <label>Supplier:</label>
                <span>{{ viewingProduct.supplier }}</span>
              </div>
              <div class="detail-item">
                <label>Current Stock:</label>
                <span>{{ viewingProduct.currentStock }}</span>
              </div>
              <div class="detail-item">
                <label>Min/Max Stock:</label>
                <span
                  >{{ viewingProduct.minStock }} /
                  {{ viewingProduct.maxStock }}</span
                >
              </div>
              <div class="detail-item">
                <label>Sale Price:</label>
                <span>\${{ viewingProduct.price | number : "1.2-2" }}</span>
              </div>
              <div class="detail-item">
                <label>Cost Price:</label>
                <span>\${{ viewingProduct.cost | number : "1.2-2" }}</span>
              </div>
              <div class="detail-item">
                <label>Status:</label>
                <span
                  class="badge"
                  [class.badge-success]="viewingProduct.status === 'active'"
                  [class.badge-warning]="viewingProduct.status === 'inactive'"
                  [class.badge-error]="viewingProduct.status === 'discontinued'"
                >
                  {{ viewingProduct.status }}
                </span>
              </div>
              <div class="detail-item" *ngIf="viewingProduct.barcode">
                <label>Barcode:</label>
                <span>{{ viewingProduct.barcode }}</span>
              </div>
              <div class="detail-item" *ngIf="viewingProduct.weight">
                <label>Weight:</label>
                <span>{{ viewingProduct.weight }} kg</span>
              </div>
              <div class="detail-item" *ngIf="viewingProduct.dimensions">
                <label>Dimensions:</label>
                <span>{{ viewingProduct.dimensions }}</span>
              </div>
              <div class="detail-item">
                <label>Created:</label>
                <span>{{ viewingProduct.createdAt | date : "medium" }}</span>
              </div>
              <div class="detail-item">
                <label>Last Updated:</label>
                <span>{{ viewingProduct.lastUpdated | date : "medium" }}</span>
              </div>
            </div>

            <div
              class="detail-item full-width"
              *ngIf="viewingProduct.description"
            >
              <label>Description:</label>
              <p>{{ viewingProduct.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
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

      .product-form {
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

      .product-details {
        font-size: 12px;
        color: var(--text-secondary);
      }

      .stock-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .stock-value {
        font-weight: 600;
      }

      .stock-value.stock-low {
        color: var(--error-color);
      }
      .stock-value.stock-normal {
        color: var(--warning-color);
      }
      .stock-value.stock-high {
        color: var(--success-color);
      }

      .stock-range {
        font-size: 11px;
        color: var(--text-secondary);
      }

      .price-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .sale-price {
        font-weight: 600;
        color: var(--success-color);
      }

      .cost-price {
        font-size: 11px;
        color: var(--text-secondary);
      }

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

      .modal-large {
        max-width: 800px;
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

      .product-details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
      }
    `,
  ],
})
export class ProductsComponent implements OnInit {
  activePanel: "detail" | "info" | null = "detail";
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  searchTerm = "";
  selectedCategory = "";
  statusFilter = "";
  showAddProductForm = false;
  editingProduct: Product | null = null;
  viewingProduct: Product | null = null;

  productForm: any = {
    name: "",
    sku: "",
    category: "",
    supplier: "",
    currentStock: 0,
    minStock: 0,
    maxStock: 100,
    price: 0,
    cost: 0,
    status: "active",
    description: "",
    barcode: "",
    weight: 0,
    dimensions: "",
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;
      this.extractCategories();
    });
  }

  private extractCategories() {
    this.categories = [...new Set(this.products.map((p) => p.category))];
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch =
        !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory =
        !this.selectedCategory || product.category === this.selectedCategory;
      const matchesStatus =
        !this.statusFilter || product.status === this.statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.productForm = { ...product };
    this.showAddProductForm = false;
  }

  viewProduct(product: Product) {
    this.viewingProduct = product;
  }

  closeProductView() {
    this.viewingProduct = null;
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.dataService.deleteProduct(product.id);
    }
  }

  saveProduct() {
    if (!this.isValidForm()) return;

    if (this.editingProduct) {
      this.dataService.updateProduct(this.editingProduct.id, this.productForm);
    } else {
      this.dataService.addProduct(this.productForm);
    }

    this.cancelForm();
  }

  cancelForm() {
    this.showAddProductForm = false;
    this.editingProduct = null;
    this.productForm = {
      name: "",
      sku: "",
      category: "",
      supplier: "",
      currentStock: 0,
      minStock: 0,
      maxStock: 100,
      price: 0,
      cost: 0,
      status: "active",
      description: "",
      barcode: "",
      weight: 0,
      dimensions: "",
    };
  }

  isValidForm(): boolean {
    return (
      this.productForm.name &&
      this.productForm.sku &&
      this.productForm.category &&
      this.productForm.price > 0
    );
  }

  exportProducts() {
    console.log("Export products functionality");
  }

  importProducts() {
    console.log("Import products from Excel functionality");
  }
}
