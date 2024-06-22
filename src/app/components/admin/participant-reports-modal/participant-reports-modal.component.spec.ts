import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantReportsModalComponent } from './participant-reports-modal.component';

describe('ParticipantReportsModalComponent', () => {
  let component: ParticipantReportsModalComponent;
  let fixture: ComponentFixture<ParticipantReportsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantReportsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantReportsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
