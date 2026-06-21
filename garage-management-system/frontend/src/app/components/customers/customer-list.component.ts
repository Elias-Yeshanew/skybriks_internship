import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';
import { Customer } from '../../models/models';
import { CustomerFormComponent } from './customer-form.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDialogModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Customers</h2>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>person_add</mat-icon> Add Customer
        </button>
      </div>

      <mat-card>
        <div class="search-bar" style="padding: 16px 16px 0">
          <mat-form-field appearance="outline" style="flex:1; max-width:400px">
            <mat-label>Search customers</mat-label>
            <input matInput (input)="onSearch($event)" placeholder="Name, phone, email...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <span style="color:#666; font-size:0.9rem">{{ customers.length }} records</span>
        </div>

        <div *ngIf="loading" class="loading-center"><mat-spinner diameter="40"></mat-spinner></div>

        <div class="table-container" *ngIf="!loading">
          <table mat-table [dataSource]="customers" style="width:100%">

            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>#</th>
              <td mat-cell *matCellDef="let c">{{ c.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let c">
                <strong>{{ c.firstName }} {{ c.lastName }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let c">{{ c.phone }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let c">{{ c.email || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="vehicles">
              <th mat-header-cell *matHeaderCellDef>Vehicles</th>
              <td mat-cell *matCellDef="let c">
                <span style="background:#e3f2fd; color:#1565c0; padding:2px 10px; border-radius:12px; font-size:13px">
                  {{ c.vehicleCount || 0 }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let c">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" (click)="openForm(c)" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="delete(c)" matTooltip="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>
          </table>
          <p *ngIf="customers.length === 0" style="text-align:center; padding:32px; color:#999">
            No customers found.
          </p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .loading-center { display:flex; justify-content:center; padding:40px; }
    .table-row:hover { background: #f5f5f5; }
    tr.mat-mdc-row { height: 52px; }
  `]
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  columns = ['id', 'name', 'phone', 'email', 'vehicles', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog, private snack: MatSnackBar) {}

  ngOnInit(): void { this.load(); }

  load(search?: string): void {
    this.loading = true;
    this.api.getCustomers(search).subscribe({
      next: data => { this.customers = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.load(term || undefined);
  }

  openForm(customer?: Customer): void {
    const ref = this.dialog.open(CustomerFormComponent, {
      width: '520px',
      data: { customer }
    });
    ref.afterClosed().subscribe(result => { if (result) this.load(); });
  }

  delete(customer: Customer): void {
    if (!confirm(`Delete ${customer.firstName} ${customer.lastName}?`)) return;
    this.api.deleteCustomer(customer.id!).subscribe({
      next: () => { this.snack.open('Customer deleted', 'OK', { duration: 3000 }); this.load(); },
      error: err => this.snack.open('Delete failed: ' + (err.error?.message || 'error'), 'OK', { duration: 4000 })
    });
  }
}
