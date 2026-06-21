import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-content>
          <div class="logo-area">
            <mat-icon class="logo-icon">build_circle</mat-icon>
            <h1>Garage Management</h1>
            <p class="subtitle">Sign in to your account</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" autocomplete="username">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="form.get('username')?.hasError('required')">Username is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'"
                     formControlName="password" autocomplete="current-password">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMsg">{{ errorMsg }}</div>

            <button mat-raised-button color="primary" type="submit"
                    class="full-width login-btn" [disabled]="loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Sign In</span>
            </button>
          </form>

          <p class="hint">Default: <strong>admin</strong> / <strong>admin123</strong></p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      border-radius: 16px !important;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
      padding: 12px;
    }
    .logo-area {
      text-align: center;
      margin-bottom: 28px;
    }
    .logo-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #1a237e;
    }
    h1 { margin: 8px 0 4px; font-size: 1.6rem; color: #1a237e; }
    .subtitle { color: #666; margin: 0; font-size: 0.9rem; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .login-btn { height: 48px; font-size: 1rem; margin-top: 8px; }
    .error-message { color: #c62828; background: #ffebee; padding: 10px; border-radius: 6px; margin-bottom: 12px; font-size: 0.9rem; }
    .hint { text-align: center; color: #999; font-size: 0.82rem; margin-top: 16px; }
    mat-spinner { display: inline-block; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;
  errorMsg = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.authService.isLoggedIn()) this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    const { username, password } = this.form.value;

    this.authService.login(username, password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMsg = err.status === 401 ? 'Invalid username or password' : 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
