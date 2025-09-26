import { Component, Inject, OnInit } from '@angular/core';
import {  UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../../services/persona.service';
import { Observable} from 'rxjs';
import { PAISES,GENEROS,PERSONA_VALIDATION, BARRIOS_CABA, PROVINCIAS_ARG } from 'src/app/shared/data';
import Utils from 'src/app/shared/funcionesUtiles';
import swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-persona',
  standalone: false,
  templateUrl: './edit-persona.component.html',
  styleUrl: './edit-persona.component.scss'
})
export class EditPersonaComponent implements OnInit{
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
    provincia: new UntypedFormControl({ value: "Ciudad Autónoma de Buenos Aires",  disabled: this.isEnabled}),
    codigoPostal: new UntypedFormControl({ value: "",  disabled: this.isEnabled})
    }),
    datosContacto: new UntypedFormGroup({
      pais: new UntypedFormControl({ value: "Argentina",  disabled: this.isEnabled}, Validators.required),
      email: new UntypedFormControl({ value: '',  disabled: this.isEnabled}, [Validators.minLength(PERSONA_VALIDATION.EMAIL_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.EMAIL_VALIDATION.maxLength),Validators.email]),
      telefono_movil: new UntypedFormControl({ value: '',  disabled: this.isEnabled}, [Validators.minLength(PERSONA_VALIDATION.TELEFONO_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.TELEFONO_VALIDATION.maxLength)]),
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
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialogRef: MatDialogRef<EditPersonaComponent>
    ){
      
      
    }
    
    get phoneError() {return Utils.getPhoneError(this.persona.get('datosContacto.telefono_movil'), PERSONA_VALIDATION.TELEFONO_VALIDATION.minLength, PERSONA_VALIDATION.TELEFONO_VALIDATION.maxLength);}
    get nameError() {return Utils.getNameError(this.persona.get('nombres'), PERSONA_VALIDATION.NOMBRES_VALIDATION.minLength, PERSONA_VALIDATION.NOMBRES_VALIDATION.maxLength);}
    get surnameError() { return Utils.getSurnameError(this.persona.get('apellidos'), PERSONA_VALIDATION.APELLIDOS_VALIDATION.minLength, PERSONA_VALIDATION.APELLIDOS_VALIDATION.maxLength);}
    get emailError() {return Utils.getEmailError(this.persona.get('datosContacto.email'), PERSONA_VALIDATION.EMAIL_VALIDATION.minLength, PERSONA_VALIDATION.EMAIL_VALIDATION.maxLength);}
    get dniError() {return Utils.getDniError(this.persona.get('identificacion.dni'), PERSONA_VALIDATION.DNI_VALIDATION.minLength, PERSONA_VALIDATION.DNI_VALIDATION.maxLength);}
    get fechaNacimientoError() {return Utils.fechaNacimientoError(this.persona.get('datosPersonales.f_nacimiento'));}
    get paisError() {return Utils.paisError(this.persona.get('datosContacto.pais'));}
    get generoError() {return Utils.generoError(this.persona.get('datosPersonales.genero'));}

    private toBool(v: any): boolean {
      if (typeof v === 'string') return ['si', 'sí', 'true', '1'].includes(v.toLowerCase());
      return !!v;
    }
    get pais() { return this.persona.get('datosContacto.pais')?.value; }
    get provincia() { return this.persona.get('domicilio.provincia')?.value; }

    private setRequired(path: string, required: boolean) {
      const c = this.persona.get(path);
      if (!c) return;
      const current = c.validator ? [c.validator] : [];
      const base = current.filter(v => v !== Validators.required);
      c.setValidators(required ? [Validators.required, ...base] : base);
      c.updateValueAndValidity({ emitEvent: false });
    }
    private norm(s: string = '') {
      return s.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    private canonizarProvincia(p?: string): string {
      const s = this.norm(p || '');
      if (!s) return '';
      // alias para CABA
      if (['caba','capital federal','ciudad autonoma de buenos aires'].includes(s)) {
        return 'Ciudad Autónoma de Buenos Aires';
      }
      // matchear contra catálogo ignorando acentos/caso
      const match = this.provincias_arg.find(x => this.norm(x) === s);
      return match ?? (p || '');
    }

    private esCABA(p?: string): boolean {
      const s = this.norm(p || '');
      return ['caba','capital federal','ciudad autonoma de buenos aires'].includes(s);
    }
    private toDate(v: any): Date | null {
      if (!v) return null;
      if (v instanceof Date) return v;
      // ISO → Date
      const iso = new Date(v);
      if (!isNaN(+iso)) return iso;
      // dd-MM-yyyy → Date UTC
      const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(String(v).trim());
      if (m) {
        const [, dd, mm, yyyy] = m.map(Number);
        return new Date(Date.UTC(yyyy, mm - 1, dd));
      }
      return null;
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
      this.wireUpPaisProvinciaRules(); 
    }
      private wireUpPaisProvinciaRules() {
        // País
        this.persona.get('datosContacto.pais')!.valueChanges.subscribe(() => {
          this.persona.patchValue({ domicilio: { provincia: '', ciudad: '', barrio: '' } }, { emitEvent: false });
        });

        // Provincia
        const provCtrl = this.persona.get('domicilio.provincia')!;
        const applyRules = (prov: string) => {
          if (this.esCABA(prov)) {                          //  CAMBIO (antes comparaba string literal)
            
            this.setRequired('domicilio.ciudad', false);
            this.setRequired('domicilio.barrio', false);
          } else {
            this.setRequired('domicilio.ciudad', false);
            this.setRequired('domicilio.barrio', false);
          }
        };

        applyRules(provCtrl.value);
        provCtrl.valueChanges.subscribe(applyRules);
      }

    inicializarDatos(){
        this.miembroId = this.data;
        if (!this.miembroId) return;
         
         this._personaService.obtener_persona(this.miembroId).subscribe({
          next: (res) => {
            console.log("res.data",res.data)
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
  
 
  
  limpiarFormulario(){
    this.resetRegistroPersona();
  }
  private cargarPersonaEnFormulario(p: any): void {

    const fNacRaw = this.toDate(p.datosPersonales?.f_nacimiento ?? p.f_nacimiento);
    const fNac = fNacRaw; 
    // 1) Domicilio seguro
    const dom = (p && typeof p.domicilio === 'object' && p.domicilio !== null)
      ? p.domicilio
      : { calle: p?.domicilio || '' };

    // ⬅️ CAMBIO: canonizamos la provincia para que matchee exactamente el catálogo
    let provincia = this.canonizarProvincia(dom.provincia);   // (antes: dom.provincia ?? '')
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

    // 4) Ajustar validaciones según provincia resultante
    if (this.esCABA(provincia)) {                               // CAMBIO
      this.persona.get('domicilio.ciudad')?.setValue('', { emitEvent: false });
      this.setRequired('domicilio.ciudad', false);
      this.setRequired('domicilio.barrio', false);
    } else {
      this.setRequired('domicilio.ciudad', false);
      this.setRequired('domicilio.barrio', false);
    }
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
      provincia: new UntypedFormControl({ value: "Ciudad Autónoma de Buenos Aires",  disabled: this.isEnabled}),
      codigoPostal: new UntypedFormControl({ value: "",  disabled: this.isEnabled})
    }),
    datosContacto: new UntypedFormGroup({
      pais: new UntypedFormControl({ value: "Argentina",  disabled: this.isEnabled}, Validators.required),
      email: new UntypedFormControl({ value: '',  disabled: this.isEnabled}, [Validators.minLength(PERSONA_VALIDATION.EMAIL_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.EMAIL_VALIDATION.maxLength),Validators.email]),
      telefono_movil: new UntypedFormControl({ value: '',  disabled: this.isEnabled}, [Validators.minLength(PERSONA_VALIDATION.TELEFONO_VALIDATION.minLength),Validators.maxLength(PERSONA_VALIDATION.TELEFONO_VALIDATION.maxLength)]),
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

 
  

guardarPersona(){

   if (this.persona.invalid) {
    swal.fire('Formulario incompleto', 'Por favor completá los campos obligatorios', 'warning');
    return;
  }

  // CAMBIO 1: tomar TODO el formulario, sin “limpiar”
  const payload = this.persona.getRawValue();

  // CAMBIO 2 (opcional pero recomendado): castear campos numéricos vacíos a null
  if (payload?.domicilio) {
    const d = payload.domicilio as any;
    d.numero       = d.numero === '' ? null : d.numero;
    d.piso         = d.piso   === '' ? null : d.piso;
    // si querés, también asegurás strings vacíos para el resto:
    d.calle        = d.calle ?? '';
    d.departamento = d.departamento ?? '';
    d.barrio       = d.barrio ?? '';
    d.ciudad       = d.ciudad ?? '';
    d.provincia    = d.provincia ?? '';
    d.codigoPostal = d.codigoPostal ?? '';
  }


  this._personaService.actualizar_persona(this.miembroId ,payload ).subscribe({
    next: (response) => {
      this.dialogRef.close({ finalizado: true, data: response });
    },
    error: (error) => {
      swal.fire('Error', 'No se pudo guardar la persona', 'error');
      console.error(error);
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
