import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, Notification, User } from '../../services/data.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <div class="logo">
            <i class="fas fa-boxes"></i>
            <span *ngIf="!sidebarCollapsed">InvMS</span>
          </div>
          <button class="sidebar-toggle" (click)="toggleSidebar()">
            <i class="fas fa-bars"></i>
          </button>
        </div>
        
        <nav class="sidebar-nav">
          <ul class="nav-list">
            <li class="nav-item" *ngFor="let item of menuItems">
              <a 
                [routerLink]="item.route" 
                routerLinkActive="active"
                class="nav-link"
              >
                <i [class]="item.icon"></i>
                <span *ngIf="!sidebarCollapsed">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <button class="menu-toggle" (click)="toggleSidebar()">
              <i class="fas fa-bars"></i>
            </button>
            <h1 class="page-title">{{ currentPageTitle }}</h1>
          </div>
          
          <div class="header-right">
            <div class="header-actions">
              <!-- Global Search -->
              <div class="search-container" [class.expanded]="searchExpanded">
                <input type="text" class="search-input" placeholder="Search..." 
                       [(ngModel)]="searchQuery" (input)="performSearch()"
                       (focus)="searchExpanded = true" (blur)="onSearchBlur()">
                <button class="search-btn" (click)="toggleSearch()">
                  <i class="fas fa-search"></i>
                </button>
                
                <!-- Search Results -->
                <div class="search-results" *ngIf="searchExpanded && searchResults.length > 0">
                  <div class="search-section" *ngIf="searchResults.products?.length">
                    <h4>Products</h4>
                    <div class="search-item" *ngFor="let product of searchResults.products.slice(0, 3)"
                         (click)="navigateToProduct(product)">
                      <i class="fas fa-box"></i>
                      <span>{{ product.name }}</span>
                    </div>
                  </div>
                  
                  <div class="search-section" *ngIf="searchResults.customers?.length">
                    <h4>Customers</h4>
                    <div class="search-item" *ngFor="let customer of searchResults.customers.slice(0, 3)"
                         (click)="navigateToCustomer(customer)">
                      <i class="fas fa-user"></i>
                      <span>{{ customer.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Theme Toggle Button -->
              <button class="theme-toggle-btn" (click)="toggleTheme()" [attr.aria-label]="isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'">
                <i class="fas" [ngClass]="isDarkTheme ? 'fa-sun' : 'fa-moon'"></i>
              </button>

              <!-- Notifications -->
              <div class="notifications-container">
                <button class="header-btn" (click)="toggleNotifications()">
                  <i class="fas fa-bell"></i>
                  <span class="badge-dot" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
                </button>
                
                <!-- Notifications Dropdown -->
                <div class="notifications-dropdown" *ngIf="showNotifications">
                  <div class="notifications-header">
                    <h4>Notifications</h4>
                    <button class="btn btn-outline btn-sm" (click)="markAllAsRead()">
                      Mark all read
                    </button>
                  </div>
                  
                  <div class="notifications-list">
                    <div class="notification-item" *ngFor="let notification of notifications.slice(0, 5)"
                         [class.unread]="!notification.read"
                         (click)="markAsRead(notification)">
                      <div class="notification-icon" [class]="'type-' + notification.type">
                        <i class="fas" 
                           [class.fa-info-circle]="notification.type === 'info'"
                           [class.fa-exclamation-triangle]="notification.type === 'warning'"
                           [class.fa-times-circle]="notification.type === 'error'"
                           [class.fa-check-circle]="notification.type === 'success'"></i>
                      </div>
                      <div class="notification-content">
                        <div class="notification-title">{{ notification.title }}</div>
                        <div class="notification-message">{{ notification.message }}</div>
                        <div class="notification-time">{{ notification.createdAt | date:'short' }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="notifications-footer" *ngIf="notifications.length === 0">
                    <p>No notifications</p>
                  </div>
                </div>
              </div>

              <!-- User Menu -->
              <div class="user-menu-container">
                <div class="user-menu" (click)="toggleUserMenu()">
                  <img [src]="currentUser.avatar || defaultAvatar" alt="User" class="user-avatar">
                  <div class="user-info" *ngIf="!sidebarCollapsed">
                    <span class="user-name">{{ currentUser.name }}</span>
                    <span class="user-role">{{ currentUser.role | titlecase }}</span>
                  </div>
                  <i class="fas fa-chevron-down" *ngIf="!sidebarCollapsed"></i>
                </div>
                
                <!-- User Dropdown -->
                <div class="user-dropdown" *ngIf="showUserMenu">
                  <div class="user-dropdown-header">
                    <img [src]="currentUser.avatar || defaultAvatar" alt="User" class="user-avatar-large">
                    <div class="user-details">
                      <div class="user-name">{{ currentUser.name }}</div>
                      <div class="user-email">{{ currentUser.email }}</div>
                      <div class="user-role">{{ currentUser.role | titlecase }}</div>
                    </div>
                  </div>
                  
                  <div class="user-dropdown-menu">
                    <a href="#" class="dropdown-item" (click)="showUserPreferences()">
                      <i class="fas fa-user-cog"></i>
                      <span>System Preferences</span>
                    </a>
                    <a href="#" class="dropdown-item">
                      <i class="fas fa-key"></i>
                      <span>Change Password</span>
                    </a>
                    <a href="#" class="dropdown-item">
                      <i class="fas fa-bell"></i>
                      <span>Notification Settings</span>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item">
                      <i class="fas fa-sign-out-alt"></i>
                      <span>Logout</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <!-- User Preferences Modal -->
    <div class="modal-overlay" *ngIf="showPreferencesModal" (click)="closePreferences()">
      <div class="modal modal-large" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>System Preferences</h3>
          <button class="btn btn-outline" (click)="closePreferences()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="preferences-content">
            <div class="preference-section">
              <h4>Appearance</h4>
              <div class="form-group">
                <label class="form-label">Theme</label>
                <select class="form-control" [(ngModel)]="userPreferences.theme">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Language</label>
                <select class="form-control" [(ngModel)]="userPreferences.language">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
            
            <div class="preference-section">
              <h4>Dashboard</h4>
              <div class="form-group">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="userPreferences.showWelcomeMessage">
                  <span>Show welcome message</span>
                </label>
              </div>
              
              <div class="form-group">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="userPreferences.autoRefreshDashboard">
                  <span>Auto-refresh dashboard</span>
                </label>
              </div>
            </div>
            
            <div class="preference-section">
              <h4>Notifications</h4>
              <div class="form-group">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="userPreferences.emailNotifications">
                  <span>Email notifications</span>
                </label>
              </div>
              
              <div class="form-group">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="userPreferences.browserNotifications">
                  <span>Browser notifications</span>
                </label>
              </div>
              
              <div class="form-group">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="userPreferences.soundNotifications">
                  <span>Sound notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-primary" (click)="savePreferences()">
            Save Preferences
          </button>
          <button class="btn btn-outline" (click)="closePreferences()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
      /* Remove or comment out the next line: */
      /* overflow: hidden; */
    }

    .sidebar {
      width: var(--sidebar-width);
      min-width: 70px;
      max-width: 320px;
      resize: horizontal;
      overflow: auto;
      background: var(--sidebar-color, #48536A);
      color: white;
      transition: width 0.3s ease;
      z-index: 1000;
      position: relative;
    }

    .sidebar.collapsed {
      width: 70px;
    }

    .sidebar-header {
      height: var(--header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--spacing-lg);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 20px;
      font-weight: 700;
      color: white;
    }

    .logo i {
      font-size: 24px;
      color: var(--accent-color);
    }

    .sidebar-toggle {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: var(--spacing-xs);
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .sidebar-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .sidebar-nav {
      padding: var(--spacing-lg) 0;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      margin-bottom: var(--spacing-xs);
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: var(--spacing-md) var(--spacing-lg);
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.2s ease;
      gap: var(--spacing-md);
      position: relative;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateX(4px);
    }

    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.15);
      color: white;
      border-right: 3px solid var(--accent-color);
    }

    .nav-link i {
      width: 20px;
      text-align: center;
      font-size: 16px;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .header {
      height: var(--header-height);
      background: var(--header-background, var(--background-card));
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--spacing-lg);
      box-shadow: var(--shadow-light);
      z-index: 999;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .menu-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--spacing-sm);
      border-radius: 4px;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }

    .menu-toggle:hover {
      background-color: var(--background-secondary);
      color: var(--primary-color);
    }

    .page-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }

    .header-right {
      display: flex;
      align-items: center;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    /* Search */
    .search-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 0;
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      transition: width 0.3s ease;
      opacity: 0;
    }

    .search-container.expanded .search-input {
      width: 250px;
      opacity: 1;
    }

    .search-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--spacing-sm);
      border-radius: 50%;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }

    .search-btn:hover {
      background-color: var(--background-secondary);
      color: var(--primary-color);
    }

    .search-results {
      position: absolute;
      top: 100%;
      right: 0;
      width: 300px;
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-medium);
      z-index: 1000;
      max-height: 400px;
      overflow-y: auto;
    }

    .search-section {
      padding: var(--spacing-sm);
      border-bottom: 1px solid var(--border-color);
    }

    .search-section:last-child {
      border-bottom: none;
    }

    .search-section h4 {
      margin: 0 0 var(--spacing-xs) 0;
      font-size: 12px;
      color: var(--text-secondary);
      text-transform: uppercase;
    }

    .search-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-xs) var(--spacing-sm);
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .search-item:hover {
      background-color: var(--background-secondary);
    }

    /* Notifications */
    .notifications-container {
      position: relative;
    }

    .header-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--spacing-sm);
      border-radius: 50%;
      color: var(--text-secondary);
      position: relative;
      transition: all 0.2s ease;
    }

    .header-btn:hover {
      background-color: var(--background-secondary);
      color: var(--primary-color);
    }

    .badge-dot {
      position: absolute;
      top: 4px;
      right: 4px;
      min-width: 16px;
      height: 16px;
      background-color: var(--error-color);
      border-radius: 8px;
      border: 2px solid white;
      font-size: 10px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notifications-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      width: 350px;
      background: var(--background-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-medium);
      z-index: 1000;
      max-height: 400px;
      overflow-y: auto;
    }

    .notifications-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--border-color);
      color: var(--text-primary);
    }

    .notifications-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .notifications-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .notification-item:hover {
      background-color: var(--background-secondary);
    }

    .notification-item.unread {
      background-color: rgba(33, 150, 243, 0.05);
    }

    .notification-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .notification-icon.type-info {
      background-color: rgba(33, 150, 243, 0.1);
      color: var(--info-color);
    }

    .notification-icon.type-warning {
      background-color: rgba(255, 152, 0, 0.1);
      color: var(--warning-color);
    }

    .notification-icon.type-error {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--error-color);
    }

    .notification-icon.type-success {
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--success-color);
    }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      font-weight: 500;
      margin-bottom: 2px;
    }

    .notification-message {
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 2px;
    }

    .notification-time {
      font-size: 11px;
      color: var(--text-secondary);
    }

    .notifications-footer {
      padding: var(--spacing-md);
      text-align: center;
      color: var(--text-secondary);
    }

    /* User Menu */
    .user-menu-container {
      position: relative;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
      padding: var(--spacing-xs);
      border-radius: var(--border-radius);
      transition: background-color 0.2s ease;
    }

    .user-menu:hover {
      background-color: var(--background-secondary);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--border-color);
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      width: 280px;
      background: var(--background-card);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-medium);
      z-index: 1000;
    }

    .user-dropdown-header {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-color);
      color: var(--text-primary);
    }

    .user-avatar-large {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-details {
      flex: 1;
      color: var(--text-primary);
    }

    .user-details .user-name {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .user-details .user-email {
      font-size: 12px;
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .user-details .user-role {
      font-size: 11px;
      color: var(--primary-color);
      text-transform: uppercase;
      font-weight: 500;
    }

    .user-dropdown-menu {
      padding: var(--spacing-sm) 0;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-lg);
      color: var(--text-primary);
      text-decoration: none;
      transition: background-color 0.2s ease;
    }

    .dropdown-item:hover {
      background-color: var(--background-secondary);
    }

    .dropdown-item.active {
      background-color: var(--background-secondary);
    }

    .dropdown-divider {
      height: 1px;
      background-color: var(--border-color);
      margin: var(--spacing-sm) 0;
    }

    .page-content {
      flex: 1;
      overflow: auto;
      padding: var(--spacing-lg);
      background-color: var(--background-secondary);
    }

    /* Modal */
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

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      border-top: 1px solid var(--border-color);
    }

    .preferences-content {
      space-y: var(--spacing-lg);
    }

    .preference-section {
      margin-bottom: var(--spacing-lg);
    }

    .preference-section h4 {
      margin: 0 0 var(--spacing-md) 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .setting-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: -100%;
        height: 100vh;
        z-index: 1001;
      }

      .sidebar.show {
        left: 0;
      }

      .main-content {
        width: 100%;
      }

      .user-info {
        display: none;
      }

      .search-container.expanded .search-input {
        width: 200px;
      }

      .notifications-dropdown,
      .user-dropdown {
        width: 280px;
      }

      .search-results {
        width: 250px;
      }
    }

    .card {
      background: var(--background-card);
      color: var(--text-primary);
    }

    .table {
      background: var(--background-card);
      color: var(--text-primary);
    }

    .table th {
      background: var(--background-secondary);
      color: var(--text-primary);
    }

    .table td {
      color: var(--text-primary);
    }

    .form-label, .stat-label, .customer-since, .orders-label, .no-orders {
      color: var(--text-secondary);
    }

    .notifications-dropdown {
      background: var(--background-card);
      color: var(--text-primary);
    }

    .notifications-header {
      color: var(--text-primary);
    }

    .notifications-list .notification-item {
      background: var(--background-secondary);
      color: var(--text-primary);
    }

    .notifications-list .notification-title {
      color: var(--text-primary);
    }

    .notifications-list .notification-message,
    .notifications-list .notification-time {
      color: var(--text-secondary);
    }

    .btn-outline.btn-sm {
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: var(--background-card);
    }
    .btn-outline.btn-sm:hover {
      background: var(--primary-color);
      color: #fff;
    }
  `]
})
export class LayoutComponent implements OnInit {
  sidebarCollapsed = false;
  currentPageTitle = 'Dashboard';
  searchExpanded = false;
  searchQuery = '';
  searchResults: any = {};
  showNotifications = false;
  showUserMenu = false;
  showPreferencesModal = false;
  
  notifications: Notification[] = [];
  unreadCount = 0;
  currentUser: User = {} as User;
  defaultAvatar = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1';

  userPreferences = {
    theme: 'light',
    language: 'en',
    showWelcomeMessage: true,
    autoRefreshDashboard: false,
    emailNotifications: true,
    browserNotifications: true,
    soundNotifications: false
  };

  menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Sales', route: '/sales', icon: 'fas fa-shopping-cart' },
    { label: 'Inventory', route: '/inventory', icon: 'fas fa-warehouse' },
    { label: 'Products', route: '/products', icon: 'fas fa-box' },
    { label: 'Stock Movement', route: '/stock-movement', icon: 'fas fa-exchange-alt' },
    { label: 'Reports', route: '/reports', icon: 'fas fa-chart-bar' },
    { label: 'Customers', route: '/customers', icon: 'fas fa-users' },
    { label: 'Settings', route: '/settings', icon: 'fas fa-cog' }
  ];

  isDarkTheme = false;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.updatePageTitle();
    this.loadNotifications();
    this.loadCurrentUser();
    
    // Listen for router events to update page title
    this.router.events.subscribe(() => {
      this.updatePageTitle();
    });

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.setDarkTheme();
      this.isDarkTheme = true;
    } else {
      this.setLightTheme();
      this.isDarkTheme = false;
    }
  }

  private loadNotifications() {
    this.dataService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = this.dataService.getUnreadNotificationsCount();
    });
  }

  private loadCurrentUser() {
    this.currentUser = this.dataService.getCurrentUser();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleSearch() {
    this.searchExpanded = !this.searchExpanded;
    if (!this.searchExpanded) {
      this.searchQuery = '';
      this.searchResults = {};
    }
  }

  onSearchBlur() {
    // Delay hiding to allow clicking on results
    setTimeout(() => {
      this.searchExpanded = false;
      this.searchResults = {};
    }, 200);
  }

  performSearch() {
    if (this.searchQuery.length < 2) {
      this.searchResults = {};
      return;
    }

    this.searchResults = {
      products: this.dataService.searchProducts(this.searchQuery),
      customers: this.dataService.searchCustomers(this.searchQuery)
    };
  }

  navigateToProduct(product: any) {
    this.router.navigate(['/products']);
    this.searchExpanded = false;
    this.searchQuery = '';
  }

  navigateToCustomer(customer: any) {
    this.router.navigate(['/customer-profile', customer.id]);
    this.searchExpanded = false;
    this.searchQuery = '';
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  markAsRead(notification: Notification) {
    this.dataService.markNotificationAsRead(notification.id);
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      if (!notification.read) {
        this.dataService.markNotificationAsRead(notification.id);
      }
    });
  }

  showUserPreferences() {
    this.showPreferencesModal = true;
    this.showUserMenu = false;
  }

  closePreferences() {
    this.showPreferencesModal = false;
  }

  savePreferences() {
    // Save user preferences
    console.log('Saving preferences:', this.userPreferences);
    this.showPreferencesModal = false;
  }

  private updatePageTitle() {
    const currentRoute = this.router.url.split('?')[0]; // Remove query params
    const menuItem = this.menuItems.find(item => item.route === currentRoute);
    
    if (currentRoute.includes('/customer-profile/')) {
      this.currentPageTitle = 'Customer Profile';
    } else {
      this.currentPageTitle = menuItem ? menuItem.label : 'Dashboard';
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      this.setDarkTheme();
      localStorage.setItem('theme', 'dark');
    } else {
      this.setLightTheme();
      localStorage.setItem('theme', 'light');
    }
  }

  setDarkTheme() {
    document.body.classList.add('dark-theme');
    document.documentElement.style.setProperty('--background-primary', '#232946');
    document.documentElement.style.setProperty('--background-secondary', '#16161a');
    document.documentElement.style.setProperty('--background-card', '#333d4f');
    document.documentElement.style.setProperty('--text-primary', '#f4f4f4');
    document.documentElement.style.setProperty('--text-secondary', '#bdbdbd');
    document.documentElement.style.setProperty('--sidebar-color', '#202733');
    document.documentElement.style.setProperty('--sidebar-width', '240px'); // was 260px
    document.documentElement.style.setProperty('--header-background', '#607496');
  }

  setLightTheme() {
    document.body.classList.remove('dark-theme');
    document.documentElement.style.setProperty('--background-primary', '#FFFFFF');
    document.documentElement.style.setProperty('--background-secondary', '#F5F5F5');
    document.documentElement.style.setProperty('--background-card', '#FFFFFF');
    document.documentElement.style.setProperty('--text-primary', '#212121');
    document.documentElement.style.setProperty('--text-secondary', '#757575');
    document.documentElement.style.setProperty('--sidebar-color', '#48536A');
    document.documentElement.style.setProperty('--sidebar-width', '240px'); // was 260px
    document.documentElement.style.setProperty('--header-background', '#e6eaf0');
  }
}