import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProgressMatrixComponent } from './group-progress-matrix.component';

describe('GroupProgressMatrixComponent', () => {
  let component: GroupProgressMatrixComponent;
  let fixture: ComponentFixture<GroupProgressMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupProgressMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupProgressMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
