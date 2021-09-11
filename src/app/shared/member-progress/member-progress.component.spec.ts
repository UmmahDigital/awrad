import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberProgressComponent } from './member-progress.component';

describe('MemberProgressComponent', () => {
  let component: MemberProgressComponent;
  let fixture: ComponentFixture<MemberProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
