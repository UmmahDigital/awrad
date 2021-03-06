import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  @Input() status: number;
  @Output() onToggled?= new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }


  toggled() {
    this.onToggled.emit(this.status);
  }

}
