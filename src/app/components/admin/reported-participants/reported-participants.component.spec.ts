import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedParticipantsComponent } from './reported-participants.component';

describe('ReportedParticipantsComponent', () => {
  let component: ReportedParticipantsComponent;
  let fixture: ComponentFixture<ReportedParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportedParticipantsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportedParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
