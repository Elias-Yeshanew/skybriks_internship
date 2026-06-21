import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, RouterModule, RouterLink, RouterLinkActive,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatBadgeModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav" fixedInViewport>
        <div class="sidenav-header">
          <mat-icon class="sidenav-logo">build_circle</mat-icon>
          <div>
            <div class="sidenav-title">Garage MS</div>
            <div class="sidenav-user">{{ currentUser?.username }}</div>
          </div>
        </div>

        <mat-nav-list class="nav-list">
          <a mat-list-item *ngFor="let item of navItems"
             [routerLink]="item.route"
             routerLinkActive="active-link"
             [routerLinkActiveOptions]="{exact: item.route === '/'}"
             class="nav-item">
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.label }}</span>
          </a>
        </mat-nav-list>

        <div class="sidenav-footer">
          <button mat-list-item class="logout-btn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <mat-toolbar color="primary" class="toolbar">
          <span class="toolbar-spacer"></span>
          <span class="toolbar-user">
            <mat-icon>account_circle</mat-icon>
            {{ currentUser?.username }} ({{ currentUser?.role }})
          </span>
        </mat-toolbar>

        <div class="content-area">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }

    .sidenav {
      width: 240px;
      background: #1a237e;
      color: white;
      display: flex;
      flex-direction: column;
    }

    .sidenav-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }

    .sidenav-logo {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #ffd740;
    }

    .sidenav-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: white;
    }

    .sidenav-user {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.6);
    }

    .nav-list { flex: 1; padding-top: 8px; }

    .nav-item {
      color: rgba(255,255,255,0.8) !important;
      border-radius: 0 24px 24px 0 !important;
      margin-right: 12px !important;
      margin-bottom: 2px !important;
      transition: background 0.2s !important;
    }

    .nav-item:hover { background: rgba(255,255,255,0.1) !important; color: white !important; }

    .active-link {
      background: rgba(255,255,255,0.2) !important;
      color: white !important;
      font-weight: 600 !important;
    }

    .active-link mat-icon { color: #ffd740 !important; }

    .sidenav-footer {
      padding: 12px;
      border-top: 1px solid rgba(255,255,255,0.15);
    }

    .logout-btn {
      width: 100%;
      color: rgba(255,255,255,0.7);
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: background 0.2s;
    }

    .logout-btn:hover { background: rgba(255,255,255,0.1); color: white; }

    .toolbar {
      background: white !important;
      color: #333 !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      height: 56px;
    }

    .toolbar-spacer { flex: 1; }

    .toolbar-user {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      color: #555;
    }

    .main-content { background: #f0f2f5; }
    .content-area { padding: 24px; min-height: calc(100vh - 56px); }
  `]
})
export class LayoutComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard',        icon: 'dashboard',      route: '/dashboard' },
    { label: 'Customers',        icon: 'people',         route: '/customers' },
    { label: 'Vehicles',         icon: 'directions_car', route: '/vehicles' },
    { label: 'Service Requests', icon: 'build',          route: '/service-requests' },
    { label: 'Mechanics',        icon: 'engineering',    route: '/mechanics' },
    { label: 'Inventory',        icon: 'inventory_2',    route: '/inventory' },
    { label: 'Invoices',         icon: 'receipt_long',   route: '/invoices' },
  ];

  get currentUser() { return this.authService.getCurrentUser(); }

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void { this.authService.logout(); }
}
