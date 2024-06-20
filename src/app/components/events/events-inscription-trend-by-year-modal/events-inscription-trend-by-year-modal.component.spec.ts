import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsInscriptionTrendByYearModalComponent } from './events-inscription-trend-by-year-modal.component';

describe('EventsInscriptionTrendByYearModalComponent', () => {
  let component: EventsInscriptionTrendByYearModalComponent;
  let fixture: ComponentFixture<EventsInscriptionTrendByYearModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsInscriptionTrendByYearModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventsInscriptionTrendByYearModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
