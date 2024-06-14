import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteParticipantModalComponent } from './invite-participant-modal.component';

describe('ParticipantPublicDataModalComponent', () => {
  let component: InviteParticipantModalComponent;
  let fixture: ComponentFixture<InviteParticipantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteParticipantModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteParticipantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
