import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsInscriptionTrendByYearComponent } from './events-inscription-trend-by-year.component';

describe('EventsInscriptionTrendByYearComponent', () => {
  let component: EventsInscriptionTrendByYearComponent;
  let fixture: ComponentFixture<EventsInscriptionTrendByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsInscriptionTrendByYearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventsInscriptionTrendByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
