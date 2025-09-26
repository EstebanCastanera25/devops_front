import { Component, OnInit,inject } from '@angular/core';
import { PersonaService } from '../../../services/persona.service';
import { Router } from '@angular/router';
import { Persona } from '../../../Interfaces/persona';


import { MatDialog } from '@angular/material/dialog';
import { DialogFiltroAvanzadoComponent } from 'src/app/shared/dialog-filtro-avanzado/dialog-filtro-avanzado.component';
import { DialogSeleccionColumnasComponent } from 'src/app/shared/dialog-seleccion-columnas/dialog-seleccion-columnas.component';
import Utils from 'src/app/shared/funcionesUtiles';
import { ImportarPersonaComponent } from '../importar-persona/importar-persona.component';
import { firstValueFrom } from 'rxjs';
import swal from 'sweetalert2';
import { CreatePersonaComponent } from '../create-persona/create-persona.component';
import { BajaMiembroComponent } from '../baja-miembro/baja-miembro.component';
import { EditPersonaComponent } from '../edit-persona/edit-persona.component';
import Swal from 'sweetalert2';
import { ProfilePersonaComponent } from '../profile-persona/profile-persona.component';

@Component({
  selector: 'app-list-persona',
  standalone: false,
  templateUrl: './list-persona.component.html',
  styleUrl: './list-persona.component.scss'
})
export class ListPersonaComponent implements OnInit {

  totalMiembros = 0;
  totalMiembrosEnWpGeneral=0;
  public ListaOriginal : Persona[]=[];
  public Lista: Persona[] = [];
  public filtro_apellidos = '';
  public filtro_correo = '';
 
  Columnas: any[] = [];
  readonly dialog = inject(MatDialog);

  
  columnasVisiblesIniciales: string[] = [
    'nombres',
    'apellidos',
    'telefono_movil',
    'dni',
    'email',
    'observaciones',
  ];
  columnasOriginal : any[] = [
    { columnaId: "nombres", renombrar: "Nombres", },
    { columnaId: "apellidos", renombrar: "Apellidos",  },
    { columnaId: "telefono_movil", renombrar: "Celular", },
    { columnaId: "telefono_fijo", renombrar: "Tel Fijo", },
    { columnaId: "dni", renombrar: "Dni", },
    { columnaId: "extranjero", renombrar: "Extranjero", },
    { columnaId: "email", renombrar: "Email", },
    { columnaId: "en_whatsaap", renombrar: "En WhatsAap", },
    { columnaId: "genero", renombrar: "Genero", },
    { columnaId: "bbdd_lla", renombrar: "Base Oficial", },  
    { columnaId: "grupos", renombrar: "Grupos", },
    { columnaId: "f_nacimiento", renombrar: "Fecha Nacimiento", },
    { columnaId: "edad", renombrar: "Edad", },
    { columnaId: "domicilio", renombrar: "Domicilio", },
    { columnaId: "afiliado", renombrar: "Afiliado", },
    { columnaId: "redesSociales", renombrar: "Redes Sociales", },
    { columnaId: "profesion", renombrar: "Profesion", },
    { columnaId: "observaciones", renombrar: "Observaciones", },
    { columnaId: "rol", renombrar: "Rol", },  
    { columnaId: "perfil", renombrar: "Ver Perfil", icon:function (){return "visibility"} }]
    exportarPersonas = async (_accion: any, dialog: MatDialog): Promise<any> => {
      try {
        
        const data: Blob = await firstValueFrom(
          this._personaService.exportarPersonas()
        );

        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const fecha = new Date().toISOString().split('T')[0];
        const nombreArchivo = `personas-${fecha}.xlsx`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nombreArchivo;
        link.click();
        URL.revokeObjectURL(link.href);

        return { origen: 'exportar', data: true };

      } catch (error) {
        console.error('Error al exportar personas:', error);
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo exportar el archivo',
          confirmButtonColor: '#d33'
        });

