import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ICell} from "../../models/interfaces";

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnChanges {
  @Input() interval: number = 300;
  @Input() designEnabled: boolean = false;
  @Input() showGrid: boolean = true;

  @Output() onRunStatusChanged = new EventEmitter<boolean>();

  private cellSize: number = 20;
  private onColor: string = 'red';
  private offColor: string = 'whitesmoke';
  private gridColor: string = 'lightgray';
  private gridColorDesign: string = 'darkgray';
  private cells: ICell[][] = [];
  private cellsCopy: ICell[][] = [];
  private rows: number = 0;
  private columns: number = 0;

  private drawContext: CanvasRenderingContext2D = null;

  private loopId: any = null;
  private runStatus: boolean = false;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.setStyles();
    this.initGrid();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.designEnabled || changes.showGrid) {
      let canvas = <HTMLCanvasElement>document.querySelector('canvas');
      canvas.style.cursor = this.designEnabled ? 'pointer' : 'default';
      this.drawCells();
    }
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
    this.drawContext.lineJoin = "bevel";
    this.drawContext.lineWidth = 1;

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

    //Test Code
    // this.cells[3][4].status = true;
    // this.cells[3][5].status = true;
    // this.cells[3][6].status = true;
    //
    // this.cells[4][3].status = true;
    // this.cells[4][4].status = true;
    // this.cells[4][5].status = true;

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
        // this.cells[r].push({status: false, position: {x: c * this.cellSize, y: r * this.cellSize}});
        this.cells[r].push({status: false});
      }
    }

    console.log('this.cells', this.cells)

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
        this.drawCell(r, c);
      }
    }
  }

  private drawCell(r: number, c: number) {
    this.drawContext.fillStyle = this.cells[r][c].status ? this.onColor : this.offColor;
    this.drawContext.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);

    if (this.showGrid || this.designEnabled) {
      this.drawContext.strokeStyle = this.designEnabled ? this.gridColorDesign : this.gridColor;
      this.drawContext.strokeRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
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

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1;c <= col + 1; c++) {
        if (r != row || c != col) {
          neighboursCount += this.getNeighborsStatusValue(r, c);
        }
      }
    }

    cellCopy.status = (cell.status && neighboursCount > 1 && neighboursCount < 4) || (!cell.status && neighboursCount == 3);
  }

  private getNeighborsStatusValue(row: number, col: number) {
    if (row > -1 && row < this.rows && col > -1 && col < this.columns) {
      return this.cells[row][col].status ? 1 : 0;
    }

    return 0;
  }

  canvasMouseUp(event: MouseEvent) {
    if (this.designEnabled) {
      let x = event.offsetX;
      let y = event.offsetY;

      for(let r = 0; r < this.rows; r++) {
        for(let c = 0; c < this.columns; c++) {
          let cell = this.cells[r][c];
          let cx = c * this.cellSize;
          let cy = r * this.cellSize;

          if (x >= cx && y >= cy && x <= cx + this.cellSize && y <= cy + this.cellSize) {
            cell.status = !cell.status;
            this.drawCell(r, c);
            return;
          }
        }
      }
    }
  }
}
