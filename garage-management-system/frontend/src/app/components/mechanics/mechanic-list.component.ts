import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Mechanic } from '../../models/models';

@Component({
  selector: 'app-mechanic-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Mechanic' : 'Add Mechanic' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName"><mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName"><mat-error>Required</mat-error>
          </mat-form-field>
        </div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone"><mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email"><mat-error>Invalid email</mat-error>
          </mat-form-field>
        </div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Specialization</mat-label>
            <input matInput formControlName="specialization" placeholder="e.g. Engine Repair">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Hourly Rate (ETB)</mat-label>
            <input matInput type="number" formControlName="hourlyRate" min="0">
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" style="width:100%" *ngIf="isEdit">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="AVAILABLE">Available</mat-option>
            <mat-option value="BUSY">Busy</mat-option>
            <mat-option value="ON_LEAVE">On Leave</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="error-message" *ngIf="errorMsg">{{ errorMsg }}</div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="saving">
        <mat-spinner diameter="18" *ngIf="saving"></mat-spinner>
        <span *ngIf="!saving">{{ isEdit ? 'Update' : 'Create' }}</span>
      </button>
    </mat-dialog-actions>
  `
})
export class MechanicFormComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  isEdit = false;

  constructor(
    private fb: FormBuilder, private api: ApiService,
    private dialogRef: MatDialogRef<MechanicFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mechanic?: Mechanic }
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.mechanic;
    const m = this.data?.mechanic;
    this.form = this.fb.group({
      firstName: [m?.firstName || '', Validators.required],
      lastName: [m?.lastName || '', Validators.required],
      phone: [m?.phone || '', Validators.required],
      email: [m?.email || '', Validators.email],
      specialization: [m?.specialization || ''],
      hourlyRate: [m?.hourlyRate || null],
      status: [m?.status || 'AVAILABLE']
    });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true; this.errorMsg = '';
    const req = this.isEdit
      ? this.api.updateMechanic(this.data.mechanic!.id!, this.form.value)
      : this.api.createMechanic(this.form.value);
    req.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => { this.errorMsg = err.error?.message || 'Save failed.'; this.saving = false; }
    });
  }
}

@Component({
  selector: 'app-mechanic-list',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Mechanics</h2>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>person_add</mat-icon> Add Mechanic
        </button>
      </div>
      <mat-card>
        <div *ngIf="loading" class="loading-center"><mat-spinner diameter="40"></mat-spinner></div>
        <div class="table-container" *ngIf="!loading">
          <table mat-table [dataSource]="mechanics" style="width:100%">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let m"><strong>{{ m.firstName }} {{ m.lastName }}</strong></td>
            </ng-container>
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let m">{{ m.phone }}</td>
            </ng-container>
            <ng-container matColumnDef="specialization">
              <th mat-header-cell *matHeaderCellDef>Specialization</th>
              <td mat-cell *matCellDef="let m">{{ m.specialization || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="rate">
              <th mat-header-cell *matHeaderCellDef>Rate (ETB/hr)</th>
              <td mat-cell *matCellDef="let m">{{ m.hourlyRate ? (m.hourlyRate | number:'1.0-0') : '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let m">
                <span class="status-badge" [class]="'status-' + m.status">{{ m.status }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="activeJobs">
              <th mat-header-cell *matHeaderCellDef>Active Jobs</th>
              <td mat-cell *matCellDef="let m">{{ m.activeJobs }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let m">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" (click)="openForm(m)" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button color="warn" (click)="delete(m)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
                </div>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>
          </table>
          <p *ngIf="mechanics.length === 0" style="text-align:center;padding:32px;color:#999">No mechanics found.</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`.loading-center{display:flex;justify-content:center;padding:40px;} .table-row:hover{background:#f5f5f5;}`]
})
export class MechanicListComponent implements OnInit {
  mechanics: Mechanic[] = [];
  loading = false;
  columns = ['name', 'phone', 'specialization', 'rate', 'status', 'activeJobs', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getMechanics().subscribe({ next: d => { this.mechanics = d; this.loading = false; }, error: () => { this.loading = false; } });
  }

  openForm(mechanic?: Mechanic): void {
    const ref = this.dialog.open(MechanicFormComponent, { width: '540px', data: { mechanic } });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  delete(m: Mechanic): void {
    if (!confirm(`Delete mechanic ${m.firstName} ${m.lastName}?`)) return;
    this.api.deleteMechanic(m.id!).subscribe({
      next: () => { this.snack.open('Deleted', 'OK', { duration: 3000 }); this.load(); },
      error: err => this.snack.open(err.error?.message || 'Delete failed', 'OK', { duration: 4000 })
    });
  }
}
