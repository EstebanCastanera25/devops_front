import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { PersonaRoutes } from './persona.routing';

// Clientes
import { ListPersonaComponent } from './list-persona/list-persona.component';
import { CreatePersonaComponent } from './create-persona/create-persona.component';
import { EditPersonaComponent } from './edit-persona/edit-persona.component';
import { ProfilePersonaComponent } from './profile-persona/profile-persona.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImportarPersonaComponent } from './importar-persona/importar-persona.component';
import { BajaMiembroComponent } from './baja-miembro/baja-miembro.component';
import { ListarBajaMiembrosComponent } from './listar-baja-miembros/listar-baja-miembros.component'; 

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PersonaRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    SharedModule,    
  ],
  declarations: [
    ListPersonaComponent,
    CreatePersonaComponent,
    EditPersonaComponent,
    ProfilePersonaComponent,
    ImportarPersonaComponent,
    BajaMiembroComponent,
    ListarBajaMiembrosComponent,

  ],
})
export class PersonaModule {}
