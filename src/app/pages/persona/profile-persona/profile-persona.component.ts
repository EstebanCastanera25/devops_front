import { Component, Inject, OnInit } from '@angular/core';
import {  UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../../services/persona.service';
import { Observable} from 'rxjs';
import { PAISES,GENEROS,PERSONA_VALIDATION, COMUNAS_CABA, BARRIOS_CABA, PROVINCIAS_ARG } from 'src/app/shared/data';
import Utils from 'src/app/shared/funcionesUtiles';
import swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-persona',
  standalone: false,
  templateUrl: './profile-persona.component.html',
  styleUrl: './profile-persona.component.scss'
})
export class ProfilePersonaComponent implements OnInit {
  isReadOnly = true;
  
  isDisabled: boolean = true;
  loading = true;
  isEnabled: boolean = false;
  options: any[] = []
  filteredOptions!: Observable<any[]>;
  fechaNacimiento: String | null = null; // Variable para almacenar la fecha seleccionada
  idCreador: String | null = null;;
  generos: string[] = GENEROS;
  miembroId= '';
  miembro!: any;
  paises: string[] = PAISES;
  barrios_caba: string[] = BARRIOS_CABA;
  provincias_arg: string[] = PROVINCIAS_ARG;
  readonly PERSONA_VALIDATION = PERSONA_VALIDATION;
  
  get pais() { return this.persona.get('datosContacto.pais')?.value; }
  get provincia() { return this.persona.get('domicilio.provincia')?.value; }
 
  
 
  persona = new UntypedFormGroup({
  nombres: new UntypedFormControl({ value: "",  disabled: this.isEnabled}, ),
  apellidos: new UntypedFormControl({ value: "",  disabled: this.isEnabled},  ),
  domicilio: new UntypedFormGroup({
    calle: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
    numero: new UntypedFormControl({ value: null,  disabled: this.isEnabled}),
    piso: new UntypedFormControl({ value: null,  disabled: this.isEnabled}),
    departamento: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
    barrio: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
    ciudad: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
    provincia: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
    codigoPostal: new UntypedFormControl({ value: "",  disabled: this.isEnabled})
    }),
    datosContacto: new UntypedFormGroup({
      pais: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
      email: new UntypedFormControl({ value: '',  disabled: this.isEnabled},),
      telefono_movil: new UntypedFormControl({ value: '',  disabled: this.isEnabled}),
      telefono_fijo: new UntypedFormControl({ value: '',  disabled: this.isEnabled})
    }),
    identificacion: new UntypedFormGroup({
      dni: new UntypedFormControl({ value: '',  disabled: this.isEnabled}),
    }),
    datosPersonales: new UntypedFormGroup({
      genero: new UntypedFormControl({ value: '',  disabled: this.isEnabled}),
      f_nacimiento: new UntypedFormControl({ value: '',  disabled: this.isEnabled}),
      profesion: new UntypedFormControl({ value: '',  disabled: this.isEnabled})
    }),
    estado: new UntypedFormGroup({
      afiliado: new UntypedFormControl({ value: false,  disabled: this.isEnabled}),
      bbdd_lla: new UntypedFormControl({ value: false,  disabled: this.isEnabled}),
      en_whatsaap: new UntypedFormControl({ value: false,  disabled: this.isEnabled}),
    }),
    observaciones: new UntypedFormControl('')
    });
    

    constructor(
      private _personaService:PersonaService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialogRef: MatDialogRef<ProfilePersonaComponent>
    ){
      
      
    }
    private toBool(v: any): boolean {
      if (typeof v === 'string') return ['si', 'sí', 'true', '1'].includes(v.toLowerCase());
      return !!v;
    }
    
    onInfoReceivedCalendario(event: any) {
       // CAMBIO: guardar Date directo
      const fecha = event as Date | null;
      this.persona.get('datosPersonales.f_nacimiento')?.setValue(fecha);
    }
    onFechaSeleccionada(fecha: Date) {
       this.persona.get('datosPersonales.f_nacimiento')?.setValue(fecha);
    }
    ngOnInit(): void {
      this.inicializarDatos()      
      this.setupValueChanges();
    }
     

