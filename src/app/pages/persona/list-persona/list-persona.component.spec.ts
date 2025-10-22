import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // ← Agregar esto
import { of, throwError } from 'rxjs';
import { ListPersonaComponent } from './list-persona.component';
import { PersonaService } from '../../../services/persona.service';
import Swal from 'sweetalert2';


describe('ListPersonaComponent', () => {
  let component: ListPersonaComponent;
  let fixture: ComponentFixture<ListPersonaComponent>;
  let personaService: jasmine.SpyObj<PersonaService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;

  const mockPersonasResponse = {
    mensaje: 'Miembros listados',
    cantidad: 2,
    data: [
      {
        _id: '1',
        nombres: 'Juan',
        apellidos: 'Pérez',
        datosContacto: {
          email: 'juan@test.com',
          telefono_movil: '+54 9 11 1234-5678',
          telefono_fijo: null
        },
        identificacion: {
          dni: 12345678,
          extranjero: false
        },
        datosPersonales: {
          genero: 'Masculino',
          f_nacimiento: '1990-01-15',
          profesion: 'Desarrollador'
        },
        estado: {
          baja: false,
          afiliado: true,
          en_whatsaap: true,
          bbdd_lla: false
        },
        rol: 'usuario',
        grupos: [],
        redesSociales: [],
        domicilio: {
          calle: 'Av. Corrientes',
          numero: 1234,
          ciudad: 'CABA'
        },
        observaciones: 'Ninguna'
      },
      {
        _id: '2',
        nombres: 'María',
        apellidos: 'González',
        datosContacto: {
          email: 'maria@test.com',
          telefono_movil: '+54 9 11 9876-5432',
          telefono_fijo: null
        },
        identificacion: {
          dni: 87654321,
          extranjero: false
        },
        datosPersonales: {
          genero: 'Femenino',
          f_nacimiento: '1995-05-20',
          profesion: 'Diseñadora'
        },
        estado: {
          baja: false,
          afiliado: false,
          en_whatsaap: false,
          bbdd_lla: true
        },
        rol: 'admin',
        grupos: ['grupo1'],
        redesSociales: [{ nombre: 'Instagram', url: 'https://instagram.com' }],
        domicilio: {
          calle: 'Av. Rivadavia',
          numero: 5678,
          ciudad: 'CABA'
        },
        observaciones: ''
      }
    ]
  };

  beforeEach(async () => {
    const personaServiceSpy = jasmine.createSpyObj('PersonaService', [
      'listar_personas_filtro',
      'exportarPersonas'
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ListPersonaComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: PersonaService, useValue: personaServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ← Agregar esto
    }).compileComponents();

    fixture = TestBed.createComponent(ListPersonaComponent);
    component = fixture.componentInstance;
    personaService = TestBed.inject(PersonaService) as jasmine.SpyObj<PersonaService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  // ==================== TESTS BÁSICOS ====================
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con valores por defecto', () => {
    expect(component.totalMiembros).toBe(0);
    expect(component.totalMiembrosEnWpGeneral).toBe(0);
    expect(component.Lista).toEqual([]);
    expect(component.ListaOriginal).toEqual([]);
  });

  // ==================== TESTS QUE NO REQUIEREN RENDERIZAR ====================

  it('debería manejar campos vacíos o null en transformarPersona', () => {
    const personaVacia = {
      _id: '3',
      nombres: 'Test',
      apellidos: 'Usuario',
      datosContacto: {},
      identificacion: {},
      datosPersonales: {},
      estado: {},
      rol: '',
      grupos: [],
      redesSociales: [],
      domicilio: null,
      observaciones: ''
    };

    const resultado = component.transformarPersona(personaVacia);

    expect(resultado.email).toBe('');
    expect(resultado.telefono_movil).toBe('');
    expect(resultado.dni).toBe('');
    expect(resultado.extranjero).toBe('No');
  });

  it('debería transformar género correctamente', () => {
    const personaMasculino = mockPersonasResponse.data[0];
    const personaFemenino = mockPersonasResponse.data[1];

    const transformadoM = component.transformarPersona(personaMasculino);
    const transformadoF = component.transformarPersona(personaFemenino);

    expect(transformadoM.genero).toBe('Hombre');
    expect(transformadoF.genero).toBe('Mujer');
  });

  it('debería formatear domicilio correctamente', () => {
    const persona = mockPersonasResponse.data[0];
    const transformada = component.transformarPersona(persona);

    expect(transformada.domicilio).toContain('Av. Corrientes');
    expect(transformada.domicilio).toContain('1234');
    expect(transformada.domicilio).toContain('CABA');
  });



});