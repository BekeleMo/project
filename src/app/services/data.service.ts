import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  cost: number;
  supplier: string;
  status: 'active' | 'inactive' | 'discontinued';
  description?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  lastUpdated: Date;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  joinDate: Date;
  lastOrderDate?: Date;
  notes?: string;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  saleDate: Date;
  paymentMethod?: string;
  notes?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  location: string;
  createdBy: string;
  createdAt: Date;
  reference?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: string[];
  status: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: Date;
  userId?: string;
}

export interface SystemSettings {
  companyName: string;
  currency: string;
  taxRate: number;
  lowStockThreshold: number;
  autoReorderEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  theme: 'light' | 'dark';
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private productsSubject = new BehaviorSubject<Product[]>(this.generateMockProducts());
  private customersSubject = new BehaviorSubject<Customer[]>(this.generateMockCustomers());
  private salesSubject = new BehaviorSubject<Sale[]>(this.generateMockSales());
  private stockMovementsSubject = new BehaviorSubject<StockMovement[]>(this.generateMockStockMovements());
  private usersSubject = new BehaviorSubject<User[]>(this.generateMockUsers());
  private notificationsSubject = new BehaviorSubject<Notification[]>(this.generateMockNotifications());
  private settingsSubject = new BehaviorSubject<SystemSettings>(this.getDefaultSettings());

  products$ = this.productsSubject.asObservable();
  customers$ = this.customersSubject.asObservable();
  sales$ = this.salesSubject.asObservable();
  stockMovements$ = this.stockMovementsSubject.asObservable();
  users$ = this.usersSubject.asObservable();
  notifications$ = this.notificationsSubject.asObservable();
  settings$ = this.settingsSubject.asObservable();

  // Products
  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProduct(id: string): Product | undefined {
    return this.productsSubject.value.find(p => p.id === id);
  }

