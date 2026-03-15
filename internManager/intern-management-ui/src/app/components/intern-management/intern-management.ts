import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Batch } from '../../models/batch.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intern-management',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, CommonModule],
  templateUrl: './intern-management.html',
  styleUrl: './intern-management.css',
})
export class InternManagement implements OnInit {
  internForm!: FormGroup;
  batches: Batch[] = [];
  isEditMode = false;
  internId!: number;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    this.internForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      idCardType: ['Free', Validators.required],
      joiningDate: ['', Validators.required],
      batch: this.fb.group({
        id: [null, Validators.required]
      })
    });

    this.api.getBatches().subscribe(data => this.batches = data);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.internId = +idParam;
      this.api.getInternById(this.internId).subscribe(intern => {
        this.internForm.patchValue({
          name: intern.name,
          email: intern.email,
          phone: intern.phone,
          idCardType: intern.idCardType,
          joiningDate: intern.joiningDate,
          batch: { id: intern.batch?.id }
        });
      });
    }
  }

  onsubmit() {
    if (this.internForm.valid) {
      if (this.isEditMode) {
        this.api.updateIntern(this.internId, this.internForm.value).subscribe(res => {
          alert('Intern Updated Successfully!');
          this.router.navigate(['/interns']);
        });
      } else {
        this.api.registerIntern(this.internForm.value).subscribe(res => {
          alert('Intern Registered! Unique ID: ' + res.internIdStr);
          this.router.navigate(['/interns']);
        });
      }
    }
  }
}
