import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantPublicDataModalComponent } from './participant-public-data-modal.component';

describe('ParticipantPublicDataModalComponent', () => {
  let component: ParticipantPublicDataModalComponent;
  let fixture: ComponentFixture<ParticipantPublicDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantPublicDataModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantPublicDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
