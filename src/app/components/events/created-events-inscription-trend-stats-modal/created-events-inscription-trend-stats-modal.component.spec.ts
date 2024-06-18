import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedEventsInscriptionTrendStatsModalComponent } from './created-events-inscription-trend-stats-modal.component';

describe('CreatedEventsInscriptionTrendStatsModalComponent', () => {
  let component: CreatedEventsInscriptionTrendStatsModalComponent;
  let fixture: ComponentFixture<CreatedEventsInscriptionTrendStatsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedEventsInscriptionTrendStatsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatedEventsInscriptionTrendStatsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
