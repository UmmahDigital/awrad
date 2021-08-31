import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProgressComponent } from './group-progress.component';

describe('GroupProgressComponent', () => {
  let component: GroupProgressComponent;
  let fixture: ComponentFixture<GroupProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupProgressComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
