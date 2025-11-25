
import * as dotenv from 'dotenv';

dotenv.config(); 

import { v2 as cloudinary } from 'cloudinary'; 

// Producción 
if (process.env.CLOUDINARY_URL) {

    cloudinary.config(process.env.CLOUDINARY_URL!)
} else {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
        secure: true
    })
}

// Desarrollo
if ( !process.env.CLOUDINARY_URL && (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET))  {

    console.warn('Credenciales incompletas. Configura correctamente cloudinary')
}

export { cloudinary }; 