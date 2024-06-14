import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchParticipantModalComponent } from './search-participant-modal.component';

describe('SearchParticipantModalComponent', () => {
  let component: SearchParticipantModalComponent;
  let fixture: ComponentFixture<SearchParticipantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchParticipantModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchParticipantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
