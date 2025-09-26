


export const PAISES: string[] = [
    'Alemania',
   'Arabia Saudita',
   'Argentina',
   'Australia',
   'Bélgica',
   'Bolivia',
   'Brasil',
   'Canadá',
   'Chile',
   'China',
   'Colombia',
   'Corea del Sur',
   'Cuba',
   'Ecuador',
   'Egipto',
   'España',
   'Estados Unidos',
   'Francia',
   'Guatemala',
   'Honduras',
   'India',
   'Indonesia',
   'Irán',
   'Italia',
   'Japón',
   'México',
   'Nicaragua',
   'Nigeria',
   'Noruega',
   'Países Bajos',
   'Panamá',
   'Paraguay',
   'Perú',
   'Polonia',
   'Reino Unido',
   'Rusia',
   'Sudáfrica',
   'Suecia',
   'Suiza',
   'Tailandia',
   'Turquía',
   'Uruguay',
   'Venezuela',
   'Otro'
   ]

export const PROVINCIAS_ARG: string[] = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán'
];
export const BARRIOS_CABA: string[] = [
  'Agronomía',
  'Almagro',
  'Balvanera',
  'Barracas',
  'Belgrano',
  'Boedo',
  'Caballito',
  'Chacarita',
  'Coghlan',
  'Colegiales',
  'Constitución',
  'Flores',
  'Floresta',
  'La Boca',
  'La Paternal',
  'Liniers',
  'Mataderos',
  'Monserrat',
  'Monte Castro',
  'Nueva Pompeya',
  'Núñez',
  'Palermo',
  'Parque Avellaneda',
  'Parque Chacabuco',
  'Parque Chas',
  'Parque Patricios',
  'Puerto Madero',
  'Recoleta',
  'Retiro',
  'Saavedra',
  'San Cristóbal',
  'San Nicolás',
  'San Telmo',
  'Vélez Sársfield',
  'Versalles',
  'Villa Crespo',
  'Villa del Parque',
  'Villa Devoto',
  'Villa General Mitre',
  'Villa Lugano',
  'Villa Luro',
  'Villa Ortúzar',
  'Villa Pueyrredón',
  'Villa Real',
  'Villa Riachuelo',
  'Villa Santa Rita',
  'Villa Soldati',
  'Villa Urquiza'
];

// Comunas oficiales de la Ciudad Autónoma de Buenos Aires (1 a 15)
export const COMUNAS_CABA: string[] = [
  'Comuna 1', 'Comuna 2', 'Comuna 3', 'Comuna 4', 'Comuna 5',
  'Comuna 6', 'Comuna 7', 'Comuna 8', 'Comuna 9', 'Comuna 10',
  'Comuna 11', 'Comuna 12', 'Comuna 13', 'Comuna 14', 'Comuna 15'
];

export const GENEROS: string[] = [
'Otro',
'Masculino',
'Femenino',
]


export const PERSONA_VALIDATION = {
    PASSWORD_VALIDATION: {
        minLength: 8,
        maxLength: 20,
    },
    DNI_VALIDATION: {
        minLength: 6,
        maxLength: 12,
    },
    NOMBRES_VALIDATION: {
        minLength: 2,
        maxLength: 50,
    },
    APELLIDOS_VALIDATION: {
        minLength: 2,
        maxLength: 50,
    },
    TELEFONO_VALIDATION: {
        minLength: 8,
        maxLength: 12,
        },
    EMAIL_VALIDATION: {
        minLength: 6,
        maxLength: 30,
    }
}

