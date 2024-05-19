import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportParticipantModalComponent } from './report-participant-modal.component';

describe('ReportParticipantModalComponent', () => {
  let component: ReportParticipantModalComponent;
  let fixture: ComponentFixture<ReportParticipantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportParticipantModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportParticipantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
