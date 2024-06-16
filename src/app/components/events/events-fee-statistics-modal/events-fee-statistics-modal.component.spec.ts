import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsFeeStatisticsModalComponent } from './events-fee-statistics-modal.component';

describe('EventsFeeStatisticsModalComponent', () => {
  let component: EventsFeeStatisticsModalComponent;
  let fixture: ComponentFixture<EventsFeeStatisticsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsFeeStatisticsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventsFeeStatisticsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
