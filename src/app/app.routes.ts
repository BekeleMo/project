import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'sales',
    loadComponent: () => import('./components/sales/sales.component').then(m => m.SalesComponent)
  },
  {
    path: 'inventory',
    loadComponent: () => import('./components/inventory/inventory.component').then(m => m.InventoryComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'stock-movement',
    loadComponent: () => import('./components/stock-movement/stock-movement.component').then(m => m.StockMovementComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'customers',
    loadComponent: () => import('./components/customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: 'customer-profile/:id',
    loadComponent: () => import('./components/customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
  }
];