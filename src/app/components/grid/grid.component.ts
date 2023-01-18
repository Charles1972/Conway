import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ICell} from "../../models/interfaces";

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @Input() onColor: string = 'pink';
  @Input() offColor: string = 'white';
  @Input() cellSize: number = 10;
  @Input() interval: number = 1000;

  @Output() onRunStatusChanged = new EventEmitter<boolean>();

  cells: ICell[][] = [];
  rows: number = 0;
  columns: number = 0;
  drawContext: CanvasRenderingContext2D = null;
  loopId: any = null;
  runStatus: boolean = false;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.setCellsRowsAndColumns();
  }

  setCellsRowsAndColumns() {
    let el = this.el.nativeElement;

    let canvas = <HTMLCanvasElement>document.querySelector('canvas');
    canvas.width = el.offsetWidth;
    canvas.height = el.offsetHeight;
    this.drawContext = canvas.getContext('2d');

    this.rows = Math.floor(el.offsetHeight / this.cellSize);
    this.columns = Math.floor(el.offsetWidth / this.cellSize);

    this.cells = [];
    for(let r = 0; r < this.rows; r++) {
      this.cells.push([]);
      for(let c = 0; c < this.columns; c++) {
        this.cells[r].push({status: false, haveToDie: true});
      }
    }

    console.log(this.rows, this.columns, this.cells)

    this.setCanvas();
  }

  randomizePattern() {
    for(let r = 0; r < this.rows; r++) {
      for(let c = 0; c < this.columns; c++) {
        this.cells[r][c].status = (Math.random() > 0.5);
      }
    }
  }

  startStop(start: boolean = true) {
    if (start && !this.runStatus) {
      this.randomizePattern();
      this.loopId = setInterval(()=> this.updateGrid(), this.interval);
    }
    else {
      clearInterval(this.loopId);
    }

    this.runStatus = !this.runStatus;
    this.onRunStatusChanged.emit(this.runStatus);
  }

  private setCanvas() {

  }

  private updateGrid() {
    this.drawCells();

    this.updateCellsStatus();
  }

  private drawCells() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let color;
        if (this.cells[r][c].status)
          color = this.onColor;
        else
          color = this.offColor;
        this.drawContext.fillStyle = color;
        this.drawContext.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }

  private updateCellsStatus() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.setNewCellStatus(r, c);
      }
    }
  }

  private setNewCellStatus(row: number, col: number) {
    let cell = this.cells[row][col];

  }

  
}
