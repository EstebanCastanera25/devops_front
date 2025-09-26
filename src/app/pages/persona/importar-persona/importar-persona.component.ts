import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PersonaService } from '../../../services/persona.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-importar-persona',
  standalone: false,
  templateUrl: './importar-persona.component.html',
  styleUrl: './importar-persona.component.scss'
})
export class ImportarPersonaComponent {
  archivoSeleccionado: File | null = null;
  erroresImportacion: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<ImportarPersonaComponent>,
    private personaService: PersonaService
  ) {}

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.archivoSeleccionado = target.files[0];
    }
  }

  async importar() {
    if (!this.archivoSeleccionado) return;

    try {
      const resultado = await this.personaService.importarPersonas(this.archivoSeleccionado).toPromise();

      if (resultado.importados > 0) {
        swal.fire({
          icon: 'success',
          title: 'Importación exitosa',
          text: `${resultado.importados} personas importadas`
        });
      }

      if (resultado.erroresImportacion.length > 0) {
        this.erroresImportacion = resultado.erroresImportacion;
      } else {
        this.dialogRef.close({ finalizado: true, importados: resultado.importados });
      }

    } catch (error) {
      console.error('Error en importación:', error);
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo importar el archivo'
      });
    }
  }

  descargarModelo() {
    const enlace = document.createElement('a');
    enlace.href = 'assets/models/modelo-persona.xlsx'; // asegurate que exista
    enlace.download = 'modelo-persona.xlsx';
    enlace.click();
  }

  cancelar() {
    this.dialogRef.close();
  }
}
