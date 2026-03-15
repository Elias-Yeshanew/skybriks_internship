import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Intern } from '../../models/intern.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Batch } from '../../models/batch.model';

@Component({
  selector: 'app-intern-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule],
  templateUrl: './intern-list.html',
  styleUrl: './intern-list.css',
})
export class InternList implements OnInit {
  dataSource = new MatTableDataSource<Intern>([]);
  displayedColumns: string[] = ['id', 'internIdStr', 'name', 'email', 'phone', 'idCardType', 'joiningDate', 'batchId', 'actions'];

  filterName: string = '';
  filterBatch: string = '';
  filterType: string = '';
  batches: Batch[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.api.getBatches().subscribe(data => this.batches = data);
    this.loadInterns();
    this.setupFilter();
  }

  loadInterns() {
    this.api.getInterns().subscribe(data => {
      this.dataSource.data = data;
      this.cdr.detectChanges();
    });
  }

  setupFilter() {
    this.dataSource.filterPredicate = (data: Intern, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const matchName = !searchTerms.name || data.name.toLowerCase().includes(searchTerms.name.toLowerCase());
      const matchBatch = !searchTerms.batch || (data.batch && data.batch.id?.toString() === searchTerms.batch);
      const matchType = !searchTerms.type || data.idCardType === searchTerms.type;
      return matchName && matchBatch && matchType;
    };
  }

  applyFilter() {
    const searchTerms = {
      name: this.filterName,
      batch: this.filterBatch,
      type: this.filterType
    };
    this.dataSource.filter = JSON.stringify(searchTerms);
  }

  deleteIntern(id: number) {
    if (confirm('Are you sure you want to delete this intern?')) {
      this.api.deleteIntern(id).subscribe(() => this.loadInterns());
    }
  }

  editIntern(id: number) {
    this.router.navigate(['/edit', id]);
  }
}
