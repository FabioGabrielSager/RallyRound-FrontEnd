import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsForActivityStatisticsComponent } from './events-for-activity-statistics.component';

describe('EventsForActivityStatisticsComponent', () => {
  let component: EventsForActivityStatisticsComponent;
  let fixture: ComponentFixture<EventsForActivityStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsForActivityStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventsForActivityStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
