import { Component, OnInit, inject } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { DialogSeleccionColumnasComponent } from 'src/app/shared/dialog-seleccion-columnas/dialog-seleccion-columnas.component';
import swal from 'sweetalert2';
import Utils from '../../../shared/funcionesUtiles'
import Swal from 'sweetalert2';
import { Persona } from 'src/app/Interfaces/persona';
import { PersonaService } from 'src/app/services/persona.service';
import { DialogFiltroAvanzadoComponent } from 'src/app/shared/dialog-filtro-avanzado/dialog-filtro-avanzado.component';

@Component({
  selector: 'app-listar-baja-miembros',
  templateUrl: './listar-baja-miembros.component.html',
  styleUrl: './listar-baja-miembros.component.scss'
})
export class ListarBajaMiembrosComponent implements OnInit  {
    totalMiembros = 0;

    filtroAvanzado: any = null;
    
  
    public ListaOriginal : Persona[]=[];
      public Lista: any[] = [];
      public filtro_apellidos = '';
      public filtro_correo = '';
      Columnas: any[] = [];
      acciones: any[] = []; 
      readonly dialog = inject(MatDialog);
  
      eleccionSeleccionadaId: string = '';
      elecciones: any[] = [];
    
      
      columnasVisiblesIniciales: string[] = [
        "nombres",
        "apellidos",
        "dni",
        "celular",
        "motivo_baja",
        "updatedAt"
      ];
      columnasOriginal: any[] = [
      { columnaId: "nombres", renombrar: "Nombre" },
      { columnaId: "apellidos", renombrar: "Apellido" },
      { columnaId: "dni", renombrar: "DNI" },
      { columnaId: "celular", renombrar: "Celular" },
      { columnaId: "asignado", renombrar: "¿Asignado?" },
      { columnaId: "motivo_baja", renombrar: "Motivo Baja" },
      { columnaId: "en_grupo_wp", renombrar: "¿En Grupo WP?" },
      { columnaId: "updatedAt", renombrar: "Ultima modificacion" }
    ];
    
    constructor(
      private _personaService: PersonaService,
       
    ) {

    }
  
    async ngOnInit(): Promise<void> {      
      this.initializeData();
    }

    async initializeData(){
      this.loadMiembros();
      this.setColumnasIniciales();
    }

   loadMiembros(filtro: any = {}) {
        const filtroConEleccion = {
          ...filtro,
          baja: "true"
        };

        this._personaService.listar_personas_filtro(filtroConEleccion).subscribe(response => {
          this.ListaOriginal = response.data;
          this.Lista = this.transformarDetalle(this.ListaOriginal),
          this.totalMiembros=this.ListaOriginal.length
        });
    }

  
    setColumnasIniciales() {
      const claves = ['nombres', 'apellidos', 'dni','celular','motivo_baja' ,'updatedAt'];
     
      const columnasSeleccionadas = this.columnasOriginal
        .filter(col => claves.includes(col.columnaId));
  
      this.Columnas = [...columnasSeleccionadas];
    }
    
   
    
    
    transformarDetalle(miembros: Persona[]): any[] {
      return miembros.map(miem => ({
        id: miem._id,
        nombres: miem.nombres,
        apellidos: miem.apellidos,
        dni: miem.identificacion?.dni,
        celular: miem?.datosContacto?.telefono_movil || '',
        motivo_baja:miem.motivo_baja || '',
        observacion: miem.observaciones,
        en_grupo_wp: miem.estado?.en_whatsaap ? 'Sí' : 'No',
        updatedAt:Utils.formatearFechaHora(miem.updatedAt ?? '') || ''
      }));
    }  
  
   
    eliminarMiembro(miembro: any): void {
      console.log("miembro",miembro)
      Swal.fire({
        title: `¿Eliminar a ${miembro.nombres} ${miembro.apellidos}?`,
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e53935',
        cancelButtonColor: '#757575'
      }).then((result) => {
        if (result.isConfirmed) {
          this._personaService.eliminar_persona(miembro.id).subscribe({
            next: (response) => {
              Swal.fire('Eliminado', `${miembro.nombres} ${miembro.apellidos} fue eliminado correctamente.`, 'success');
              this.loadMiembros(); //  refrescar la lista
            },
            error: (error) => {
              console.error('Error al eliminar el miembro:', error);
              Swal.fire('Error', 'No se pudo eliminar el miembro.', 'error');
            }
          });
        }
      });
    }



