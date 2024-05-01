import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsPublicComponentComponent } from './event-details-public-component.component';

describe('EventDetailsPublicComponentComponent', () => {
  let component: EventDetailsPublicComponentComponent;
  let fixture: ComponentFixture<EventDetailsPublicComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsPublicComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventDetailsPublicComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
