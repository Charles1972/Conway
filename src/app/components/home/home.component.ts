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
  showGrid: boolean = false;
  timesPerSeconds: number = 4;
  interval = 1000 / this.timesPerSeconds;

  @ViewChild(GridComponent) grid: GridComponent;

  constructor() {
    //
  }

  ngOnInit(): void {
  }

  startStop() {
    this.designEnabled = false;
    this.grid.startStop(!this.runStatus);
  }

  clearAll() {
    this.grid.clearAll(true);
  }

  randomize() {
    this.grid.randomizePattern();
  }

  onIntervalChanged(v: any) {
    this.timesPerSeconds = v.target.value;
    this.interval = 1000 / this.timesPerSeconds;
  }

  onRunStatusChanged(runStatus: boolean) {
    this.runStatus = runStatus;
  }
}

