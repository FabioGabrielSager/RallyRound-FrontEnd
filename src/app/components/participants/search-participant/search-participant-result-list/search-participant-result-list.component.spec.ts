import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchParticipantResultListComponent } from './search-participant-result-list.component';

describe('SearchParticipantResultListComponent', () => {
  let component: SearchParticipantResultListComponent;
  let fixture: ComponentFixture<SearchParticipantResultListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchParticipantResultListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchParticipantResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
