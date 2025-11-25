
// Middleware funcional

import { Request, Response, NextFunction } from 'express';
import rateLimit, { Options as RateLimitOptions } from 'express-rate-limit';

/**
 * Definicion de las opciones del
 * limiter
 *
 * @type {Partial<RateLimitOptions>}
 */
const limiterOptions: Partial<RateLimitOptions> = {
  windowMs: 5 * 60 * 1000,
  limit: 5, 
  message: 'Demasiados intentos de logueo, por favor intente después de 5 min',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  statusCode: 429,

  // clave unica para cada cliente, usamos su ip para el rate limit
  keyGenerator: (req: Request, res: Response): string => {
    const ip = req.ip || req.socket?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown-ip'; 

    return Array.isArray(ip) ? ip[0] : ip;
  },

  // Handler, se ejecuta cuando se excede el limite
  handler: (req: Request, res: Response, next: NextFunction, opcionesUsadas: RateLimitOptions) => {
    res.status(opcionesUsadas.statusCode).send(opcionesUsadas.message);
  },

}

const loginRateLimiter = rateLimit(limiterOptions); 

export function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  loginRateLimiter(req, res, next);
}

