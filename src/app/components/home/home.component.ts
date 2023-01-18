import {Component, OnInit, ViewChild} from '@angular/core';
import {GridComponent} from "../grid/grid.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  runStatus: boolean = false;

  @ViewChild(GridComponent) grid: GridComponent;

  constructor() {
    console.log('this.runStatus', this.runStatus)
  }

  ngOnInit(): void {
  }

  startStop() {
    this.grid.startStop(!this.runStatus);
  }

  onRunStatusChanged(runStatus: boolean) {
    this.runStatus = runStatus;
    console.log('this.runStatus', this.runStatus)
  }
}

