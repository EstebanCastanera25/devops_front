import { Component, OnInit } from '@angular/core';
import {  UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../../services/persona.service';
import {  Observable} from 'rxjs';
import { PAISES,GENEROS,PERSONA_VALIDATION, BARRIOS_CABA, PROVINCIAS_ARG } from 'src/app/shared/data';
import Utils from 'src/app/shared/funcionesUtiles';
import swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-persona',
  standalone: false,
  templateUrl: './create-persona.component.html',
  styleUrl: './create-persona.component.scss'
})
export class CreatePersonaComponent implements OnInit{
  submitted = false;
  isDisabled: boolean = true;
  isEnabled: boolean = false;
  options: any[] = []
  filteredOptions!: Observable<any[]>;
  fechaNacimiento: String | null = null; // Variable para almacenar la fecha seleccionada
  idCreador: String | null = null;;
  generos: string[] = GENEROS;
  paises: string[] = PAISES;
  barrios_caba: string[] = BARRIOS_CABA;
  provincias_arg: string[] = PROVINCIAS_ARG;
  readonly PERSONA_VALIDATION = PERSONA_VALIDATION;
 
  
 
  persona = new UntypedFormGroup({
  nombres: new UntypedFormControl({ value: "",  disabled: this.isEnabled}, [Validators.required, Validators.minLength(PERSONA_VALIDATION.NOMBRES_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.NOMBRES_VALIDATION.maxLength)]),
  apellidos: new UntypedFormControl({ value: "",  disabled: this.isEnabled},  [Validators.required, Validators.minLength(PERSONA_VALIDATION.APELLIDOS_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.APELLIDOS_VALIDATION.maxLength)]),
  domicilio: new UntypedFormGroup({
    calle: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
    numero: new UntypedFormControl({ value: null,  disabled: this.isEnabled}),
    piso: new UntypedFormControl({ value: null,  disabled: this.isEnabled}),
    departamento: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
    barrio: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
    ciudad: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
    provincia: new UntypedFormControl({ value: "Ciudad Autónoma de Buenos Aires",  disabled: this.isEnabled},Validators.required),
    codigoPostal: new UntypedFormControl({ value: "",  disabled: this.isEnabled})
  }),
  datosContacto: new UntypedFormGroup({
    pais: new UntypedFormControl({ value: "Argentina",  disabled: this.isEnabled}, Validators.required),
    email: new UntypedFormControl({ value: '',  disabled: this.isEnabled}, [Validators.minLength(PERSONA_VALIDATION.EMAIL_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.EMAIL_VALIDATION.maxLength),Validators.email]),
    telefono_movil: new UntypedFormControl({ value: '',  disabled: this.isEnabled}, [Validators.required,Validators.minLength(PERSONA_VALIDATION.TELEFONO_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.TELEFONO_VALIDATION.maxLength)]),
    telefono_fijo: new UntypedFormControl({ value: '',  disabled: this.isEnabled})
  }),
  identificacion: new UntypedFormGroup({
    dni: new UntypedFormControl({ value: '',  disabled: this.isEnabled}, [Validators.minLength(PERSONA_VALIDATION.DNI_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.DNI_VALIDATION.maxLength)]),
  }),
  datosPersonales: new UntypedFormGroup({
    genero: new UntypedFormControl({ value: 'otro',  disabled: this.isEnabled}, Validators.required),
    f_nacimiento: new UntypedFormControl({ value: '',  disabled: this.isEnabled}),
    profesion: new UntypedFormControl({ value: '',  disabled: this.isEnabled})
  }),
  estado: new UntypedFormGroup({
    afiliado: new UntypedFormControl({ value: false,  disabled: this.isEnabled}, Validators.required),
    bbdd_lla: new UntypedFormControl({ value: false,  disabled: this.isEnabled}),
    en_whatsaap: new UntypedFormControl({ value: false,  disabled: this.isEnabled}),
  }),
  observaciones: new UntypedFormControl('')
});
    

    constructor(
      private _personaService:PersonaService,
      private dialogRef: MatDialogRef<CreatePersonaComponent>
    ){
      
      
    }
    
