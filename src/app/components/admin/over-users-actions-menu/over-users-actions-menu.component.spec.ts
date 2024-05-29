import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverUsersActionsMenuComponent } from './over-users-actions-menu.component';

describe('OverActionsUsersMenuComponent', () => {
  let component: OverUsersActionsMenuComponent;
  let fixture: ComponentFixture<OverUsersActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverUsersActionsMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverUsersActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
