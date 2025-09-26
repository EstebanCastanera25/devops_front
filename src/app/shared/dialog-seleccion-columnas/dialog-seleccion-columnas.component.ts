import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
@Component({
  selector: 'app-dialog-seleccion-columnas',
  templateUrl: './dialog-seleccion-columnas.component.html',
  styleUrls: ['./dialog-seleccion-columnas.component.scss'], 
})
export class DialogSeleccionColumnasComponent {
  camposSeleccionados: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      campos: { key: string; label: string }[],
      seleccionadas?: string[]
    },
    private dialogRef: MatDialogRef<DialogSeleccionColumnasComponent>
  ) {
    this.camposSeleccionados = data.seleccionadas
      ? data.campos.filter(c => data.seleccionadas?.includes(c.key))
      : [...data.campos];
  }
  onSelectionChange(event: MatSelectionListChange) {
  this.camposSeleccionados = event.source.selectedOptions.selected.map(option => option.value);
}
  toggleCampo(campo: any, checked: boolean) {
    if (checked) {
      this.camposSeleccionados.push(campo);
    } else {
      this.camposSeleccionados = this.camposSeleccionados.filter(c => c.key !== campo.key);
    }
  }

  estaSeleccionado(campo: any): boolean {
    return this.camposSeleccionados.some(c => c.key === campo.key);
  }

  aplicar() {
  const claves = this.camposSeleccionados.map(c => c.key);
  console.log("claves",claves)
  this.dialogRef.close(claves);
}

  cancelar() {
    this.dialogRef.close(null);
  }
}