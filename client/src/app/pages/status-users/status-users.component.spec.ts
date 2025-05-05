import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusUsersComponent } from './status-users.component';

describe('StatusUsersComponent', () => {
  let component: StatusUsersComponent;
  let fixture: ComponentFixture<StatusUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
