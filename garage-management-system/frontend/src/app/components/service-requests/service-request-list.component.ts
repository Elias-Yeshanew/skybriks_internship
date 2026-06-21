import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ServiceRequest } from '../../models/models';
import { ServiceRequestFormComponent } from './service-request-form.component';
import { StatusUpdateComponent } from './status-update.component';

@Component({
  selector: 'app-service-request-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule,
    MatSelectModule, MatFormFieldModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Service Requests</h2>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> New Request
        </button>
      </div>

      <mat-card>
        <div class="search-bar" style="padding:16px 16px 0">
          <mat-form-field appearance="outline" style="min-width:200px">
            <mat-label>Filter by Status</mat-label>
            <mat-select [(ngModel)]="statusFilter" (ngModelChange)="load()">
              <mat-option value="">All</mat-option>
              <mat-option value="PENDING">Pending</mat-option>
              <mat-option value="IN_PROGRESS">In Progress</mat-option>
              <mat-option value="COMPLETED">Completed</mat-option>
              <mat-option value="CANCELLED">Cancelled</mat-option>
            </mat-select>
          </mat-form-field>
          <span style="color:#666; font-size:0.9rem">{{ requests.length }} records</span>
        </div>

        <div *ngIf="loading" class="loading-center"><mat-spinner diameter="40"></mat-spinner></div>

        <div class="table-container" *ngIf="!loading">
          <table mat-table [dataSource]="requests" style="width:100%">
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
              <td mat-cell *matCellDef="let r" style="max-width:260px">
                {{ r.description | slice:0:60 }}{{ r.description?.length > 60 ? '...' : '' }}
              </td>
            </ng-container>
            <ng-container matColumnDef="mechanic">
              <th mat-header-cell *matHeaderCellDef>Mechanic</th>
              <td mat-cell *matCellDef="let r">{{ r.mechanicName || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let r">
                <span class="status-badge" [class]="'status-' + r.status">{{ r.status }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="cost">
              <th mat-header-cell *matHeaderCellDef>Cost (ETB)</th>
              <td mat-cell *matCellDef="let r">
                {{ r.actualCost ? (r.actualCost | number:'1.2-2') : (r.estimatedCost ? '~' + (r.estimatedCost | number:'1.2-2') : '—') }}
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let r">
                <div class="action-buttons">
                  <button mat-icon-button color="accent" (click)="openStatusUpdate(r)" matTooltip="Update Status">
                    <mat-icon>update</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="delete(r)" matTooltip="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>
          </table>
          <p *ngIf="requests.length === 0" style="text-align:center;padding:32px;color:#999">No service requests found.</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`.loading-center{display:flex;justify-content:center;padding:40px;} .table-row:hover{background:#f5f5f5;}`]
})
export class ServiceRequestListComponent implements OnInit {
  requests: ServiceRequest[] = [];
  loading = false;
  statusFilter = '';
  columns = ['id', 'vehicle', 'customer', 'description', 'mechanic', 'status', 'cost', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getServiceRequests(this.statusFilter || undefined).subscribe({
      next: d => { this.requests = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openForm(): void {
    const ref = this.dialog.open(ServiceRequestFormComponent, { width: '560px', data: {} });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  openStatusUpdate(req: ServiceRequest): void {
    const ref = this.dialog.open(StatusUpdateComponent, { width: '440px', data: { request: req } });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  delete(r: ServiceRequest): void {
    if (!confirm(`Delete service request #${r.id}?`)) return;
    this.api.deleteServiceRequest(r.id!).subscribe({
      next: () => { this.snack.open('Deleted', 'OK', { duration: 3000 }); this.load(); },
      error: err => this.snack.open(err.error?.message || 'Delete failed', 'OK', { duration: 4000 })
    });
  }
}
