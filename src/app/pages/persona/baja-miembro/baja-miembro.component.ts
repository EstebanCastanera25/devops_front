import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { PersonaService } from 'src/app/services/persona.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-baja-miembro',
  templateUrl: './baja-miembro.component.html',
  styleUrl: './baja-miembro.component.scss'
})
export class BajaMiembroComponent {
  form: UntypedFormGroup;
  
    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<BajaMiembroComponent>,
      private _personaService: PersonaService,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.form = this.fb.group({
        motivo: ['', [
          Validators.required,
          Validators.pattern(/[^\s]+.*$/),
          Validators.maxLength(200)
        ]]
      });
    }
      private toTitleCase(s: string = ''): string {
        return s.replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
        );
      }
    guardar(): void {
      if (this.form.invalid) return;
      const motivo = this.form.value;
      const id = this.data?.persona?._id;
      const nombreMostrar = `${this.toTitleCase(this.data?.persona?.nombres)} ${this.toTitleCase(this.data?.persona?.apellidos)}`;
      const mensaje = `${nombreMostrar} baja correctamente`;

  
      this._personaService.marcarComoBaja(id, motivo).subscribe({
        next: () => this.dialogRef.close({ exito: true, mensaje }),
        error: () => Swal.fire('Error', 'No se pudo dar de baja al miembro', 'error')
      });
    }
  
    cancelar(): void {
      this.dialogRef.close(false); 
    }
}
