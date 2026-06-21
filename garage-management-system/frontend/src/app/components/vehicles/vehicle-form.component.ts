import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api.service';
import { Customer, Vehicle } from '../../models/models';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Vehicle' : 'Add Vehicle' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>License Plate</mat-label>
            <input matInput formControlName="licensePlate" placeholder="AA-12345">
            <mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Year</mat-label>
            <input matInput type="number" formControlName="year" placeholder="2020">
            <mat-error>1900–2100</mat-error>
          </mat-form-field>
        </div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Make</mat-label>
            <input matInput formControlName="make" placeholder="Toyota">
            <mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Model</mat-label>
            <input matInput formControlName="model" placeholder="Corolla">
            <mat-error>Required</mat-error>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>VIN Number (optional)</mat-label>
          <input matInput formControlName="vinNumber">
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Customer</mat-label>
          <mat-select formControlName="customerId">
            <mat-option *ngFor="let c of customers" [value]="c.id">
              {{ c.firstName }} {{ c.lastName }} — {{ c.phone }}
            </mat-option>
          </mat-select>
          <mat-error>Required</mat-error>
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
export class VehicleFormComponent implements OnInit {
  form!: FormGroup;
  customers: Customer[] = [];
  saving = false;
  errorMsg = '';
  isEdit = false;

  constructor(
    private fb: FormBuilder, private api: ApiService,
    private dialogRef: MatDialogRef<VehicleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle?: Vehicle }
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.vehicle;
    const v = this.data?.vehicle;
    this.form = this.fb.group({
      licensePlate: [v?.licensePlate || '', Validators.required],
      make: [v?.make || '', Validators.required],
      model: [v?.model || '', Validators.required],
      year: [v?.year || new Date().getFullYear(), [Validators.min(1900), Validators.max(2100)]],
      vinNumber: [v?.vinNumber || ''],
      customerId: [v?.customerId || null, Validators.required]
    });
    this.api.getCustomers().subscribe(c => this.customers = c);
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true; this.errorMsg = '';
    const req = this.isEdit
      ? this.api.updateVehicle(this.data.vehicle!.id!, this.form.value)
      : this.api.createVehicle(this.form.value);
    req.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => { this.errorMsg = err.error?.message || 'Save failed.'; this.saving = false; }
    });
  }
}
