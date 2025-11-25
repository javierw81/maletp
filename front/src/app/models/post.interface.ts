export interface QueryParams {
  limit?: number;               
  offset?: number;              
  sortBy?: 'fecha' | 'likes' ; 
  usuarioId?: string;
  nombreUsuario?:string;          
  deporte?: Deporte;           
  tipoPublicacion?: TipoPublicacion; 
}

export const TIPOS_PUBLICACION = ['consulta', 'partido', 'logro'] as const;
export const DEPORTES = [
  'Fútbol', 'Básquet', 'Vóley', 'Tenis', 'Running', 'Ciclismo', 
  'Natación', 'Baseball', 'Béisbol', 'Bádminton', 'Pádel', 
  'Rugby', 'Judo', 'Hockey', 'Otro'
] as const;

export type Deporte = typeof DEPORTES[number];
export type TipoPublicacion = typeof TIPOS_PUBLICACION[number];

export interface Post {
  _id: string;
  titulo: string;
  mensaje: string;
  createdAt: string;
  deporte: string;
  postImgUrl: string;
  tipoPublicacion: string;
  meGusta: string[]; 
  comentarios: any[];
  usuarioId: { 
    _id: string;
    nombreUsuario: string;
    perfilImgUrl: string;
  };
}

export interface CreatePostPayload {
  titulo: string;
  mensaje: string;
  tipoPublicacion: typeof TIPOS_PUBLICACION[number];
  deporte: typeof DEPORTES[number];
}

export interface Comment {
  _id: string;
  mensaje: string;
  usuarioId: { 
    _id: string;
    nombreUsuario: string;
    perfilImgUrl: string;
  };
  modificado: boolean;
  createdAt: Date;
}

export interface QueryParamsComments {
  limit: number;               
  offset: number;              
}