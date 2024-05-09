import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledEventComponent } from './enrolled-event.component';

describe('InscriptedEventComponent', () => {
  let component: EnrolledEventComponent;
  let fixture: ComponentFixture<EnrolledEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrolledEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolledEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
