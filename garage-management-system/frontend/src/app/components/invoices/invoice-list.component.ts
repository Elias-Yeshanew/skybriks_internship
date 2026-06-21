import { Component, OnInit, Inject } from '@angular/core';
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
import { ApiService } from '../../services/api.service';
import { Invoice, ServiceRequest } from '../../models/models';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Generate Invoice</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Completed Service Request</mat-label>
          <mat-select formControlName="serviceRequestId">
            <mat-option *ngFor="let r of completedRequests" [value]="r.id">
              #{{ r.id }} — {{ r.vehicleInfo }} ({{ r.customerName }})
            </mat-option>
          </mat-select>
          <mat-error>Required</mat-error>
        </mat-form-field>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Labor Cost (ETB)</mat-label>
            <input matInput type="number" formControlName="laborCost" min="0">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Parts Cost (ETB)</mat-label>
            <input matInput type="number" formControlName="partsCost" min="0">
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Notes (optional)</mat-label>
          <textarea matInput formControlName="notes" rows="2"></textarea>
        </mat-form-field>
        <p style="color:#666; font-size:0.85rem">VAT of 15% will be applied automatically.</p>
        <div class="error-message" *ngIf="errorMsg">{{ errorMsg }}</div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="saving">
        <mat-spinner diameter="18" *ngIf="saving"></mat-spinner>
        <span *ngIf="!saving">Generate Invoice</span>
      </button>
    </mat-dialog-actions>
  `
})
export class InvoiceFormComponent implements OnInit {
  form!: FormGroup;
  completedRequests: ServiceRequest[] = [];
  saving = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder, private api: ApiService,
    private dialogRef: MatDialogRef<InvoiceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      serviceRequestId: [null, Validators.required],
      laborCost: [0],
      partsCost: [0],
      notes: ['']
    });
    this.api.getServiceRequests('COMPLETED').subscribe(reqs => this.completedRequests = reqs);
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true; this.errorMsg = '';
    this.api.generateInvoice(this.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => { this.errorMsg = err.error?.message || 'Generate failed.'; this.saving = false; }
    });
  }
}

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Invoices</h2>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Generate Invoice
        </button>
      </div>

      <mat-card>
        <div *ngIf="loading" class="loading-center"><mat-spinner diameter="40"></mat-spinner></div>

        <div class="table-container" *ngIf="!loading">
          <table mat-table [dataSource]="invoices" style="width:100%">
            <ng-container matColumnDef="number">
              <th mat-header-cell *matHeaderCellDef>Invoice #</th>
              <td mat-cell *matCellDef="let i"><strong>{{ i.invoiceNumber }}</strong></td>
            </ng-container>
            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef>Customer</th>
              <td mat-cell *matCellDef="let i">{{ i.customerName }}</td>
            </ng-container>
            <ng-container matColumnDef="vehicle">
              <th mat-header-cell *matHeaderCellDef>Vehicle</th>
              <td mat-cell *matCellDef="let i">{{ i.vehicleInfo }}</td>
            </ng-container>
            <ng-container matColumnDef="service">
              <th mat-header-cell *matHeaderCellDef>Service</th>
              <td mat-cell *matCellDef="let i">{{ i.serviceDescription | slice:0:40 }}{{ (i.serviceDescription?.length || 0) > 40 ? '...' : '' }}</td>
            </ng-container>
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total (ETB)</th>
              <td mat-cell *matCellDef="let i"><strong>{{ i.totalAmount | number:'1.2-2' }}</strong></td>
            </ng-container>
            <ng-container matColumnDef="issueDate">
              <th mat-header-cell *matHeaderCellDef>Issue Date</th>
              <td mat-cell *matCellDef="let i">{{ i.issueDate }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let i">
                <span class="status-badge" [class]="'status-' + i.status">{{ i.status }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let i">
                <div class="action-buttons">
                  <button mat-icon-button color="primary"
                          *ngIf="i.status === 'UNPAID'"
                          (click)="markPaid(i)"
                          matTooltip="Mark as Paid">
                    <mat-icon>payments</mat-icon>
                  </button>
                  <button mat-icon-button (click)="showDetails(i)" matTooltip="Details">
                    <mat-icon>info</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;" class="table-row"></tr>
          </table>
          <p *ngIf="invoices.length === 0" style="text-align:center;padding:32px;color:#999">No invoices yet.</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`.loading-center{display:flex;justify-content:center;padding:40px;} .table-row:hover{background:#f5f5f5;}`]
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  loading = false;
  columns = ['number', 'customer', 'vehicle', 'service', 'total', 'issueDate', 'status', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getInvoices().subscribe({ next: d => { this.invoices = d; this.loading = false; }, error: () => { this.loading = false; } });
  }

  openForm(): void {
    const ref = this.dialog.open(InvoiceFormComponent, { width: '540px', data: {} });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  markPaid(invoice: Invoice): void {
    if (!confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) return;
    this.api.markInvoicePaid(invoice.id!).subscribe({
      next: () => { this.snack.open('Invoice marked as paid', 'OK', { duration: 3000 }); this.load(); },
      error: err => this.snack.open(err.error?.message || 'Update failed', 'OK', { duration: 4000 })
    });
  }

  showDetails(invoice: Invoice): void {
    const msg = `Invoice: ${invoice.invoiceNumber}\nCustomer: ${invoice.customerName} (${invoice.customerPhone})\nVehicle: ${invoice.vehicleInfo}\nLabor: ${invoice.laborCost} ETB\nParts: ${invoice.partsCost} ETB\nVAT: ${invoice.taxAmount} ETB\nTotal: ${invoice.totalAmount} ETB\nDue: ${invoice.dueDate}`;
    alert(msg);
  }
}
