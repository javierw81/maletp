import { Injectable } from '@nestjs/common';
import { cloudinary } from './cloudinary.config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';


@Injectable()
export class CloudinaryService {

    
    /**
     * Subir imagen de perfil a cloudinary en la carpeta
     * red-social/perfilImagen
     *
     * @async
     * @param {Express.Multer.File} file 
     * @returns {Promise<UploadApiResponse | UploadApiErrorResponse>} 
     */
    async uploadImage(
        file: Express.Multer.File
    ) : Promise<UploadApiResponse | UploadApiErrorResponse>  {
        
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream( 
                {
                    resource_type: 'auto', 
                    folder: 'red-social/perfilImagen',
                    transformation: [
                        {width: 300, heigth: 300, crop: 'fill'},
                        { quality: 'auto'}
                    ]
                }, 
                (error, result) => {
                    if (error) return reject(error); 
                    if (result) resolve(result); 
                }
            ).end(file.buffer);
        })
    }

    
    /**
     * Subir imagen de un post a cloudinary en la carpeta
     * red-social/publicacionImagen
     *
     * @async
     * @param {Express.Multer.File} file 
     * @returns {Promise<UploadApiResponse | UploadApiErrorResponse>} 
     */
    async uploadImagePost(
        file: Express.Multer.File
    ) : Promise<UploadApiResponse | UploadApiErrorResponse>  {
        
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream( 
                {
                    resource_type: 'auto', 
                    folder: 'red-social/publicacionImagen',
                    transformation: [
                        {width: 500, heigth: 500, crop: 'fill'},
                        { quality: 'auto'}
                    ]
                }, 
                (error, result) => {
                    if (error) return reject(error); 
                    if (result) resolve(result); 
                }
            ).end(file.buffer);
        })
    }
}



