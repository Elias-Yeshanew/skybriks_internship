import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternManagement } from './intern-management';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('InternManagement', () => {
  let component: InternManagement;
  let fixture: ComponentFixture<InternManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternManagement, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InternManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
