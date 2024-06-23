import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsStatisticsComponent } from './reports-statistics.component';

describe('ReportsStatisticsComponent', () => {
  let component: ReportsStatisticsComponent;
  let fixture: ComponentFixture<ReportsStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
