import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopEventCreatorsModalComponent } from './top-event-creators-modal.component';

describe('TopEventCreatorsModalComponent', () => {
  let component: TopEventCreatorsModalComponent;
  let fixture: ComponentFixture<TopEventCreatorsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopEventCreatorsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopEventCreatorsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
