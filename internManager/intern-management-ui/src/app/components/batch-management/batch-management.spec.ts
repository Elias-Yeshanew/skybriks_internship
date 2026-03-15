import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchManagement } from './batch-management';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BatchManagement', () => {
  let component: BatchManagement;
  let fixture: ComponentFixture<BatchManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchManagement, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BatchManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
