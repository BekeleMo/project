import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-4 sm:space-y-6">
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
            [class.border-red-400]="isFieldInvalid('productName')"
            autocomplete="off"
          />
          <div *ngIf="isFieldInvalid('productName')" 
               class="mt-2 text-sm text-red-600 animate-fade-in">
            <span *ngIf="productForm.get('productName')?.errors?.['required']">
              Product name is required
            </span>
            <span *ngIf="productForm.get('productName')?.errors?.['minlength']">
              Product name must be at least 2 characters
            </span>
          </div>
        </div>

        <!-- Status and Price Row - Responsive -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- Status Field -->
          <div class="form-group">
            <label for="status" class="form-label">Status</label>
            <div class="space-y-3">
              <select
                id="status"
                formControlName="status"
                class="modern-input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div class="flex justify-start">
                <span 
                  class="status-badge"
                  [class.active]="productForm.get('status')?.value === 'active'"
                  [class.inactive]="productForm.get('status')?.value === 'inactive'"
                >
                  {{ productForm.get('status')?.value | titlecase }}
                </span>
              </div>
            </div>
          </div>

          <!-- Price Field -->
          <div class="form-group">
            <label for="price" class="form-label">Price ($)</label>
            <input
              id="price"
              type="number"
              formControlName="price"
              class="modern-input"
              placeholder="0.00"
              step="0.01"
              min="0"
              [class.border-red-400]="isFieldInvalid('price')"
            />
            <div *ngIf="isFieldInvalid('price')" 
                 class="mt-2 text-sm text-red-600 animate-fade-in">
              Price must be greater than or equal to 0
            </div>
          </div>
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
            autocomplete="off"
          />
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
          <div class="mt-1 text-xs text-gray-500">
            {{ getDescriptionLength() }}/500 characters
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex-responsive pt-4 border-t border-gray-100">
          <button
            type="submit"
            [disabled]="productForm.invalid || isSubmitting"
            class="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span *ngIf="!isSubmitting">Save Product</span>
            <span *ngIf="isSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          </button>
          <button
            type="button"
            (click)="resetForm()"
            class="btn btn-secondary flex-1"
            [disabled]="isSubmitting"
          >
            Reset Form
          </button>
        </div>

        <!-- Form Status Indicator -->
        <div *ngIf="showSuccessMessage" 
             class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm font-medium text-green-800">Product saved successfully!</span>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
  `]
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      status: ['active'],
      description: ['', [Validators.maxLength(500)]],
      price: [0, [Validators.min(0), Validators.max(999999.99)]],
      category: ['', [Validators.maxLength(50)]]
    });
  }

  private setupFormSubscriptions(): void {
    this.productForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showSuccessMessage = false;
      });
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      setTimeout(() => {
        console.log('Product Form Data:', this.productForm.value);
        this.isSubmitting = false;
        this.showSuccessMessage = true;
        
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
        
        this.resetForm();
      }, 1500);
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
    this.showSuccessMessage = false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getDescriptionLength(): number {
    return this.productForm.get('description')?.value?.length || 0;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }
}