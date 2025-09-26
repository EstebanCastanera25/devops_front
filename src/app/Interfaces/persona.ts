

type C = Persona

export interface FiscalizacionResumen {
  _id:        string;  // ID de la fiscalización
  eleccion:   string;  // ID (o Eleccion) asociado
  tipo_fiscal: 'FISCAL MESA'| 'FISCAL GENERAL'| 'FISCAL ZONAL' | 'SIN ASIGNAR' // ajusta según tus enums
  // ...cualquier otro dato que necesites mostrar rápido
}

export interface Persona {
  _id?: string;
  nombres: string;
  apellidos: string;

  domicilio?: {
    calle?: string;
    numero?: number | null;
    piso?: number | null;
    departamento?: string;
    barrio?: string;
    ciudad?: string;
    provincia?: string;
    codigoPostal?: string;
  };

   datosContacto?: {
    email?: string | null;
    telefono_movil?: string | null;
    telefono_fijo?: string | null;
    pais?: string;
  };

  login?: {
    usuario?: string;
    password?: string;
    rol?: 'admin' | 'usuario' | 'colaborador';
    activo?: boolean;
    ultimoLogin?: string;
    intentosFallidos?: number;
    bloqueadoHasta?: string | null;
  };

  identificacion?: {
    dni?: number | null;
    extranjero?: boolean;
  };

  datosPersonales?: {
    genero?: 'Masculino' | 'Femenino' | 'Otro';
    f_nacimiento?: string;
    profesion?: string;
  };

  estado?: {
    afiliado?: boolean;
    bbdd_lla?: boolean;
    en_whatsaap?: boolean;
    baja?: boolean;
  };
  fiscalizaciones?: FiscalizacionResumen[]; 

  redesSociales?: {
    nombre: 'Instagram' | 'X' | 'Tiktok' | 'Facebook';
    url: string;
  }[];

  grupos?: {
    nombre: string;
  }[];

  rol?: 'admin' | 'usuario' | 'colaborador';
  observaciones?: string;
  foto_perfil?: string;
  modificadoPor?: string;
  usuario_alta?: string;
  motivo_baja?: string;
  usuario_baja?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;

  // Campos para mostrar nombre de usuario de alta/baja (opcional, de lógica del frontend)
  usuario_alta_nombre?: string;
  usuario_baja_nombre?: string;

  [key: string]: any;
}

export interface PersonaRespuesta {
    status:   number;
    mensaje:  string;
    cantidad: number;
    data?:     C[] ;
}