  addProduct(product: Omit<Product, 'id' | 'lastUpdated' | 'createdAt'>): void {
    const products = this.productsSubject.value;
    const newProduct: Product = {
      ...product,
      id: this.generateId(),
      lastUpdated: new Date(),
      createdAt: new Date()
    };
    this.productsSubject.next([...products, newProduct]);
    this.addNotification({
      title: 'Product Added',
      message: `Product "${product.name}" has been added to inventory`,
      type: 'success'
    });
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    const products = this.productsSubject.value;
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates, lastUpdated: new Date() };
      this.productsSubject.next([...products]);
    }
  }

  deleteProduct(id: string): void {
    const products = this.productsSubject.value;
    const product = products.find(p => p.id === id);
    if (product) {
      this.productsSubject.next(products.filter(p => p.id !== id));
      this.addNotification({
        title: 'Product Deleted',
        message: `Product "${product.name}" has been deleted`,
        type: 'warning'
      });
    }
  }

  // Customers
  getCustomers(): Observable<Customer[]> {
    return this.customers$;
  }

  getCustomer(id: string): Customer | undefined {
    return this.customersSubject.value.find(c => c.id === id);
  }

  addCustomer(customer: Omit<Customer, 'id' | 'joinDate'>): void {
    const customers = this.customersSubject.value;
    const newCustomer: Customer = {
      ...customer,
      id: this.generateId(),
      joinDate: new Date()
    };
    this.customersSubject.next([...customers, newCustomer]);
    this.addNotification({
      title: 'Customer Added',
      message: `Customer "${customer.name}" has been added`,
      type: 'success'
    });
  }

  updateCustomer(id: string, updates: Partial<Customer>): void {
    const customers = this.customersSubject.value;
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      this.customersSubject.next([...customers]);
    }
  }

  deleteCustomer(id: string): void {
    const customers = this.customersSubject.value;
    const customer = customers.find(c => c.id === id);
    if (customer) {
      this.customersSubject.next(customers.filter(c => c.id !== id));
      this.addNotification({
        title: 'Customer Deleted',
        message: `Customer "${customer.name}" has been deleted`,
        type: 'warning'
      });
    }
  }

  // Sales
  getSales(): Observable<Sale[]> {
    return this.sales$;
  }

  addSale(sale: Omit<Sale, 'id' | 'saleDate'>): void {
    const sales = this.salesSubject.value;
    const newSale: Sale = {
      ...sale,
      id: this.generateId(),
      saleDate: new Date()
    };
    this.salesSubject.next([...sales, newSale]);
    
    // Update product stock
    sale.items.forEach(item => {
      const product = this.getProduct(item.productId);
      if (product) {
        this.updateProduct(product.id, { 
          currentStock: product.currentStock - item.quantity 
        });
        this.addStockMovement({
          productId: product.id,
          productName: product.name,
          type: 'out',
          quantity: item.quantity,
          previousStock: product.currentStock,
          newStock: product.currentStock - item.quantity,
          reason: `Sale #${newSale.id}`,
          location: 'Store Front',
          createdBy: 'Sales User'
        });
      }
    });

    this.addNotification({
      title: 'Sale Completed',
      message: `Sale #${newSale.id} completed for $${newSale.total.toFixed(2)}`,
      type: 'success'
    });
  }

  // Stock Movements
  getStockMovements(): Observable<StockMovement[]> {
    return this.stockMovements$;
  }

  addStockMovement(movement: Omit<StockMovement, 'id' | 'createdAt'>): void {
    const movements = this.stockMovementsSubject.value;
    const newMovement: StockMovement = {
      ...movement,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.stockMovementsSubject.next([...movements, newMovement]);
  }

  // Users
  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getCurrentUser(): User {
    return this.usersSubject.value[0]; // Mock current user
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): void {
    const users = this.usersSubject.value;
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.usersSubject.next([...users, newUser]);
  }

  updateUser(id: string, updates: Partial<User>): void {
    const users = this.usersSubject.value;
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.usersSubject.next([...users]);
    }
  }

  // Notifications
  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  addNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): void {
    const notifications = this.notificationsSubject.value;
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      read: false,
      createdAt: new Date()
    };
    this.notificationsSubject.next([newNotification, ...notifications]);
  }

  markNotificationAsRead(id: string): void {
    const notifications = this.notificationsSubject.value;
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].read = true;
      this.notificationsSubject.next([...notifications]);
    }
  }

  getUnreadNotificationsCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  // Settings
  getSettings(): Observable<SystemSettings> {
    return this.settings$;
  }

  updateSettings(settings: Partial<SystemSettings>): void {
    const currentSettings = this.settingsSubject.value;
    this.settingsSubject.next({ ...currentSettings, ...settings });
  }

  // Search
  searchProducts(query: string): Product[] {
    const products = this.productsSubject.value;
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchCustomers(query: string): Customer[] {
    const customers = this.customersSubject.value;
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(query.toLowerCase()) ||
      customer.email.toLowerCase().includes(query.toLowerCase()) ||
      customer.phone.includes(query)
    );
  }

  // Reports
  getSalesReport(startDate: Date, endDate: Date) {
    const sales = this.salesSubject.value.filter(sale =>
      sale.saleDate >= startDate && sale.saleDate <= endDate
    );
    
    return {
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0),
      averageOrderValue: sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0,
      topProducts: this.getTopSellingProducts(sales),
      salesByDay: this.getSalesByDay(sales)
    };
  }

  getInventoryReport() {
    const products = this.productsSubject.value;
    const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);
    const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.cost), 0);
    
    return {
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      totalInventoryValue: totalValue,
      categoryBreakdown: this.getCategoryBreakdown(products),
      lowStockProducts
    };
  }

  // Dashboard Statistics
  getDashboardStats() {
    const products = this.productsSubject.value;
    const customers = this.customersSubject.value;
    const sales = this.salesSubject.value;
    
    const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);
    const todaySales = sales.filter(s => this.isToday(s.saleDate));
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const monthlyRevenue = sales.filter(s => this.isThisMonth(s.saleDate))
                               .reduce((sum, sale) => sum + sale.total, 0);

    return {
      totalProducts: products.length,
      lowStockProducts: lowStockProducts.length,
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.status === 'active').length,
      todaySales: todaySales.length,
      todayRevenue: todaySales.reduce((sum, sale) => sum + sale.total, 0),
      totalRevenue,
      monthlyRevenue,
      recentSales: sales.slice(0, 5),
      lowStockItems: lowStockProducts.slice(0, 5)
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  private isThisMonth(date: Date): boolean {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  private getTopSellingProducts(sales: Sale[]) {
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.total;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }

  private getSalesByDay(sales: Sale[]) {
    const salesByDay: { [key: string]: number } = {};
    
    sales.forEach(sale => {
      const day = sale.saleDate.toDateString();
      salesByDay[day] = (salesByDay[day] || 0) + sale.total;
    });

    return salesByDay;
  }

  private getCategoryBreakdown(products: Product[]) {
    const breakdown: { [key: string]: { count: number; value: number } } = {};
    
    products.forEach(product => {
      if (!breakdown[product.category]) {
        breakdown[product.category] = { count: 0, value: 0 };
      }
      breakdown[product.category].count++;
      breakdown[product.category].value += product.currentStock * product.cost;
    });

    return breakdown;
  }

  private getDefaultSettings(): SystemSettings {
    return {
      companyName: 'Inventory Management System',
      currency: 'USD',
      taxRate: 8,
      lowStockThreshold: 10,
      autoReorderEnabled: false,
      emailNotifications: true,
      smsNotifications: false,
      theme: 'light',
      language: 'en'
    };
  }

  private generateMockProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        category: 'Electronics',
        currentStock: 45,
        minStock: 10,
        maxStock: 100,
        price: 79.99,
        cost: 45.00,
        supplier: 'TechCorp',
        status: 'active',
        description: 'High-quality wireless headphones with noise cancellation',
        barcode: '1234567890123',
        weight: 0.3,
        dimensions: '20x15x8 cm',
        lastUpdated: new Date('2024-01-15'),
        createdAt: new Date('2023-12-01')
      },
      {
        id: '2',
        name: 'Smartphone Case',
        sku: 'SC-002',
        category: 'Accessories',
        currentStock: 8,
        minStock: 15,
        maxStock: 200,
        price: 24.99,
        cost: 12.00,
        supplier: 'AccessoryPlus',
        status: 'active',
        description: 'Protective case for smartphones',
        barcode: '1234567890124',
        weight: 0.1,
        dimensions: '15x8x1 cm',
        lastUpdated: new Date('2024-01-14'),
        createdAt: new Date('2023-11-15')
      },
      {
        id: '3',
        name: 'USB-C Cable',
        sku: 'UC-003',
        category: 'Cables',
        currentStock: 150,
        minStock: 20,
        maxStock: 300,
        price: 12.99,
        cost: 6.50,
        supplier: 'CableWorks',
        status: 'active',
        description: 'High-speed USB-C charging cable',
        barcode: '1234567890125',
        weight: 0.05,
        dimensions: '100x2x1 cm',
        lastUpdated: new Date('2024-01-13'),
        createdAt: new Date('2023-10-20')
      },
      {
        id: '4',
        name: 'Wireless Mouse',
        sku: 'WM-004',
        category: 'Computer Accessories',
        currentStock: 32,
        minStock: 10,
        maxStock: 80,
        price: 34.99,
        cost: 18.00,
        supplier: 'TechCorp',
        status: 'active',
        description: 'Ergonomic wireless mouse with precision tracking',
        barcode: '1234567890126',
        weight: 0.12,
        dimensions: '12x6x4 cm',
        lastUpdated: new Date('2024-01-12'),
        createdAt: new Date('2023-09-10')
      },
      {
        id: '5',
        name: 'Laptop Stand',
        sku: 'LS-005',
        category: 'Office Supplies',
        currentStock: 5,
        minStock: 10,
        maxStock: 50,
        price: 49.99,
        cost: 25.00,
        supplier: 'OfficeSupply Co',
        status: 'active',
        description: 'Adjustable laptop stand for better ergonomics',
        barcode: '1234567890127',
        weight: 0.8,
        dimensions: '30x25x5 cm',
        lastUpdated: new Date('2024-01-11'),
        createdAt: new Date('2023-08-05')
      }
    ];
  }

  private generateMockCustomers(): Customer[] {
    return [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        address: '123 Main St, City, State 12345',
        totalOrders: 15,
        totalSpent: 1250.75,
        status: 'active',
        joinDate: new Date('2023-06-15'),
        lastOrderDate: new Date('2024-01-10'),
        notes: 'Preferred customer, always pays on time'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0124',
        address: '456 Oak Ave, City, State 12346',
        totalOrders: 8,
        totalSpent: 645.20,
        status: 'active',
        joinDate: new Date('2023-08-22'),
        lastOrderDate: new Date('2024-01-05')
      },
      {
        id: '3',
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '+1-555-0125',
        address: '789 Pine St, City, State 12347',
        totalOrders: 22,
        totalSpent: 2180.40,
        status: 'active',
        joinDate: new Date('2023-04-10'),
        lastOrderDate: new Date('2024-01-12')
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1-555-0126',
        address: '321 Elm St, City, State 12348',
        totalOrders: 5,
        totalSpent: 398.50,
        status: 'inactive',
        joinDate: new Date('2023-11-05'),
        lastOrderDate: new Date('2023-12-15')
      }
    ];
  }

  private generateMockSales(): Sale[] {
    return [
      {
        id: '1',
        customerId: '1',
        customerName: 'John Smith',
        items: [
          {
            productId: '1',
            productName: 'Wireless Bluetooth Headphones',
            quantity: 1,
            price: 79.99,
            total: 79.99
          },
          {
            productId: '3',
            productName: 'USB-C Cable',
            quantity: 2,
            price: 12.99,
            total: 25.98
          }
        ],
        subtotal: 105.97,
        tax: 8.48,
        total: 114.45,
        status: 'completed',
        saleDate: new Date('2024-01-15'),
        paymentMethod: 'Credit Card'
      },
      {
        id: '2',
        customerId: '2',
        customerName: 'Sarah Johnson',
        items: [
          {
            productId: '2',
            productName: 'Smartphone Case',
            quantity: 1,
            price: 24.99,
            total: 24.99
          }
        ],
        subtotal: 24.99,
        tax: 2.00,
        total: 26.99,
        status: 'completed',
        saleDate: new Date('2024-01-14'),
        paymentMethod: 'Cash'
      }
    ];
  }

  private generateMockStockMovements(): StockMovement[] {
    return [
      {
        id: '1',
        productId: '1',
        productName: 'Wireless Bluetooth Headphones',
        type: 'in',
        quantity: 50,
        previousStock: 25,
        newStock: 75,
        reason: 'Purchase Order #PO-001',
        location: 'Warehouse A',
        createdBy: 'Admin User',
        createdAt: new Date('2024-01-15'),
        reference: 'PO-001'
      },
      {
        id: '2',
        productId: '2',
        productName: 'Smartphone Case',
        type: 'out',
        quantity: 12,
        previousStock: 20,
        newStock: 8,
        reason: 'Sale #S-002',
        location: 'Store Front',
        createdBy: 'Sales User',
        createdAt: new Date('2024-01-14'),
        reference: 'S-002'
      },
      {
        id: '3',
        productId: '5',
        productName: 'Laptop Stand',
        type: 'adjustment',
        quantity: -5,
        previousStock: 10,
        newStock: 5,
        reason: 'Damage during transport',
        location: 'Warehouse A',
        createdBy: 'Warehouse Manager',
        createdAt: new Date('2024-01-13')
      }
    ];
  }

  private generateMockUsers(): User[] {
    return [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@company.com',
        role: 'admin',
        permissions: ['all'],
        status: 'active',
        lastLogin: new Date('2024-01-15'),
        createdAt: new Date('2023-01-01'),
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
      },
      {
        id: '2',
        name: 'Manager User',
        email: 'manager@company.com',
        role: 'manager',
        permissions: ['products', 'inventory', 'sales', 'customers', 'reports'],
        status: 'active',
        lastLogin: new Date('2024-01-14'),
        createdAt: new Date('2023-02-01')
      },
      {
        id: '3',
        name: 'Staff User',
        email: 'staff@company.com',
        role: 'staff',
        permissions: ['sales', 'customers'],
        status: 'active',
        lastLogin: new Date('2024-01-13'),
        createdAt: new Date('2023-03-01')
      }
    ];
  }

  private generateMockNotifications(): Notification[] {
    return [
      {
        id: '1',
        title: 'Low Stock Alert',
        message: 'Smartphone Case is running low on stock (8 remaining)',
        type: 'warning',
        read: false,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'New Sale',
        message: 'Sale #2 completed for $26.99',
        type: 'success',
        read: false,
        createdAt: new Date('2024-01-14')
      },
      {
        id: '3',
        title: 'Stock Adjustment',
        message: 'Laptop Stand stock adjusted due to damage',
        type: 'info',
        read: true,
        createdAt: new Date('2024-01-13')
      }
    ];
  }
}