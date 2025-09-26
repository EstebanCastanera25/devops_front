import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Componentes compartidos
import { DialogSeleccionColumnasComponent } from './dialog-seleccion-columnas/dialog-seleccion-columnas.component';
import { DialogFiltroAvanzadoComponent } from './dialog-filtro-avanzado/dialog-filtro-avanzado.component';
import { DialogAnimationsComponent } from './dialog-animations/dialog-animations.component';
import { TablaPaginadaComponent } from './tabla-paginada/tabla-paginada.component';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './spinner/spinner.component';


@NgModule({
  declarations: [
    DialogSeleccionColumnasComponent,
    DialogFiltroAvanzadoComponent,
    DialogAnimationsComponent,
    TablaPaginadaComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    DialogSeleccionColumnasComponent,
    TablaPaginadaComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}