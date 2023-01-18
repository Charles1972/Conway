import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {ICell} from "../../models/interfaces";

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @Input() interval: number = 300;
  @Input() designEnabled: boolean = false;

  @Output() onRunStatusChanged = new EventEmitter<boolean>();

  cellSize: number = 10;
  onColor: string = 'red';
  offColor: string = 'whitesmoke';
  cells: ICell[][] = [];
  cellsCopy: ICell[][] = [];
  rows: number = 0;
  columns: number = 0;

  drawContext: CanvasRenderingContext2D = null;

  loopId: any = null;
  runStatus: boolean = false;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.setStyles();
    this.initGrid();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.initGrid();
  }

  setCellsRowsAndColumns() {
    let el = this.el.nativeElement;
    let canvas = <HTMLCanvasElement>document.querySelector('canvas');

    canvas.width = el.offsetWidth;
    canvas.height = el.offsetHeight;
    this.drawContext = canvas.getContext('2d');

    this.rows = Math.floor(el.offsetHeight / this.cellSize);
    this.columns = Math.floor(el.offsetWidth / this.cellSize);

    this.clearAll();
  }

  randomizePattern() {
    for(let r = 0; r < this.rows; r++) {
      for(let c = 0; c < this.columns; c++) {
        this.cells[r][c].status = (Math.random() < 0.1);
      }
    }

    // this.cells[3][4].status = true;
    // this.cells[3][5].status = true;
    // this.cells[3][6].status = true;
    //
    // this.cells[5][3].status = true;
    // this.cells[5][4].status = true;
    // this.cells[5][5].status = true;

    this.drawCells();
  }

  startStop(start: boolean = true) {
    if (start && !this.runStatus) {
      this.loopId = setInterval(()=> this.updateGrid(), this.interval);
    }
    else {
      clearInterval(this.loopId);
    }

    this.runStatus = !this.runStatus;
    this.onRunStatusChanged.emit(this.runStatus);
  }

  clearAll(drawCells: boolean = false) {
    this.cells = [];
    for(let r = 0; r < this.rows; r++) {
      this.cells.push([]);
      for(let c = 0; c < this.columns; c++) {
        this.cells[r].push({status: false, haveToDie: true});
      }
    }

    if (drawCells) {
      this.drawCells();
    }
  }

  private setStyles() {
    let canvasContainer = document.getElementById('canvasContainer');
    console.log('canvasContainer', canvasContainer)
    canvasContainer.style.backgroundColor = this.offColor;
  }

  private initGrid() {
    if (this.runStatus) {
      this.startStop(false);
    }

    this.setCellsRowsAndColumns();
    this.randomizePattern();
  }

  private updateGrid() {
    this.drawCells();

    this.updateCellsStatus();
  }

  private drawCells() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.drawContext.fillStyle = this.cells[r][c].status ? this.onColor : this.offColor;
        this.drawContext.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }

  private updateCellsStatus() {
    this.cellsCopy = JSON.parse(JSON.stringify(this.cells));

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.setNewCellStatus(r, c);
      }
    }

    this.cells = JSON.parse(JSON.stringify(this.cellsCopy));
  }

  private setNewCellStatus(row: number, col: number) {
    let cell = this.cells[row][col];
    let cellCopy = this.cellsCopy[row][col];
    let neighboursCount: number = 0;

    neighboursCount += this.getNeighborsStatusValue(row - 1, col - 1);
    neighboursCount += this.getNeighborsStatusValue(row - 1, col);
    neighboursCount += this.getNeighborsStatusValue(row - 1, col + 1);
    neighboursCount += this.getNeighborsStatusValue(row + 1, col - 1);
    neighboursCount += this.getNeighborsStatusValue(row + 1, col);
    neighboursCount += this.getNeighborsStatusValue(row + 1, col + 1);
    neighboursCount += this.getNeighborsStatusValue(row, col - 1);
    neighboursCount += this.getNeighborsStatusValue(row, col + 1);


    // if (cell.status && (neighboursCount < 2 || neighboursCount > 3)) {
    //   cellCopy.status = false;
    // }
    // else if (neighboursCount == 3) {
    //   cellCopy.status = true;
    // }
    // else {
    //   cellCopy.status = cell.status;
    // }

    cellCopy.status = (cell.status && neighboursCount > 1 && neighboursCount < 4) || (!cell.status && neighboursCount == 3);
  }

  private getNeighborsStatusValue(row: number, col: number) {
    if (row > -1 && row < this.rows && col > -1 && col < this.columns) {
      return this.cells[row][col].status ? 1 : 0;
    }

    return 0;
  }
}
