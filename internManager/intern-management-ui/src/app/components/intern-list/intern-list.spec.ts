import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternList } from './intern-list';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('InternList', () => {
  let component: InternList;
  let fixture: ComponentFixture<InternList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternList],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InternList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
