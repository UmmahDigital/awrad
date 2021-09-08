import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksComposerComponent } from './tasks-composer.component';

describe('TasksComposerComponent', () => {
  let component: TasksComposerComponent;
  let fixture: ComponentFixture<TasksComposerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksComposerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
