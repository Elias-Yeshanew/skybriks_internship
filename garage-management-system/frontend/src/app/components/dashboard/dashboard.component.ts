import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';
import { DashboardStats, ServiceRequest } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule,
    MatTableModule, MatProgressSpinnerModule, MatChipsModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Dashboard</h2>
        <button mat-stroked-button (click)="load()">
          <mat-icon>refresh</mat-icon> Refresh
        </button>
      </div>

      <div *ngIf="loading" class="loading-center">
        <mat-spinner></mat-spinner>
      </div>

      <ng-container *ngIf="!loading && stats">
        <!-- Stat Cards -->
        <div class="stats-grid">
          <mat-card class="stat-card" [routerLink]="'/customers'">
            <mat-icon style="color:#1a237e">people</mat-icon>
            <span class="stat-value">{{ stats.totalCustomers }}</span>
            <span class="stat-label">Total Customers</span>
          </mat-card>
          <mat-card class="stat-card" [routerLink]="'/vehicles'">
            <mat-icon style="color:#283593">directions_car</mat-icon>
            <span class="stat-value">{{ stats.totalVehicles }}</span>
            <span class="stat-label">Total Vehicles</span>
          </mat-card>
          <mat-card class="stat-card" [routerLink]="'/service-requests'">
            <mat-icon style="color:#f57c00">pending</mat-icon>
            <span class="stat-value">{{ stats.pendingRequests }}</span>
            <span class="stat-label">Pending Requests</span>
          </mat-card>
          <mat-card class="stat-card" [routerLink]="'/service-requests'">
            <mat-icon style="color:#0288d1">build</mat-icon>
            <span class="stat-value">{{ stats.inProgressRequests }}</span>
            <span class="stat-label">In Progress</span>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon style="color:#388e3c">check_circle</mat-icon>
            <span class="stat-value">{{ stats.completedThisMonth }}</span>
            <span class="stat-label">Completed This Month</span>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon style="color:#1a237e">payments</mat-icon>
            <span class="stat-value">{{ stats.revenueThisMonth | number:'1.0-0' }} ETB</span>
            <span class="stat-label">Revenue This Month</span>
          </mat-card>
          <mat-card class="stat-card" [routerLink]="'/inventory'" style="cursor:pointer">
            <mat-icon style="color:#c62828">warning</mat-icon>
            <span class="stat-value">{{ stats.lowStockItems }}</span>
            <span class="stat-label">Low Stock Items</span>
          </mat-card>
        </div>

        <!-- Monthly Revenue Chart (simple bar) -->
        <mat-card style="margin-bottom: 24px; padding: 20px;">
          <h3 style="margin:0 0 16px">Monthly Revenue (ETB)</h3>
          <div class="chart-bars" *ngIf="stats.monthlyRevenue?.length; else noRevenue">
            <div *ngFor="let m of stats.monthlyRevenue" class="bar-item">
              <div class="bar-fill"
                   [style.height]="getBarHeight(m.revenue) + 'px'"
                   [matTooltip]="m.month + ': ' + (m.revenue | number:'1.0-0') + ' ETB'">
              </div>
              <div class="bar-label">{{ m.month.slice(0,3) }}</div>
            </div>
          </div>
          <ng-template #noRevenue>
            <p style="color:#999; text-align:center">No revenue data for this year yet.</p>
          </ng-template>
        </mat-card>

        <!-- Recent Service Requests -->
        <mat-card>
          <div style="padding: 16px 16px 0; display:flex; justify-content:space-between; align-items:center">
            <h3 style="margin:0">Recent Service Requests</h3>
            <a mat-button color="primary" routerLink="/service-requests">View All</a>
          </div>
          <div class="table-container">
            <table mat-table [dataSource]="stats.recentRequests" style="width:100%">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>#</th>
                <td mat-cell *matCellDef="let r">{{ r.id }}</td>
              </ng-container>
              <ng-container matColumnDef="vehicle">
                <th mat-header-cell *matHeaderCellDef>Vehicle</th>
                <td mat-cell *matCellDef="let r">{{ r.vehicleInfo }}</td>
              </ng-container>
              <ng-container matColumnDef="customer">
                <th mat-header-cell *matHeaderCellDef>Customer</th>
                <td mat-cell *matCellDef="let r">{{ r.customerName }}</td>
              </ng-container>
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let r">{{ r.description | slice:0:40 }}{{ r.description?.length > 40 ? '...' : '' }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let r">
                  <span class="status-badge" [class]="'status-' + r.status">{{ r.status }}</span>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="recentCols"></tr>
              <tr mat-row *matRowDef="let row; columns: recentCols;"></tr>
            </table>
          </div>
        </mat-card>
      </ng-container>
    </div>
  `,
  styles: [`
    .loading-center { display:flex; justify-content:center; padding:60px; }
    .chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      height: 120px;
      padding: 0 8px;
    }
    .bar-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .bar-fill {
      width: 100%;
      background: linear-gradient(180deg, #3949ab, #1a237e);
      border-radius: 4px 4px 0 0;
      min-height: 4px;
      transition: height 0.5s;
      cursor: pointer;
    }
    .bar-label { font-size: 11px; color: #666; }
    mat-card.stat-card { cursor: pointer; transition: box-shadow 0.2s; }
    mat-card.stat-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = false;
  recentCols = ['id', 'vehicle', 'customer', 'description', 'status'];

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getDashboardStats().subscribe({
      next: s => { this.stats = s; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getBarHeight(revenue: number): number {
    if (!this.stats?.monthlyRevenue?.length) return 4;
    const max = Math.max(...this.stats.monthlyRevenue.map(m => m.revenue));
    return max > 0 ? Math.max(4, (revenue / max) * 100) : 4;
  }
}
