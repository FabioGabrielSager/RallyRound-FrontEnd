import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedEventsInscriptionTrendStatsComponent } from './created-events-inscription-trend-stats.component';

describe('CreatedEventsInscriptionTrendStatsComponent', () => {
  let component: CreatedEventsInscriptionTrendStatsComponent;
  let fixture: ComponentFixture<CreatedEventsInscriptionTrendStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedEventsInscriptionTrendStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatedEventsInscriptionTrendStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
