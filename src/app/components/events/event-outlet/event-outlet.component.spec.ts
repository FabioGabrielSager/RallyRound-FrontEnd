import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOutletComponent } from './event-outlet.component';

describe('EventOutletComponent', () => {
  let component: EventOutletComponent;
  let fixture: ComponentFixture<EventOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventOutletComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
