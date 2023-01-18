import {Component, OnInit, ViewChild} from '@angular/core';
import {GridComponent} from "../grid/grid.component";
import {timeInterval} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  runStatus: boolean = false;
  designEnabled: boolean = false;
  timesPerSeconds: number = 4;
  interval = 1000 / this.timesPerSeconds;

  @ViewChild(GridComponent) grid: GridComponent;

  constructor() {
    console.log('this.runStatus', this.runStatus)
  }

  ngOnInit(): void {
  }

  startStop() {
    this.grid.startStop(!this.runStatus);
  }

  clearAll() {
    this.grid.clearAll(true);
  }

  randomize() {
    this.grid.randomizePattern();
  }

  onRunStatusChanged(runStatus: boolean) {
    this.runStatus = runStatus;
    console.log('this.runStatus', this.runStatus)
  }
}

