import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { Customer } from '../../models/models';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Customer' : 'New Customer' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName">
            <mat-error>Required (min 2 chars)</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName">
            <mat-error>Required</mat-error>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone" placeholder="e.g. 0911234567">
          <mat-error>Valid phone number required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Email (optional)</mat-label>
          <input matInput formControlName="email" type="email">
          <mat-error>Invalid email format</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Address (optional)</mat-label>
          <textarea matInput formControlName="address" rows="2"></textarea>
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
export class CustomerFormComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer?: Customer }
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.customer;
    const c = this.data?.customer;
    this.form = this.fb.group({
      firstName: [c?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName:  [c?.lastName  || '', Validators.required],
      phone:     [c?.phone     || '', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,20}$/)]],
      email:     [c?.email     || '', Validators.email],
      address:   [c?.address   || '']
    });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.errorMsg = '';
    const payload = this.form.value as Customer;
    const req = this.isEdit
      ? this.api.updateCustomer(this.data.customer!.id!, payload)
      : this.api.createCustomer(payload);

    req.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => {
        this.errorMsg = err.error?.message || 'Save failed.';
        this.saving = false;
      }
    });
  }
}
