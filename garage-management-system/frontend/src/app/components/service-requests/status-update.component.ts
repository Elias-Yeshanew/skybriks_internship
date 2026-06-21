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
import { ServiceRequest } from '../../models/models';

@Component({
  selector: 'app-status-update',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Update Status — Request #{{ data.request.id }}</h2>
    <mat-dialog-content>
      <p style="color:#666; margin-bottom:12px">{{ data.request.description }}</p>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>New Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="PENDING">Pending</mat-option>
            <mat-option value="IN_PROGRESS">In Progress</mat-option>
            <mat-option value="COMPLETED">Completed</mat-option>
            <mat-option value="CANCELLED">Cancelled</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%" *ngIf="form.get('status')?.value === 'COMPLETED'">
          <mat-label>Actual Cost (ETB)</mat-label>
          <input matInput type="number" formControlName="actualCost" min="0">
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Notes</mat-label>
          <textarea matInput formControlName="notes" rows="2"></textarea>
        </mat-form-field>
        <div class="error-message" *ngIf="errorMsg">{{ errorMsg }}</div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="saving">
        <mat-spinner diameter="18" *ngIf="saving"></mat-spinner>
        <span *ngIf="!saving">Update</span>
      </button>
    </mat-dialog-actions>
  `
})
export class StatusUpdateComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder, private api: ApiService,
    private dialogRef: MatDialogRef<StatusUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request: ServiceRequest }
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      status: [this.data.request.status, Validators.required],
      actualCost: [this.data.request.actualCost || null],
      notes: [this.data.request.notes || '']
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true; this.errorMsg = '';
    this.api.updateServiceStatus(this.data.request.id!, this.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => { this.errorMsg = err.error?.message || 'Update failed.'; this.saving = false; }
    });
  }
}
