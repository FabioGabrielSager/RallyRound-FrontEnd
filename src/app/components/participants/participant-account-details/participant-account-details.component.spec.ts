import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantAccountDetailsComponent } from './participant-account-details.component';

describe('ParticipantAccountDetailsComponent', () => {
  let component: ParticipantAccountDetailsComponent;
  let fixture: ComponentFixture<ParticipantAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantAccountDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
