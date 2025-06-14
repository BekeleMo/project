import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, User, SystemSettings } from '../../services/data.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">
      <div class="page-header">
        <h2>Settings</h2>
      </div>
      
      <div class="settings-tabs">
        <button class="tab-btn" 
                [class.active]="activeTab === 'users'"
                (click)="activeTab = 'users'">
          <i class="fas fa-users"></i>
          User Management
        </button>
        <button class="tab-btn" 
                [class.active]="activeTab === 'notifications'"
                (click)="activeTab = 'notifications'">
          <i class="fas fa-bell"></i>
          Notifications
        </button>
        <button class="tab-btn" 
                [class.active]="activeTab === 'system'"
                (click)="activeTab = 'system'">
          <i class="fas fa-cog"></i>
          System
        </button>
        <button class="tab-btn" 
                [class.active]="activeTab === 'security'"
                (click)="activeTab = 'security'">
          <i class="fas fa-shield-alt"></i>
          Security
        </button>
      </div>

      <!-- User Management Tab -->
      <div class="tab-content" *ngIf="activeTab === 'users'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">User Management</h3>
            <button class="btn btn-primary" (click)="showAddUserForm = true">
              <i class="fas fa-user-plus"></i>
              Add User
            </button>
          </div>

          <!-- Add User Form -->
          <div class="user-form" *ngIf="showAddUserForm || editingUser">
            <h4>{{ editingUser ? 'Edit User' : 'Add New User' }}</h4>
            <form (ngSubmit)="saveUser()" class="form-grid">
              <div class="form-group">
                <label class="form-label">Name *</label>
                <input type="text" class="form-control" [(ngModel)]="userForm.name" name="name" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input type="email" class="form-control" [(ngModel)]="userForm.email" name="email" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Role *</label>
                <select class="form-control" [(ngModel)]="userForm.role" name="role" required>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Status</label>
                <select class="form-control" [(ngModel)]="userForm.status" name="status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div class="form-group full-width">
                <label class="form-label">Permissions</label>
                <div class="permissions-grid">
                  <label class="permission-item" *ngFor="let permission of availablePermissions">
                    <input type="checkbox" 
                           [checked]="userForm.permissions.includes(permission.key)"
                           (change)="togglePermission(permission.key)">
                    <span>{{ permission.label }}</span>
                  </label>
                </div>
              </div>
              
              <div class="form-actions full-width">
                <button type="submit" class="btn btn-primary">
                  {{ editingUser ? 'Update User' : 'Add User' }}
                </button>
                <button type="button" class="btn btn-outline" (click)="cancelUserForm()">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Users Table -->
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td>
                    <div class="user-info">
                      <div class="user-name">{{ user.name }}</div>
                      <div class="user-email">{{ user.email }}</div>
                    </div>
                  </td>
                  <td>
                    <span class="role-badge" [class]="'role-' + user.role">
                      {{ user.role | titlecase }}
                    </span>
                  </td>
                  <td>
                    <div class="permissions-list">
                      <span class="permission-tag" *ngFor="let permission of user.permissions.slice(0, 3)">
                        {{ getPermissionLabel(permission) }}
                      </span>
                      <span class="more-permissions" *ngIf="user.permissions.length > 3">
                        +{{ user.permissions.length - 3 }} more
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="last-login" *ngIf="user.lastLogin">
                      {{ user.lastLogin | date:'short' }}
                    </div>
                    <div class="never-logged" *ngIf="!user.lastLogin">
                      Never
                    </div>
                  </td>
                  <td>
                    <span class="badge" 
                          [class.badge-success]="user.status === 'active'"
                          [class.badge-warning]="user.status === 'inactive'">
                      {{ user.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-outline btn-sm" (click)="editUser(user)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-error btn-sm" (click)="deleteUser(user)" 
                              *ngIf="user.role !== 'admin'">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div class="tab-content" *ngIf="activeTab === 'notifications'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Notification Settings</h3>
          </div>
          
          <div class="notification-settings">
            <div class="setting-group">
              <h4>Email Notifications</h4>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="settings.emailNotifications">
                  <span>Enable email notifications</span>
                </label>
              </div>
            </div>
            
            <div class="setting-group">
              <h4>SMS Notifications</h4>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="settings.smsNotifications">
                  <span>Enable SMS notifications</span>
                </label>
              </div>
            </div>
            
            <div class="setting-group">
              <h4>Low Stock Alerts</h4>
              <div class="setting-item">
                <label class="form-label">Threshold</label>
                <input type="number" class="form-control" [(ngModel)]="settings.lowStockThreshold" min="1">
              </div>
            </div>
            
            <div class="setting-group">
              <h4>Auto Reorder</h4>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" [(ngModel)]="settings.autoReorderEnabled">
                  <span>Enable automatic reordering</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Tab -->
      <div class="tab-content" *ngIf="activeTab === 'system'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">System Preferences</h3>
          </div>
          
          <div class="system-settings">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Company Name</label>
                <input type="text" class="form-control" [(ngModel)]="settings.companyName">
              </div>
              
              <div class="form-group">
                <label class="form-label">Currency</label>
                <select class="form-control" [(ngModel)]="settings.currency">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Tax Rate (%)</label>
                <input type="number" class="form-control" [(ngModel)]="settings.taxRate" step="0.1" min="0" max="100">
              </div>
              
              <div class="form-group">
                <label class="form-label">Language</label>
                <select class="form-control" [(ngModel)]="settings.language">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Theme</label>
                <select class="form-control" [(ngModel)]="settings.theme">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Tab -->
      <div class="tab-content" *ngIf="activeTab === 'security'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Security Settings</h3>
          </div>
          
          <div class="security-settings">
            <div class="setting-group">
              <h4>Password Policy</h4>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" checked disabled>
                  <span>Minimum 8 characters</span>
                </label>
              </div>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" checked disabled>
                  <span>Require uppercase and lowercase letters</span>
                </label>
              </div>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox" checked disabled>
                  <span>Require numbers</span>
                </label>
              </div>
            </div>
            
            <div class="setting-group">
              <h4>Session Management</h4>
              <div class="setting-item">
                <label class="form-label">Session Timeout (minutes)</label>
                <input type="number" class="form-control" value="30" min="5" max="480">
              </div>
            </div>
            
            <div class="setting-group">
              <h4>Two-Factor Authentication</h4>
              <div class="setting-item">
                <label class="setting-label">
                  <input type="checkbox">
                  <span>Enable 2FA for all users</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="settings-actions">
        <button class="btn btn-primary" (click)="saveSettings()">
          <i class="fas fa-save"></i>
          Save Settings
        </button>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--spacing-lg);
    }

    .page-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .settings-tabs {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      border-bottom: 1px solid var(--border-color);
    }

    .tab-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-md) var(--spacing-lg);
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--text-secondary);
    }

    .tab-btn:hover {
      color: var(--primary-color);
    }

    .tab-btn.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .tab-content {
      margin-bottom: var(--spacing-lg);
    }

    .user-form {
      background-color: var(--background-secondary);
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      margin-bottom: var(--spacing-lg);
    }

    .user-form h4 {
      margin: 0 0 var(--spacing-lg) 0;
      font-size: 16px;
      font-weight: 600;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-md);
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .permissions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-sm);
    }

    .permission-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      cursor: pointer;
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

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
    }

    .user-email {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .role-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .role-admin {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--error-color);
    }

    .role-manager {
      background-color: rgba(255, 152, 0, 0.1);
      color: var(--warning-color);
    }

    .role-staff {
      background-color: rgba(33, 150, 243, 0.1);
      color: var(--info-color);
    }

    .permissions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .permission-tag {
      background-color: var(--background-secondary);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      color: var(--text-secondary);
    }

    .more-permissions {
      font-size: 10px;
      color: var(--text-secondary);
      font-style: italic;
    }

    .last-login {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .never-logged {
      font-size: 12px;
      color: var(--text-secondary);
      font-style: italic;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .notification-settings,
    .system-settings,
    .security-settings {
      space-y: var(--spacing-lg);
    }

    .setting-group {
      margin-bottom: var(--spacing-lg);
    }

    .setting-group h4 {
      margin: 0 0 var(--spacing-md) 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .setting-item {
      margin-bottom: var(--spacing-md);
    }

    .setting-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      cursor: pointer;
    }

    .settings-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: var(--spacing-xl);
    }

    @media (max-width: 768px) {
      .settings-tabs {
        flex-direction: column;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .permissions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  activeTab = 'users';
  users: User[] = [];
  settings: SystemSettings = {} as SystemSettings;
  showAddUserForm = false;
  editingUser: User | null = null;

  userForm: any = {
    name: '',
    email: '',
    role: 'staff',
    status: 'active',
    permissions: []
  };

  availablePermissions = [
    { key: 'products', label: 'Product Management' },
    { key: 'inventory', label: 'Inventory Management' },
    { key: 'sales', label: 'Sales Management' },
    { key: 'customers', label: 'Customer Management' },
    { key: 'reports', label: 'Reports & Analytics' },
    { key: 'users', label: 'User Management' },
    { key: 'settings', label: 'System Settings' },
    { key: 'all', label: 'All Permissions' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getUsers().subscribe(users => {
      this.users = users;
    });

    this.dataService.getSettings().subscribe(settings => {
      this.settings = settings;
    });
  }

  editUser(user: User) {
    this.editingUser = user;
    this.userForm = { ...user };
    this.showAddUserForm = false;
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete "${user.name}"?`)) {
      // Implementation for deleting user
      console.log('Delete user:', user);
    }
  }

  saveUser() {
    if (this.editingUser) {
      this.dataService.updateUser(this.editingUser.id, this.userForm);
    } else {
      this.dataService.addUser(this.userForm);
    }
    
    this.cancelUserForm();
  }

  cancelUserForm() {
    this.showAddUserForm = false;
    this.editingUser = null;
    this.userForm = {
      name: '',
      email: '',
      role: 'staff',
      status: 'active',
      permissions: []
    };
  }

  togglePermission(permission: string) {
    const index = this.userForm.permissions.indexOf(permission);
    if (index > -1) {
      this.userForm.permissions.splice(index, 1);
    } else {
      this.userForm.permissions.push(permission);
    }
  }

  getPermissionLabel(key: string): string {
    const permission = this.availablePermissions.find(p => p.key === key);
    return permission ? permission.label : key;
  }

  saveSettings() {
    this.dataService.updateSettings(this.settings);
    // Show success message
    console.log('Settings saved successfully');
  }
}