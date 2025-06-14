import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Product Name Field -->
        <div class="form-group">
          <label for="productName" class="form-label">
            Product Name <span class="text-red-500">*</span>
          </label>
          <input
            id="productName"
            type="text"
            formControlName="productName"
            class="modern-input"
            placeholder="Enter product name"
            [class.border-red-400]="productForm.get('productName')?.invalid && productForm.get('productName')?.touched"
          />
          <div *ngIf="productForm.get('productName')?.invalid && productForm.get('productName')?.touched" 
               class="mt-1 text-sm text-red-600">
            Product name is required
          </div>
        </div>

        <!-- Status Field -->
        <div class="form-group">
          <label for="status" class="form-label">Status</label>
          <div class="flex items-center space-x-4">
            <select
              id="status"
              formControlName="status"
              class="modern-input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <span 
              class="status-badge"
              [class.active]="productForm.get('status')?.value === 'active'"
              [class.inactive]="productForm.get('status')?.value === 'inactive'"
            >
              {{ productForm.get('status')?.value | titlecase }}
            </span>
          </div>
        </div>

        <!-- Description Field -->
        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            class="modern-input resize-none"
            placeholder="Enter product description"
          ></textarea>
        </div>

        <!-- Price Field -->
        <div class="form-group">
          <label for="price" class="form-label">Price</label>
          <input
            id="price"
            type="number"
            formControlName="price"
            class="modern-input"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        <!-- Category Field -->
        <div class="form-group">
          <label for="category" class="form-label">Category</label>
          <input
            id="category"
            type="text"
            formControlName="category"
            class="modern-input"
            placeholder="Enter product category"
          />
        </div>

        <!-- Submit Button -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            [disabled]="productForm.invalid"
            class="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Product
          </button>
          <button
            type="button"
            (click)="resetForm()"
            class="btn btn-secondary flex-1"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(2)]],
      status: ['active'],
      description: [''],
      price: [0, [Validators.min(0)]],
      category: ['']
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      console.log('Product Form Data:', this.productForm.value);
      // Handle form submission here
      this.resetForm();
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.productForm.reset({
      productName: '',
      status: 'active',
      description: '',
      price: 0,
      category: ''
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }
}