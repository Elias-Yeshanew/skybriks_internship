import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Batch } from '../../models/batch.model';


@Component({
  selector: 'app-batch-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule],
  templateUrl: './batch-management.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styles: [`
    tr.example-detail-row {
      height: 0;
    }
    tr.example-element-row:not(.example-expanded-row):hover {
      background: var(--surface-hover);
      cursor: pointer;
    }
    tr.example-element-row:not(.example-expanded-row):active {
      background: var(--surface-hover);
    }
    .example-element-row td {
      border-bottom-width: 0;
      border-bottom: none !important;
    }
    .example-element-detail {
      overflow: hidden;
      display: flex;
    }
  `]
})
export class BatchManagement implements OnInit {
  batches: Batch[] = [];
  displayedColumns: string[] = ['id', 'startDate', 'endDate', 'actions'];
  startDate: string = '';
  expandedElement: Batch | null = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() { this.getBatches(); }

  getBatches() {
    this.api.getBatches().subscribe(res => {
      this.batches = res;
      this.cdr.detectChanges();
    });
  }

  createBatch() {
    if (!this.startDate) return;
    this.api.createBatch({ startDate: this.startDate }).subscribe({
      next: () => {
        alert('Batch Created Successfully (End date auto-calculated)');
        this.getBatches(); // Refresh list
      },
      error: (err) => {
        // Show error message from backend
        alert(err.error || 'An error occurred while creating the batch.');
      }
    });
  }

  deleteBatch(id: number, event: Event) {
    event.stopPropagation(); // prevent expanding the row when clicking delete
    if (confirm('Are you sure you want to delete this batch? All interns in this batch will also be deleted.')) {
      this.api.deleteBatch(id).subscribe(() => {
        alert('Batch deleted successfully.');
        this.getBatches();
      });
    }
  }
}