    inicializarDatos(){
        this.miembroId = this.data;
        if (!this.miembroId) return;
         
         this._personaService.obtener_persona(this.miembroId).subscribe({
          next: (res) => {
            console.log("miembro",res.data)
            this.miembro = res.data;
            this.cargarPersonaEnFormulario(this.miembro);
            this.loading = false;
          },
            error: () => {
              swal.fire('Error', 'No se pudo cargar el fiscal', 'error');
              this.loading = false;
            }
          });   
          
      }

  setupValueChanges(): void {
    this.persona.get('nombres')?.valueChanges.subscribe(v =>
      this.persona.get('nombres')?.setValue((v || '').toLowerCase(), { emitEvent: false })
    );
    this.persona.get('apellidos')?.valueChanges.subscribe(v =>
      this.persona.get('apellidos')?.setValue((v || '').toLowerCase(), { emitEvent: false })
    );
    // ojo: el email está dentro de datosContacto
    this.persona.get('datosContacto.email')?.valueChanges.subscribe(v =>
      this.persona.get('datosContacto.email')?.setValue((v || '').toLowerCase(), { emitEvent: false })
    );
  }
     
  
  private cargarPersonaEnFormulario(p: any): void {

    const fNac = p.datosPersonales?.f_nacimiento ?? p.f_nacimiento 
    // 1) Domicilio seguro
    const dom = (p && typeof p.domicilio === 'object' && p.domicilio !== null)
      ? p.domicilio
      : { calle: p?.domicilio || '' };

    //  CAMBIO: canonizamos la provincia para que matchee exactamente el catálogo
    let provincia = dom.provincia ?? ''; // (antes: dom.provincia ?? '')
    let ciudad    = dom.ciudad ?? '';
    let barrio    = dom.barrio ?? '';  

    // 3) Patch por bloques con emitEvent:false
    this.persona.patchValue({
      nombres: p.nombres ?? '',
      apellidos: p.apellidos ?? '',
      observaciones: p.observaciones ?? ''
    }, { emitEvent: false });

    this.persona.get('domicilio')?.patchValue({
      calle: dom.calle ?? '',
      numero: dom.numero ?? null,
      piso: dom.piso ?? null,
      departamento: dom.departamento ?? '',
      ciudad,
      barrio,
      provincia,                                        // queda el valor canonizado
      codigoPostal: dom.codigoPostal ?? ''
    }, { emitEvent: false });

    this.persona.get('datosContacto')?.patchValue({
      email: p.datosContacto?.email ?? p.email ?? '',
      pais:  p.datosContacto?.pais  ?? 'Argentina',
      telefono_movil: p.datosContacto?.telefono_movil ?? p.telefono_movil ?? '',
      telefono_fijo:  p.datosContacto?.telefono_fijo  ?? p.telefono_fijo  ?? ''
    }, { emitEvent: false });

    this.persona.get('identificacion')?.patchValue({
      dni: p.identificacion?.dni ?? p.dni ?? ''
    }, { emitEvent: false });

    this.persona.get('datosPersonales')?.patchValue({
      genero: p.datosPersonales?.genero ?? p.genero ?? 'otro',
      f_nacimiento: fNac || '',
      profesion: p.datosPersonales?.profesion ?? p.profesion ?? ''
    }, { emitEvent: false });

    this.persona.get('estado')?.patchValue({
      afiliado: this.toBool(p.estado?.afiliado ?? p.afiliado),
      bbdd_lla: this.toBool(p.estado?.bbdd_lla ?? p.bbdd_lla),
      en_whatsaap: this.toBool(p.estado?.en_whatsaap ?? p.en_whatsaap ?? p.estado?.en_whatsapp)
    }, { emitEvent: false });

   
  }
    

onDateChange(event: any) {
  //console.log("event", event.value)
  this.onInfoReceivedCalendario(event.value);
}

cancelar(): void {
  this.dialogRef.close();
  }
}
