import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
    {
        path: 'pantallaCarga',
        loadComponent: () => import('./pages/pantalla-carga/pantalla-carga').then(m => m.PantallaCarga)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login),
        canActivate: [guestGuard]
    },
    {
        path: 'mi-perfil',
        loadComponent: () => import('./pages/mi-perfil/mi-perfil').then(m => m.MiPerfil),
        canActivate: [authGuard]
    },
    {
        path: 'publicaciones',
        loadComponent: () => import('./pages/publicaciones/publicaciones').then(m => m.Publicaciones),
        canActivate: [authGuard]
    },
    {
        path: 'publicacionDetalle/:id',
        loadComponent: () => import('./components/publicacion-detalle-component/publicacion-detalle-component').then(m => m.PublicacionDetalleComponent),
        canActivate: [authGuard]
    },
    {
        path: 'crearPublicacion',
        loadComponent: () => import('./components/crear-publicacion/crear-publicacion').then(m => m.CrearPublicacion),
        canActivate: [authGuard]
    },
    {
        path: 'registro',
        loadComponent: () => import('./pages/registro/registro').then(m => m.Registro),
        canActivate: [guestGuard]
    },
    { path: '', redirectTo: 'pantallaCarga', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
