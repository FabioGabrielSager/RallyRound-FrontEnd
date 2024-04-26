import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCreatedEventComponent } from './my-created-event.component';

describe('MyCreatedEventComponent', () => {
  let component: MyCreatedEventComponent;
  let fixture: ComponentFixture<MyCreatedEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCreatedEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyCreatedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
