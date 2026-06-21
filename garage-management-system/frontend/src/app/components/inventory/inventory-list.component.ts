import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';
import { InventoryItem } from '../../models/models';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Item' : 'Add Item' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <div class="form-row">
          <mat-form-field appearance="outline" style="flex:2">
            <mat-label>Item Name</mat-label>
            <input matInput formControlName="name"><mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category">
              <mat-option value="PARTS">Parts</mat-option>
              <mat-option value="FLUIDS">Fluids</mat-option>
              <mat-option value="TOOLS">Tools</mat-option>
              <mat-option value="OTHER">Other</mat-option>
            </mat-select>
            <mat-error>Required</mat-error>
          </mat-form-field>
        </div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Quantity</mat-label>
            <input matInput type="number" formControlName="quantity" min="0"><mat-error>Required (≥0)</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Min Quantity</mat-label>
            <input matInput type="number" formControlName="minQuantity" min="0"><mat-error>Required (≥0)</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Unit Price (ETB)</mat-label>
            <input matInput type="number" formControlName="unitPrice" min="0">
          </mat-form-field>
        </div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Supplier</mat-label>
            <input matInput formControlName="supplier">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>SKU</mat-label>
            <input matInput formControlName="sku">
          </mat-form-field>
        </div>
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
export class InventoryFormComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  isEdit = false;

  constructor(
    private fb: FormBuilder, private api: ApiService,
    private dialogRef: MatDialogRef<InventoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item?: InventoryItem }
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.item;
    const i = this.data?.item;
    this.form = this.fb.group({
      name: [i?.name || '', Validators.required],
      category: [i?.category || 'PARTS', Validators.required],
      quantity: [i?.quantity ?? 0, [Validators.required, Validators.min(0)]],
      minQuantity: [i?.minQuantity ?? 5, [Validators.required, Validators.min(0)]],
      unitPrice: [i?.unitPrice || null],
      supplier: [i?.supplier || ''],
      sku: [i?.sku || '']
    });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true; this.errorMsg = '';
    const req = this.isEdit
      ? this.api.updateInventoryItem(this.data.item!.id!, this.form.value)
      : this.api.createInventoryItem(this.form.value);
    req.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => { this.errorMsg = err.error?.message || 'Save failed.'; this.saving = false; }
    });
  }
}

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Inventory</h2>
        <div style="display:flex; gap:8px">
          <button mat-stroked-button color="warn" (click)="loadLowStock()">
            <mat-icon>warning</mat-icon> Low Stock
          </button>
          <button mat-raised-button color="primary" (click)="openForm()">
            <mat-icon>add</mat-icon> Add Item
          </button>
        </div>
      </div>

      <mat-card>
        <div class="search-bar" style="padding:16px 16px 0">
          <mat-form-field appearance="outline" style="flex:1;max-width:340px">
            <mat-label>Search items</mat-label>
            <input matInput (input)="onSearch($event)" placeholder="Name or supplier...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" style="min-width:160px">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="categoryFilter" (ngModelChange)="load()">
              <mat-option value="">All</mat-option>
              <mat-option value="PARTS">Parts</mat-option>
              <mat-option value="FLUIDS">Fluids</mat-option>
              <mat-option value="TOOLS">Tools</mat-option>
              <mat-option value="OTHER">Other</mat-option>
            </mat-select>
          </mat-form-field>
          <span style="color:#666;font-size:0.9rem">{{ items.length }} items</span>
        </div>

        <div *ngIf="loading" class="loading-center"><mat-spinner diameter="40"></mat-spinner></div>

        <div class="table-container" *ngIf="!loading">
          <table mat-table [dataSource]="items" style="width:100%">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Item</th>
              <td mat-cell *matCellDef="let i">
                <strong>{{ i.name }}</strong>
                <span class="low-stock-badge" *ngIf="i.lowStock" style="margin-left:6px">Low Stock</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let i">{{ i.category }}</td>
            </ng-container>
            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Qty</th>
              <td mat-cell *matCellDef="let i" [style.color]="i.lowStock ? '#c62828' : 'inherit'" [style.fontWeight]="i.lowStock ? '700' : 'normal'">
                {{ i.quantity }} / {{ i.minQuantity }}
              </td>
            </ng-container>
            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Unit Price (ETB)</th>
              <td mat-cell *matCellDef="let i">{{ i.unitPrice ? (i.unitPrice | number:'1.2-2') : '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="supplier">
              <th mat-header-cell *matHeaderCellDef>Supplier</th>
              <td mat-cell *matCellDef="let i">{{ i.supplier || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="sku">
              <th mat-header-cell *matHeaderCellDef>SKU</th>
              <td mat-cell *matCellDef="let i">{{ i.sku || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let i">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" (click)="adjust(i, 1)" matTooltip="Add 1"><mat-icon>add</mat-icon></button>
                  <button mat-icon-button (click)="adjust(i, -1)" matTooltip="Remove 1" [disabled]="i.quantity === 0"><mat-icon>remove</mat-icon></button>
                  <button mat-icon-button color="primary" (click)="openForm(i)" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button color="warn" (click)="delete(i)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
                </div>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;" class="table-row" [class.low-stock-row]="row.lowStock"></tr>
          </table>
          <p *ngIf="items.length === 0" style="text-align:center;padding:32px;color:#999">No items found.</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `.loading-center{display:flex;justify-content:center;padding:40px;}`,
    `.table-row:hover{background:#f5f5f5;}`,
    `.low-stock-row{background:#fff8f8!important;}`
  ]
})
export class InventoryListComponent implements OnInit {
  items: InventoryItem[] = [];
  loading = false;
  categoryFilter = '';
  columns = ['name', 'category', 'quantity', 'price', 'supplier', 'sku', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }

  load(search?: string): void {
    this.loading = true;
    this.api.getInventory(search, this.categoryFilter || undefined).subscribe({
      next: d => { this.items = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadLowStock(): void {
    this.loading = true;
    this.api.getLowStock().subscribe({ next: d => { this.items = d; this.loading = false; }, error: () => { this.loading = false; } });
  }

  onSearch(e: Event): void { this.load((e.target as HTMLInputElement).value || undefined); }

  openForm(item?: InventoryItem): void {
    const ref = this.dialog.open(InventoryFormComponent, { width: '560px', data: { item } });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  adjust(item: InventoryItem, delta: number): void {
    this.api.adjustInventory(item.id!, delta).subscribe({
      next: updated => { const idx = this.items.findIndex(i => i.id === item.id); if (idx > -1) this.items[idx] = updated; this.items = [...this.items]; },
      error: err => this.snack.open(err.error?.message || 'Adjust failed', 'OK', { duration: 3000 })
    });
  }

  delete(item: InventoryItem): void {
    if (!confirm(`Delete "${item.name}"?`)) return;
    this.api.deleteInventoryItem(item.id!).subscribe({
      next: () => { this.snack.open('Deleted', 'OK', { duration: 3000 }); this.load(); },
      error: err => this.snack.open(err.error?.message || 'Delete failed', 'OK', { duration: 4000 })
    });
  }
}
