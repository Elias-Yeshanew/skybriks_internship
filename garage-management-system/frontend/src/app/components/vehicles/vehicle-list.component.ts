import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';
import { Vehicle } from '../../models/models';
import { VehicleFormComponent } from './vehicle-form.component';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Vehicles</h2>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Add Vehicle
        </button>
      </div>

      <mat-card>
        <div *ngIf="loading" class="loading-center"><mat-spinner diameter="40"></mat-spinner></div>
        <div class="table-container" *ngIf="!loading">
          <table mat-table [dataSource]="vehicles" style="width:100%">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>#</th>
              <td mat-cell *matCellDef="let v">{{ v.id }}</td>
            </ng-container>
            <ng-container matColumnDef="plate">
              <th mat-header-cell *matHeaderCellDef>License Plate</th>
              <td mat-cell *matCellDef="let v"><strong>{{ v.licensePlate }}</strong></td>
            </ng-container>
            <ng-container matColumnDef="vehicle">
              <th mat-header-cell *matHeaderCellDef>Vehicle</th>
              <td mat-cell *matCellDef="let v">{{ v.year }} {{ v.make }} {{ v.model }}</td>
            </ng-container>
            <ng-container matColumnDef="vin">
              <th mat-header-cell *matHeaderCellDef>VIN</th>
              <td mat-cell *matCellDef="let v">{{ v.vinNumber || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef>Customer</th>
              <td mat-cell *matCellDef="let v">{{ v.customerName }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let v">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" (click)="openForm(v)" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button color="warn" (click)="delete(v)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
                </div>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>
          </table>
          <p *ngIf="vehicles.length === 0" style="text-align:center; padding:32px; color:#999">No vehicles found.</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`.loading-center{display:flex;justify-content:center;padding:40px;} .table-row:hover{background:#f5f5f5;}`]
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = false;
  columns = ['id', 'plate', 'vehicle', 'vin', 'customer', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getVehicles().subscribe({ next: d => { this.vehicles = d; this.loading = false; }, error: () => { this.loading = false; } });
  }

  openForm(vehicle?: Vehicle): void {
    const ref = this.dialog.open(VehicleFormComponent, { width: '540px', data: { vehicle } });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  delete(v: Vehicle): void {
    if (!confirm(`Delete vehicle ${v.licensePlate}?`)) return;
    this.api.deleteVehicle(v.id!).subscribe({
      next: () => { this.snack.open('Vehicle deleted', 'OK', { duration: 3000 }); this.load(); },
      error: err => this.snack.open(err.error?.message || 'Delete failed', 'OK', { duration: 4000 })
    });
  }
}