    get phoneError() {
      return Utils.getPhoneError(this.persona.get('datosContacto.telefono_movil'), PERSONA_VALIDATION.TELEFONO_VALIDATION.minLength, PERSONA_VALIDATION.TELEFONO_VALIDATION.maxLength);
    }
    get nameError() {
      return Utils.getNameError(this.persona.get('nombres'), PERSONA_VALIDATION.NOMBRES_VALIDATION.minLength, PERSONA_VALIDATION.NOMBRES_VALIDATION.maxLength);
    }
    get surnameError() {
      return Utils.getSurnameError(this.persona.get('apellidos'), PERSONA_VALIDATION.APELLIDOS_VALIDATION.minLength, PERSONA_VALIDATION.APELLIDOS_VALIDATION.maxLength);
    }
    get emailError() {
      return Utils.getEmailError(this.persona.get('datosContacto.email'), PERSONA_VALIDATION.EMAIL_VALIDATION.minLength, PERSONA_VALIDATION.EMAIL_VALIDATION.maxLength);
    }
    get dniError() {
      return Utils.getDniError(
        this.persona.get('identificacion.dni'),
        PERSONA_VALIDATION.DNI_VALIDATION.minLength,
        PERSONA_VALIDATION.DNI_VALIDATION.maxLength
      );
    }
    get fechaNacimientoError() {
      return Utils.fechaNacimientoError(this.persona.get('datosPersonales.f_nacimiento'));
    }
    get paisError() {
      return Utils.paisError(this.persona.get('datosContacto.pais'));
    }
    get generoError() {
      return Utils.generoError(this.persona.get('datosPersonales.genero'));
    }

    get pais() { return this.persona.get('datosContacto.pais')?.value; }   
    get provincia() { return this.persona.get('domicilio.provincia')?.value; }
   
    onInfoReceivedCalendario(event: any) {
      this.persona.get('datosPersonales.f_nacimiento')?.setValue(event);
     
    }
    onFechaSeleccionada(fecha: Date) {
       this.persona.get('datosPersonales.f_nacimiento')?.setValue(event);
    }
  ngOnInit(): void {    
    this.setupValueChanges();
      this.onPaisChange(this.persona.get('datosContacto.pais')!.value);
    // reaccioná a cambios de país
    this.persona.get('datosContacto.pais')!.valueChanges.subscribe(v => this.onPaisChange(v));
  }
  // helper para requeridos dinámicos
    private setRequired(controlPath: string, required: boolean) {
      const c = this.persona.get(controlPath);
      if (!c) return;
      const validators = c.validator ? [c.validator] : [];
      const base = validators.filter(v => v !== Validators.required);
      c.setValidators(required ? [Validators.required, ...base] : base);
      c.updateValueAndValidity({ emitEvent: false });
    }

    onPaisChange(pais: string) {
      const provCtrl = this.persona.get('domicilio.provincia')!;

      // no tocar si ya hay un valor (ej: el default inicial)
      if (!provCtrl.value) {
        if (pais === 'Argentina') {
          // podés fijar un default local si querés
          provCtrl.setValue('Ciudad Autónoma de Buenos Aires');
        } else {
          provCtrl.setValue(''); // o null si preferís
        }
      }

  // requeridos
  this.setRequired('domicilio.provincia', true);
    }

