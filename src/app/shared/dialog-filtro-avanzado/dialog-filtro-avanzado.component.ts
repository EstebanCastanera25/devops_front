import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-filtro-avanzado',
  templateUrl: './dialog-filtro-avanzado.component.html',
  styleUrl: './dialog-filtro-avanzado.component.scss'
})
export class DialogFiltroAvanzadoComponent implements OnInit{
  form: FormGroup;
  maxFecha = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { fields: { key: string; label: string }[] },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogFiltroAvanzadoComponent>
  ) {
    this.form = this.fb.group({});
    this.data.fields.forEach(field => {
      this.form.addControl(field.key, this.fb.control(''));
    // 👇 Agregamos edad_condicion si el campo es 'edad'
      if (field.key === 'edad') {
        this.form.addControl('edad_condicion', this.fb.control('=')); // Valor por defecto
      }
      if (field.key === 'f_nacimiento') {
        this.form.addControl('edad_condicion', this.fb.control('='));
      }
    });
  }
  ngOnInit(): void {
    // asegura que el overlay reciba la clase (no dependes de quien lo abra)
    this.dialogRef.addPanelClass('responsive-filter-dialog');
  }
  filtrarSoloAnio(event: any) {
      const selectedYear = event.getFullYear();
      const fecha = new Date();
      fecha.setFullYear(selectedYear, 0, 1); // enero 1
      fecha.setHours(0, 0, 0, 0);
      this.form.get('f_nacimiento')?.setValue(fecha);
    }
  aplicar() {
    console.log("this.form.value",this.form.value)
    this.dialogRef.close(this.form.value);
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}