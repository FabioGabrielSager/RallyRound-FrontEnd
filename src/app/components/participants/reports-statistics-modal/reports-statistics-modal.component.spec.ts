import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsStatisticsModalComponent } from './reports-statistics-modal.component';

describe('ReportsStatisticsModalComponent', () => {
  let component: ReportsStatisticsModalComponent;
  let fixture: ComponentFixture<ReportsStatisticsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsStatisticsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsStatisticsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
