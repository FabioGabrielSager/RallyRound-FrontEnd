import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsFeeStatisticsComponent } from './events-fee-statistics.component';

describe('EventsFeeStatisticsComponent', () => {
  let component: EventsFeeStatisticsComponent;
  let fixture: ComponentFixture<EventsFeeStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsFeeStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventsFeeStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
