import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsForActivityStatisticsModalComponent } from './events-for-activity-statistics-modal.component';

describe('EventsForActivityStatisticsModalComponent', () => {
  let component: EventsForActivityStatisticsModalComponent;
  let fixture: ComponentFixture<EventsForActivityStatisticsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsForActivityStatisticsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventsForActivityStatisticsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
