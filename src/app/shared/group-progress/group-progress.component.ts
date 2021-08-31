import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-group-progress',
  templateUrl: './group-progress.component.html',
  styleUrls: ['./group-progress.component.scss']
})
export class GroupProgressComponent implements OnInit {

  @Input() target: number;
  @Input() current: number;


  percent: number = 0;



  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {

    setTimeout(() => {
      this.percent = Math.round(this.current / this.target * 100);

    }, 0);

  }


}
