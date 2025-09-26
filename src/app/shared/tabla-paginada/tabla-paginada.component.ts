import {
  Component, ViewChild, Input, Output, EventEmitter,
  OnChanges, SimpleChanges, AfterViewInit
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AngularCsv as Angular2Csv } from 'angular-csv-ext/dist/Angular-csv';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export interface Decorations {
  columnaId: string;       // campo del objeto que representa la columna
  tooltip: string;         // texto del tooltip
  renombrar: string;       // nombre mostrado
  subkey: string;          // subkey a mostrar
  transformar: RegExp;     // regexp para transformar display
  arrayTostring: string;   // si es array, concatena; si es array de objetos, espera la clave
  mutate: Function;
  style: Function;
  icon: Function;
  valueAndIcon: boolean;
  pipe: string;
}

@Component({
  selector: 'app-tabla-paginada',
  templateUrl: './tabla-paginada.component.html',
  styleUrl: './tabla-paginada.component.scss'
})
export class TablaPaginadaComponent implements OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  dataSource: MatTableDataSource<any>;

  @Input() MostrarColumnas: string[] = [];
  @Input() DecoracionColumnas!: Decorations[];
  Columnas: string[] = [];
  displayedColumns: string[] = [];

  @Input() Nombre = '';
  @Input() Titulo!: string;
  @Input() Contenido: any[] = [];
  @Input() FormatColumnas!: any[];
  @Input() editable: boolean = false;
  @Input() columnas!: Decorations[];
  @Input() filterEnable: boolean = false;
  @Input() descargable!: boolean;
  @Input() customActions: any[] = [];
  @Input() tablaOrdenada: boolean = false;

  // Responsive
  @Input() maxMobileCols: number = 3;  // cuántas columnas mostrar en móvil (sin contar Acciones)
  isHandset = false;
  private allColumns: string[] = [];    // set completo sin Acciones
  private mobileColumns: string[] = []; // subconjunto para móvil

  // Outputs
  @Output() clicked = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() borrar = new EventEmitter<any>();
  @Output() clickAction = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<any>();

  constructor(private bp: BreakpointObserver) {
    this.sort = new MatSort();
    if (this.tablaOrdenada) this.sort.direction = 'asc';

    this.dataSource = new MatTableDataSource(this.Contenido);
    this.dataSource.sort = this.sort;

    // Detecta tamaño de dispositivo
    this.bp.observe([Breakpoints.Handset]).subscribe(state => {
      this.isHandset = state.matches;
      this.updateDisplayedColumnsForScreen();
      if (this.paginator) {
        this.paginator._intl.itemsPerPageLabel = (this.Nombre || 'Items') + ' por página';
      }
    });
  }

  // ==================== Responsive helpers ====================
  private updateDisplayedColumnsForScreen() {
    if (!this.allColumns?.length) return;

    // Base (todas) sin Acciones
    const base = [...this.allColumns];

    // Subconjunto móvil
    this.mobileColumns = base.slice(0, this.maxMobileCols);

    const withActions = (arr: string[]) => (this.editable ? [...arr, 'Acciones'] : arr);

    this.displayedColumns = this.isHandset
      ? withActions(this.mobileColumns)
      : withActions(base);
  }

  // ==================== Ciclo de vida ====================
  ngAfterViewInit(): void {
    if (this.tablaOrdenada) this.sort.direction = 'asc';

    if (this.Contenido.length > 0) {
      this.Columnas = this.ObtenerNombresColumnas(this.Contenido);

      this.dataSource.sortData = (data: any[], sort: MatSort) => {
        let columnaSeleccionada: string = sort.active;
        const orden = sort.direction;

        if (columnaSeleccionada == undefined) columnaSeleccionada = this.displayedColumns[0];

        return data.sort((a: any, b: any) => {
          let el1 = this.jsonExplore(columnaSeleccionada, a);
          let el2 = this.jsonExplore(columnaSeleccionada, b);
          if (orden == 'asc') return (el1 >= el2) ? 0 : 1;
          else return (el1 <= el2) ? 0 : 1;
        });
      };

      this.dataSource.filterPredicate = ((data: any, filter: string) => {
        const filterRegexp = new RegExp(filter, 'i');
        if (this.columnas != undefined) {
          for (let col in this.columnas) {
            if (filterRegexp.test(this.jsonExplore(this.columnas[col].columnaId, data))) {
              return true;
            }
          }
          return false;
        } else {
          for (let col in this.displayedColumns) {
            if (filterRegexp.test(data[this.displayedColumns[col]])) return true;
          }
          return false;
        }
      });

      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;

      // Guarda set completo (sin Acciones) y aplica responsive
      this.allColumns = [...this.displayedColumns.filter(c => c !== 'Acciones')];
      this.updateDisplayedColumnsForScreen();

      if (this.paginator) {
        this.paginator._intl.itemsPerPageLabel = (this.Nombre || 'Items') + ' por página';
        this.paginator._intl.nextPageLabel = 'Siguiente';
        this.paginator._intl.previousPageLabel = 'Anterior';
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.Contenido && changes && !changes['firstChange']) {
      this.Columnas = this.ObtenerNombresColumnas(this.Contenido);

      this.dataSource.sortData = (data: any[], sort: MatSort) => {
        let columnaSeleccionada: string = sort.active;
        const orden = sort.direction;

        if (columnaSeleccionada == undefined) columnaSeleccionada = this.displayedColumns[0];
        const value = data.sort((a: any, b: any) => {
          let el1 = this.jsonExplore(columnaSeleccionada, a);
          let el2 = this.jsonExplore(columnaSeleccionada, b);
          if (columnaSeleccionada == 'speed') {
            el1 = parseInt(el1);
            el2 = parseInt(el2);
          }
          if (orden == 'asc') return (el1 == el2) ? 0 : (el1 > el2) ? -1 : 1;
          else return (el1 == el2) ? 0 : (el1 < el2) ? -1 : 1;
        });
        return value;
      };

      this.dataSource.filterPredicate = ((data: any, filter: string) => {
        const filterRegexp = new RegExp(filter, 'i');
        if (this.columnas != undefined) {
          for (let col in this.columnas) {
            if (filterRegexp.test(this.jsonExplore(this.columnas[col].columnaId, data))) {
              return true;
            }
          }
          return false;
        } else {
          for (let col in this.displayedColumns) {
            if (filterRegexp.test(data[this.displayedColumns[col]])) return true;
          }
          return false;
        }
      });

      this.dataSource.paginator = this.paginator;
      if (this.table) this.table.dataSource = this.dataSource;
      if (this.paginator) {
        this.paginator._intl.itemsPerPageLabel = (this.Nombre || 'Items') + ' por página';
        this.paginator._intl.nextPageLabel = 'Siguiente';
        this.paginator._intl.previousPageLabel = 'Anterior';
      }

      // Recalcula columnas y aplica responsive
      this.allColumns = [...this.displayedColumns.filter(c => c !== 'Acciones')];
      this.updateDisplayedColumnsForScreen();
    }
  }

  // ==================== Helpers de columnas ====================
  ObtenerNombresColumnas(dataVector: any[]) {
    this.dataSource = new MatTableDataSource(dataVector);
    this.dataSource.sort = this.sort;

    if (this.columnas !== undefined) {
      const cols: string[] = [];
      this.columnas.forEach(el => cols.push(el.columnaId));
      const edit = (this.editable) ? cols.concat('Acciones') : cols;
      this.displayedColumns = edit;
      return cols;
    } else {
      const cols: string[] = [];
      for (const key in dataVector[0]) cols.push(key);
      const edit = (this.editable) ? cols.concat('Acciones') : cols;
      this.displayedColumns = (this.MostrarColumnas.length == 0)
        ? edit
        : (this.editable) ? this.MostrarColumnas.concat('Acciones') : this.MostrarColumnas;
      return cols;
    }
  }

  // ==================== Eventos ====================
  eventClic(val: any, key: string) {
    const clickedData: any = {};
    clickedData[key] = val[key];
    const obj: any = { clickObj: clickedData, dataRow: val };
    this.clicked.emit(obj);
  }

  edit(fila: any) { this.editar.emit(fila); }
  delete(fila: any) { this.borrar.emit(fila); }
  customClick(accion: any) { this.clickAction.emit(accion); }

  // ==================== Decoración / Render ====================
  getTooltip(columnaId: string, columnaData: any) {
    if (this.columnas !== undefined) {
      if (this.columnas.length == 0) return null;
      for (let deco in this.columnas) {
        if (this.columnas[deco].columnaId == columnaId) {
          if (this.columnas[deco].tooltip != undefined)
            return this.columnas[deco].tooltip.replace('{valor}', this.jsonExplore(this.columnas[deco].columnaId, columnaData));
        }
      }
    } else {
      if (this.DecoracionColumnas != undefined && this.DecoracionColumnas.length == 0) return null;
      for (let decoracion in this.DecoracionColumnas) {
        if (this.DecoracionColumnas[decoracion].columnaId == columnaId) {
          if (this.DecoracionColumnas[decoracion].tooltip != undefined) {
            return this.DecoracionColumnas[decoracion].tooltip.replace('{valor}', columnaData[columnaId]);
          }
        }
      }
    }
    return null;
  }

  getTitle(columnaId: string) {
    if (this.columnas !== undefined) {
      if (this.columnas.length > 0) {
        for (let deco in this.columnas) {
          if (this.columnas[deco].columnaId == columnaId) {
            if (this.columnas[deco].renombrar != undefined) {
              return this.columnas[deco].renombrar;
            }
          }
        }
      }
      return columnaId;
    } else {
      if (this.DecoracionColumnas != undefined && this.DecoracionColumnas.length == 0) return columnaId;
      for (let decoracion in this.DecoracionColumnas) {
        if (this.DecoracionColumnas[decoracion].columnaId == columnaId) {
          if (this.DecoracionColumnas[decoracion].renombrar != undefined) {
            return this.DecoracionColumnas[decoracion].renombrar;
          } else return columnaId;
        }
      }
      return columnaId;
    }
  }

  getcolVal(columna: string, currentVal: any) {
    if (this.columnas !== undefined) {
      for (let deco in this.columnas) {
        if (this.columnas[deco].columnaId == columna) {
          if (this.columnas[deco].icon && !this.columnas[deco].valueAndIcon) return '';

          if (/time|fecha/i.test(columna)) {
            if (this.columnas[deco].subkey) {
              const time = new Date(this.jsonExplore(this.columnas[deco].subkey, currentVal));
              const dateString = time.toLocaleDateString();
              const timeString = time.toLocaleTimeString().replace(/:00$/, '');
              return dateString + ' ' + timeString;
            } else {
              const time = new Date(currentVal[columna]);
              const dateString = time.toLocaleDateString();
              const timeString = time.toLocaleTimeString().replace(/:00$/, '');
              return dateString + ' ' + timeString;
            }
          }
        }

        if (Array.isArray(currentVal[columna])) {
          if (this.columnas[deco].columnaId == columna) {
            if (this.columnas[deco].arrayTostring !== undefined) {
              let response = '';
              for (const el of currentVal[columna]) {
                response += (this.columnas[deco].arrayTostring != '')
                  ? el[this.columnas[deco].arrayTostring]
                  : el;
                response += ', ';
              }
              return response;
            }
          }
        }

        if (this.isString(currentVal) || this.isNumber(currentVal)) return currentVal;

        if (this.columnas[deco].columnaId == columna) {
          const val = this.jsonExplore(this.columnas[deco].columnaId, currentVal);
          if (this.columnas[deco].transformar == undefined && this.columnas[deco].mutate == undefined) return val;
          else {
            if (this.columnas[deco].mutate == undefined) {
              const result = this.columnas[deco].transformar.exec(val);
              if (Array.isArray(result) && result.length > 1) return result[1];
              else return result;
            } else {
              return this.columnas[deco].mutate(val);
            }
          }
        }
      }
      return currentVal;
    } else {
      if (this.isString(currentVal) || this.isNumber(currentVal)) return currentVal;
      else {
        if (this.FormatColumnas != undefined && this.FormatColumnas.length == 0) return JSON.stringify(currentVal);
        else {
          for (let format in this.FormatColumnas) {
            if (this.FormatColumnas[format].columnaId == columna) {
              return this.jsonExplore(this.FormatColumnas[format].subkey, currentVal);
            }
          }
          return this.jsonExplore(columna, currentVal);
        }
      }
    }
  }

  getStyle(column: any, row: any) {
    if (this.columnas !== undefined) {
      for (let col of this.columnas) {
        if (col.columnaId == column) {
          if (col.style) return col.style(column, row);
        }
      }
    }
    return { 'background-color': 'none' };
  }

  getIcon(column: any, row: any) {
    if (this.columnas !== undefined) {
      for (let col of this.columnas) {
        if (col.columnaId == column) {
          if (col.icon) return col.icon(column, row);
        }
      }
    }
    return '';
  }

  hasPipe(column: any) {
    if (this.columnas !== undefined) {
      for (let col of this.columnas) {
        if (col.columnaId == column) {
          if (col.pipe) return true;
        }
      }
    }
    return false;
  }

  getPipe(column: any) {
    if (this.columnas !== undefined) {
      for (let col of this.columnas) {
        if (col.columnaId == column) {
          if (col.pipe) return col.pipe;
        }
      }
    }
    return '';
  }

  // ==================== Utils ====================
  private isString(value: any) { return typeof value === 'string' || value instanceof String; }
  private isJson(value: any) { return typeof value === 'string' || value instanceof String; }
  private isNumber(value: any) { return typeof value === 'number' || value instanceof Number; }

  private jsonExplore(keys: string, value: any) {
    const key = keys.split('.');
    if (key.length == 0) return value;
    if (key.length == 1) return value[key[0]];
    if (key.length >= 2) {
      if (value[key[0]] == undefined) return '';
      if (key.length == 2) return value[key[0]][key[1]];
      if (key.length >= 3) {
        if (value[key[0]][key[1]] == undefined) return '';
        if (key.length == 3) return value[key[0]][key[1]][key[2]];
        if (key.length >= 4) {
          if (value[key[0]][key[1]][key[2]] == undefined) return '';
          if (key.length == 4) return value[key[0]][key[1]][key[2]][key[3]];
        }
      }
    }
    return JSON.stringify(value);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filterChange.emit(this.dataSource.filteredData);
  }

  descargar() {
    if (this.columnas == undefined) {
      const options = {
        title: this.Nombre,
        fieldSeparator: ';',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: this.MostrarColumnas
      };
      const exportData = this.dataSource.filteredData.map(el => {
        const obj: any = {};
        for (let col in this.displayedColumns) {
          if (this.displayedColumns[col] != 'Acciones')
            obj[this.displayedColumns[col]] = this.getcolVal(this.displayedColumns[col], el);
        }
        return obj;
      });
      new Angular2Csv(exportData, this.Nombre + '_' + new Date().toDateString(), options);
    } else {
      let headers: string[] = [];
      headers = this.columnas.map(column => column.renombrar != undefined ? column.renombrar : column.columnaId);

      const options = {
        title: this.Nombre,
        fieldSeparator: ';',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: headers
      };
      const exportData = this.dataSource.filteredData.map(el => {
        const obj: any = {};
        for (let col in this.columnas) {
          obj[headers[col]] = this.getcolVal(this.columnas[col].columnaId, el);
        }
        return obj;
      });
      new Angular2Csv(exportData, this.Nombre + '_' + new Date().toDateString(), options);
    }
  }
}
