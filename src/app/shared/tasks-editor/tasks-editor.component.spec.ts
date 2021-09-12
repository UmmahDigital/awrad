import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksEditorComponent } from './tasks-editor.component';

describe('TasksEditorComponent', () => {
  let component: TasksEditorComponent;
  let fixture: ComponentFixture<TasksEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