  setupValueChanges(): void {
    this.persona.get('nombres')?.valueChanges.subscribe(value => {
      this.persona.get('nombres')?.setValue(value.toLowerCase(), { emitEvent: false });
    });
    this.persona.get('apellidos')?.valueChanges.subscribe(value => {
      this.persona.get('apellidos')?.setValue(value.toLowerCase(), { emitEvent: false });
    });
     this.persona.get('datosContacto.email')?.valueChanges.subscribe(v =>
      this.persona.get('datosContacto.email')?.setValue((v || '').toLowerCase(), { emitEvent: false })
    );
    this.persona.get('datosContacto.email')?.valueChanges.subscribe(v =>
      this.persona.get('datosContacto.email')?.setValue((v || '').toLowerCase(), { emitEvent: false })
    );
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    //console.log(filterValue)
    //console.log(this.options)
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
 
  
  limpiarFormulario(){
    this.resetRegistroPersona();
  }
  
  resetRegistroPersona(){
    this.persona= new UntypedFormGroup({
    nombres: new UntypedFormControl({ value: "",  disabled: this.isEnabled}, [Validators.required, Validators.minLength(PERSONA_VALIDATION.NOMBRES_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.NOMBRES_VALIDATION.maxLength)]),
    apellidos: new UntypedFormControl({ value: "",  disabled: this.isEnabled},  [Validators.required, Validators.minLength(PERSONA_VALIDATION.APELLIDOS_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.APELLIDOS_VALIDATION.maxLength)]),
    domicilio: new UntypedFormGroup({
      calle: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
      numero: new UntypedFormControl({ value: null,  disabled: this.isEnabled}),
      piso: new UntypedFormControl({ value: null,  disabled: this.isEnabled}),
      departamento: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
      barrio: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
      ciudad: new UntypedFormControl({ value: "",  disabled: this.isEnabled}),
      provincia: new UntypedFormControl({ value: "Ciudad Autónoma de Buenos Aires",  disabled: this.isEnabled},Validators.required),
      codigoPostal: new UntypedFormControl({ value: "",  disabled: this.isEnabled})
    }),
    datosContacto: new UntypedFormGroup({
      pais: new UntypedFormControl({ value: "Argentina",  disabled: this.isEnabled}, Validators.required),
      email: new UntypedFormControl({ value: '',  disabled: this.isEnabled}, [Validators.minLength(PERSONA_VALIDATION.EMAIL_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.EMAIL_VALIDATION.maxLength),Validators.email]),
      telefono_movil: new UntypedFormControl({ value: '',  disabled: this.isEnabled}, [Validators.required,Validators.minLength(PERSONA_VALIDATION.TELEFONO_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.TELEFONO_VALIDATION.maxLength)]),
      telefono_fijo: new UntypedFormControl({ value: '',  disabled: this.isEnabled})
    }),
    identificacion: new UntypedFormGroup({
      dni: new UntypedFormControl({ value: '',  disabled: this.isEnabled}, [Validators.minLength(PERSONA_VALIDATION.DNI_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.DNI_VALIDATION.maxLength)]),
      
    }),
    datosPersonales: new UntypedFormGroup({
      genero: new UntypedFormControl({ value: 'otro',  disabled: this.isEnabled}, Validators.required),
      f_nacimiento: new UntypedFormControl({ value: '',  disabled: this.isEnabled}),
      profesion: new UntypedFormControl({ value: '',  disabled: this.isEnabled})
    }),
    estado: new UntypedFormGroup({
      afiliado: new UntypedFormControl({ value: false,  disabled: this.isEnabled}, Validators.required),
      bbdd_lla: new UntypedFormControl({ value: false,  disabled: this.isEnabled}),
      en_whatsaap: new UntypedFormControl({ value: false,  disabled: this.isEnabled}),
    }),
    observaciones: new UntypedFormControl('')
  });
  }

 
  private formatDateForApi(date: Date): string {
  // normaliza a UTC al inicio del día local
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return d.toISOString().split('T')[0]; // yyyy-MM-dd
} 
private toTitleCase(s: string = ''): string {
        return s.replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
        );
      }
guardarPersona(){
   if (this.persona.invalid) {
    swal.fire('Formulario incompleto', 'Por favor completá los campos obligatorios', 'warning');
    return;
  }
  // Tomar todos los valores (incluyendo deshabilitados)
  const formValue = this.persona.getRawValue();

  // Filtrar para no enviar vacíos ni nulls
  const datosLimpios: any = {};

 
  const limpiarObjeto = (obj: any) => {
     const resultado: any = {};
    for (const key in obj) {
      const val = obj[key];

      if (val === null || val === '' || val === undefined) continue;

      // ⬅️ conservar fechas
      if (val instanceof Date) {
        resultado[key] = this.formatDateForApi(val);
        continue;
      }

      if (typeof val === 'object' && !Array.isArray(val)) {
        const sub = limpiarObjeto(val);
        if (Object.keys(sub).length > 0) resultado[key] = sub;
      } else {
        resultado[key] = val;
      }
    }
    return resultado;
  };

  Object.assign(datosLimpios, limpiarObjeto(formValue));

  if (Object.keys(datosLimpios).length === 0) {
    swal.fire('Sin datos', 'No hay campos para enviar', 'info');
    return;
  }

  const nombreMostrar = `${this.toTitleCase(this.persona?.value.nombres)} ${this.toTitleCase(this.persona?.value.apellidos)}`;
  const mensaje = `${nombreMostrar} baja correctamente`;

  this._personaService.registro_persona(datosLimpios).subscribe({
    next: (response) => {
      this.dialogRef.close({ finalizado: true, data: {response,mensaje} });
    },
    error: (e: HttpErrorResponse) => {
      const payload = (e.error || {}) as any;
      const titulo = payload.mensaje || `Error ${e.status || ''}`.trim();
      const detalle = payload.error || e.message || 'Ocurrió un error';
      // Intentar extraer el path del campo (después de ": ")
        const pathMatch = typeof detalle === 'string' ? detalle.split(':').pop()?.trim() : undefined;
        if (pathMatch) {
          const ctrl = this.persona.get(pathMatch);
          if (ctrl) {
            ctrl.setErrors({ requiredFromBack: true });
            ctrl.markAsTouched();
          }
        }
      swal.fire(titulo, detalle, 'error');
      console.error(e);
    }
  });
} 

onDateChange(event: any) {
  //console.log("event", event.value)
  this.onInfoReceivedCalendario(event.value);
}

cancelar(): void {
        swal.fire({
        title: 'Se canceló',
        icon: 'error',
        iconColor: '#b71c1c',
        showConfirmButton: false,
        timer: 500,
        timerProgressBar: true,
        background: '#fff'
      });
      this.dialogRef.close({ finalizado: false });
    }
}