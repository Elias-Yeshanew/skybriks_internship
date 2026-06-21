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
import { Vehicle, Mechanic } from '../../models/models';

@Component({
  selector: 'app-service-request-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>New Service Request</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Vehicle</mat-label>
          <mat-select formControlName="vehicleId">
            <mat-option *ngFor="let v of vehicles" [value]="v.id">
              {{ v.licensePlate }} — {{ v.year }} {{ v.make }} {{ v.model }} ({{ v.customerName }})
            </mat-option>
          </mat-select>
          <mat-error>Required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Assign Mechanic (optional)</mat-label>
          <mat-select formControlName="mechanicId">
            <mat-option [value]="null">Unassigned</mat-option>
            <mat-option *ngFor="let m of mechanics" [value]="m.id">
              {{ m.firstName }} {{ m.lastName }} — {{ m.specialization }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Describe the service needed"></textarea>
          <mat-error>Required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Estimated Cost (ETB)</mat-label>
          <input matInput type="number" formControlName="estimatedCost" min="0">
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Notes (optional)</mat-label>
          <textarea matInput formControlName="notes" rows="2"></textarea>
        </mat-form-field>
        <div class="error-message" *ngIf="errorMsg">{{ errorMsg }}</div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="saving">
        <mat-spinner diameter="18" *ngIf="saving"></mat-spinner>
        <span *ngIf="!saving">Create</span>
      </button>
    </mat-dialog-actions>
  `
})
export class ServiceRequestFormComponent implements OnInit {
  form!: FormGroup;
  vehicles: Vehicle[] = [];
  mechanics: Mechanic[] = [];
  saving = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder, private api: ApiService,
    private dialogRef: MatDialogRef<ServiceRequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      vehicleId: [null, Validators.required],
      mechanicId: [null],
      description: ['', Validators.required],
      estimatedCost: [null],
      notes: ['']
    });
    this.api.getVehicles().subscribe(v => this.vehicles = v);
    this.api.getAvailableMechanics().subscribe(m => this.mechanics = m);
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true; this.errorMsg = '';
    this.api.createServiceRequest(this.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => { this.errorMsg = err.error?.message || 'Save failed.'; this.saving = false; }
    });
  }
}
