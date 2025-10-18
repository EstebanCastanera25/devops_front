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

  it('debería transformar persona con todos los campos', () => {
    const personaOriginal = mockPersonasResponse.data[0];
    const personaTransformada = component.transformarPersona(personaOriginal);

    expect(personaTransformada.nombres).toBe('Juan');
    expect(personaTransformada.apellidos).toBe('Pérez');
    expect(personaTransformada.email).toBe('juan@test.com');
    expect(personaTransformada.telefono_movil).toBe('+54 9 11 1234-5678');
    expect(personaTransformada.dni).toBe(12345678);
    expect(personaTransformada.extranjero).toBe('No');
    expect(personaTransformada.afiliado).toBe('Sí');
    expect(personaTransformada.en_whatsaap).toBe('Sí');
  });

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

  it('debería actualizar contadores correctamente', () => {
    component.ListaOriginal = mockPersonasResponse.data.map(p => component.transformarPersona(p));

    component.actualizarContadores();

    expect(component.totalMiembros).toBe(2);
    expect(component.totalMiembrosEnWpGeneral).toBe(1);
  });

  it('debería establecer columnas iniciales correctamente', () => {
    component.setColumnasIniciales();

    expect(component.Columnas.length).toBe(component.columnasVisiblesIniciales.length);
    
    component.columnasVisiblesIniciales.forEach(columnaId => {
      expect(component.Columnas.some(col => col.columnaId === columnaId)).toBe(true);
    });
  });

  it('debería aplicar filtros eliminando valores vacíos', () => {
    const filtros = { 
      nombres: 'Juan', 
      apellidos: '', 
      email: null,
      dni: undefined
    };

    personaService.listar_personas_filtro.and.returnValue(of(mockPersonasResponse));

    component.aplicarFiltro(filtros);

    // Debería llamar solo con 'nombres'
    expect(personaService.listar_personas_filtro).toHaveBeenCalledWith({ nombres: 'Juan' });
  });

  it('debería manejar errores al exportar', async () => {
    personaService.exportarPersonas.and.returnValue(
      throwError(() => new Error('Error de red'))
    );

    spyOn(Swal, 'fire');

    const resultado = await component.exportarPersonas({}, dialog);

    expect(resultado.data).toBe(false);
    expect(Swal.fire).toHaveBeenCalled();
  });

  // ==================== TESTS CON SERVICIOS MOCK ====================

  it('debería llamar al servicio para listar personas', () => {
    personaService.listar_personas_filtro.and.returnValue(of(mockPersonasResponse));

    component.loadPersonas();

    expect(personaService.listar_personas_filtro).toHaveBeenCalledWith({ baja: 'false' });
  });
});