        return { origen: 'exportar', data: false };
      }
    }
    importarPersonas = async (_accion: any, dialog: MatDialog): Promise<any> => {
      const dialogRef = dialog.open(ImportarPersonaComponent, {
        width: '500px',
      });
      // Esperar a que se cierre el diálogo
      const resultado = await dialogRef.afterClosed().toPromise();
      if (resultado?.finalizado) {
          this.loadPersonas(); // solo si se importó correctamente
      }
    }

   customActions:any[]=[
    {
      nombre: "Exportar",
      funcion: () => this.exportarPersonas('', this.dialog)
    },
     {
       nombre: "Importar",
       funcion: () => this.importarPersonas('', this.dialog)
     }
  ]   
  
  constructor(
    private _personaService:PersonaService,
    private _router: Router,
     
  ) {
    
  }

  async ngOnInit(): Promise<void> {
    this.setColumnasIniciales();
    this.loadPersonas();
     
  }
  loadPersonas() {
    this._personaService.listar_personas_filtro({baja:"false"}).subscribe(personas => {
      
    this.ListaOriginal = personas.data.map((p: any) => this.transformarPersona(p));
    
    this.Lista = [...this.ListaOriginal];
    this.actualizarContadores();
    
  });
  }
  actualizarContadores(): void {

      // Totales por tipo de fiscal
      this.totalMiembros = this.ListaOriginal.length;

      // Asignados por tipo
      this.totalMiembrosEnWpGeneral = this.ListaOriginal.filter(f => f.estado?.en_whatsaap).length;
      
    }
  setColumnasIniciales() {
      const columnasSeleccionadas = this.columnasOriginal
        .filter(col => this.columnasVisiblesIniciales.includes(col.columnaId));
      

      this.Columnas = [...columnasSeleccionadas];
    }
  transformarPersona(persona: any): any {
  return {
    ...persona,
    email: persona.datosContacto?.email || '',
    telefono_movil: persona.datosContacto?.telefono_movil || '',
    telefono_fijo: persona.datosContacto?.telefono_fijo || '',
    dni: persona.identificacion?.dni || '',
    edad: Utils.calcularEdad(persona.datosPersonales?.f_nacimiento) || '',
    extranjero: persona.identificacion?.extranjero ? 'Sí' : 'No',
    afiliado: persona.estado?.afiliado ? 'Sí' : 'No',
    baja: persona.estado?.baja ? 'Sí' : 'No',
    en_whatsaap: persona.estado?.en_whatsaap ? 'Sí' : 'No',
    bbdd_lla: persona.estado?.bbdd_lla ? 'Sí' : 'No',
    f_nacimiento: persona.datosPersonales?.f_nacimiento
      ? new Date(persona.datosPersonales.f_nacimiento).toLocaleDateString()
      : '',
    genero: persona.datosPersonales?.genero?.toLowerCase() === 'masculino' ? 'Hombre' :
            persona.datosPersonales?.genero?.toLowerCase() === 'femenino' ? 'Mujer' :
            persona.datosPersonales?.genero?.toLowerCase() === 'otro' ? 'Otro' :
            persona.datosPersonales?.genero || '',
    profesion: persona.datosPersonales?.profesion || '',
    rol: persona.rol === 'admin' ? 'Administrador'
         : persona.rol === 'usuario' ? 'Usuario'
         : persona.rol || '',
    grupos: Array.isArray(persona.grupos) && persona.grupos.length > 0 ? 'Sí' : 'No',
    redesSociales: Array.isArray(persona.redesSociales) && persona.redesSociales.length > 0 ? 'Sí' : 'No',
    domicilio: persona.domicilio ? 
      `${persona.domicilio.calle || ''} ${persona.domicilio.numero || ''}, ${persona.domicilio.ciudad || ''}` : '',
  };
}
  
  VistaPersona(persona: any){
    console.log("persona",persona.dataRow._id)
    const dialogRef = this.dialog.open(ProfilePersonaComponent, {
              width: '900px',
              maxHeight:'800px', 
              data: String(persona.dataRow._id)
            });
          
              dialogRef.afterClosed().subscribe(result => {
              if (!result || !result.finalizado) return; 
    
              const { mensaje } = result;
                
              if (result?.finalizado) {
                swal.fire({
                  title: 'Miembro ',
                  text: mensaje || 'Miembro Modificado correctamente',
                  icon: 'success',
                  confirmButtonColor: '#009688'
                }).then(() => {
                  this.loadPersonas();
                });
              } 
            });
  }
  editarPersona(persona: any): void {
    const dialogRef = this.dialog.open(EditPersonaComponent, {
              width: '900px',
              maxHeight:'800px', 
              data: String(persona._id)
            });
          
              dialogRef.afterClosed().subscribe(result => {
              if (!result || !result.finalizado) return; // se canceló sin cambios
    
              const { mensaje } = result;
                
              if (result?.finalizado) {
                swal.fire({
                  title: 'Miembro Modificado',
                  text: mensaje || 'Miembro Modificado correctamente',
                  icon: 'success',
                  confirmButtonColor: '#009688'
                }).then(() => {
                  this.loadPersonas();
                });
              } else {
                swal.fire({
                  title: 'Error al modificar Miembro',
                  text: mensaje || 'Ocurrió un error inesperado',
                  icon: 'error',
                  confirmButtonColor: '#e53935'
                });
              }
            });
  }
  
  botonBorrarPersona(persona: any): void {  
    console.log("persona eliminar",persona)  
    const dialogRef = this.dialog.open(BajaMiembroComponent, {
        width: '400px',
        data: { persona}
      });
    
       dialogRef.afterClosed().subscribe((res?: {exito:boolean; nombres?:string; apellidos?:string}) => {
        if (res?.exito) {
          const nombres   = (res?.nombres   ?? persona?.nombres   ?? '').trim();
          const apellidos = (res?.apellidos ?? persona?.apellidos ?? '').trim();
          Swal.fire('Baja exitosa', `Se dio de baja a ${nombres} ${apellidos}`, 'success');
          this.loadPersonas();
        }
      });
  }


  crearMiembro(){
     const dialogRef = this.dialog.open(CreatePersonaComponent, {
              width: '900px',
              maxHeight:'800px', 
            });
          
              dialogRef.afterClosed().subscribe(result => {
              if (!result || !result.finalizado) return; // se canceló sin cambios
    
              const { mensaje } = result;
                
              if (result?.finalizado) {
                swal.fire({
                  title: 'Miembro Creado',
                  text: mensaje || 'Miembro Creado correctamente',
                  icon: 'success',
                  confirmButtonColor: '#009688'
                }).then(() => {
                  this.loadPersonas();
                });
              } else {
                swal.fire({
                  title: 'Error al crear Miembro',
                  text: mensaje || 'Ocurrió un error inesperado',
                  icon: 'error',
                  confirmButtonColor: '#e53935'
                });
              }
            });
  }

  openFiltroAvanzado() {
      const campos = this.Columnas
        .filter(col => col.columnaId !== 'perfil')
        .map(col => ({
          key: col.columnaId,
          label: col.renombrar
        }));

      const dialogRef = this.dialog.open(DialogFiltroAvanzadoComponent, {
        
        data: { fields: campos }
      });

      dialogRef.afterClosed().subscribe(filtros => {
        if (filtros) {
          this.aplicarFiltro(filtros);
        }
      });
    }

    aplicarFiltro(filtros: any) {
      // Elimina campos vacíos, null o undefined
        const filtrosLimpios = Object.fromEntries(
          Object.entries(filtros).filter(([_, val]) =>
            val !== '' && val !== null && val !== undefined
          )
        );
      this._personaService.listar_personas_filtro(filtrosLimpios).subscribe(response => {
        this.ListaOriginal = response.data.map((p: any) => this.transformarPersona(p));
        
        this.Lista = [...this.ListaOriginal];
      });
    }

    limpiarFiltros() {
      this.Lista = [...this.ListaOriginal];
      this.setColumnasIniciales();
      this.loadPersonas();

    }
    

    openSeleccionColumnas() {
    const campos = this.columnasOriginal.filter(col => col.columnaId !== 'perfil');
    const seleccionadas = this.Columnas
    .filter(col => col.columnaId !== 'perfil')
    .map(col => col.columnaId); // solo las claves

    const dialogRef = this.dialog.open(DialogSeleccionColumnasComponent, {
      width: '400px',
      data: {
      campos: campos.map(col => ({
        key: col.columnaId,
        label: col.renombrar
      })),
      seleccionadas: seleccionadas
    }
    });

    dialogRef.afterClosed().subscribe((clavesSeleccionadas: string[]) => {
    if (clavesSeleccionadas) {
      const columnasSeleccionadas = this.columnasOriginal
        .filter(campo => clavesSeleccionadas.includes(campo.columnaId))
        .map(campo => ({
          columnaId: campo.columnaId,
          renombrar: campo.renombrar,
          icon: campo.icon
        }));

      
      this.Columnas = [...columnasSeleccionadas];
    }
    });
  } 

}