    limpiarFiltros() {
     this.filtroAvanzado=null;
        this.setColumnasIniciales();
       this.loadMiembros();
 
     }
  
    openFiltroAvanzado() {
      const campos = this.Columnas.filter(col => col.columnaId !== 'perfil').map(col => ({
        key: col.columnaId,
        label: col.renombrar
      }));
  
      const dialogRef = this.dialog.open(DialogFiltroAvanzadoComponent, {
        minWidth: '700px',
        maxWidth: '900px',
        data: { fields: campos }
      });
  
      dialogRef.afterClosed().subscribe(filtros => {
        if (filtros) this.aplicarFiltro(filtros);
        this.initializeData();
      });
    }
  
    aplicarFiltro(filtros: any) {
    const filtrosLimpios = Object.fromEntries(
      Object.entries(filtros).filter(([_, val]) => val !== '' && val !== null && val !== undefined)
    );
      this.filtroAvanzado = filtrosLimpios;
      this.loadMiembros(filtrosLimpios);
  }
  
    openSeleccionColumnas() {
      const campos = this.columnasOriginal.filter(col => col.columnaId !== 'perfil');
      const seleccionadas = this.Columnas.filter(col => col.columnaId !== 'perfil').map(col => col.columnaId);
  
      const dialogRef = this.dialog.open(DialogSeleccionColumnasComponent, {
        width: '400px',
        data: {
          campos: campos.map(col => ({ key: col.columnaId, label: col.renombrar })),
          seleccionadas: seleccionadas
        }
      });
  
      dialogRef.afterClosed().subscribe((clavesSeleccionadas: string[]) => {
        if (clavesSeleccionadas) {
          const columnasSeleccionadas = this.columnasOriginal
            .filter(campo => clavesSeleccionadas.includes(campo.columnaId))
            .map(campo => ({ columnaId: campo.columnaId, renombrar: campo.renombrar, icon: campo.icon }));
  
          const columnaPerfil = { columnaId: "perfil", renombrar: "Ver Perfil", icon: () => "visibility" };
          this.Columnas = [...columnasSeleccionadas, columnaPerfil];
        }
      });
    } 

    mostrarMiembro(e:any){
      console.log("mostrarMiembro",e)
    }

    async VistaMiembro(eleccionMiembro: any){
        console.log("eleccionMiembro",eleccionMiembro)
        
    }

    editarMiembro(miembro: any): void {
      swal.fire({
        title: '¿Dar de alta al miembro?',
        text: `¿Querés reactivar a ${miembro.nombres} ${miembro.apellidos}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, dar de alta',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#009688',
        cancelButtonColor: '#e53935'
      }).then(result => {
        if (!result.isConfirmed) return;

        this._personaService.marcarComoAlta(miembro.id).subscribe({
          next: (response) => {
            swal.fire({
              title: 'Miembro reactivado',
              text: response?.mensaje || 'El miembro fue dado de alta correctamente',
              icon: 'success',
              confirmButtonColor: '#009688'
            }).then(() => {
              this.loadMiembros(); // Refresca listado
            });
          },
          error: (err) => {
            swal.fire({
              title: 'Error al reactivar miembro',
              text: err?.error?.mensaje || 'Ocurrió un error inesperado',
              icon: 'error',
              confirmButtonColor: '#e53935'
            });
          }
        });
      });
    }
}
