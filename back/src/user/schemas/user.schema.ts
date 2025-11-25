import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { HydratedDocument, type ObjectId } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema( {
    timestamps: true
})
export class User {
  
    _id: ObjectId;

    @Prop({ 
        required: true, 
        maxlength: 50, 
        trim: true })
    nombre: string;

    @Prop({ required: true, 
        maxlength: 50, 
        trim: true })
    apellido: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    correo: string;

    @Prop({
        required: true,
        unique: true,
        trim: true,
        maxlength: 50
    })
    nombreUsuario: string;

    @Prop({
        required: true,
        select: false,
    })
    passwordHash: string;

    @Prop({
        required: true,
    })
    fechaNacimiento: Date;

    @Prop({
        default: '',
        maxlength: 80,
    })
    descripcion: string;

    @Prop({
        default: 'usuario',
        enum: ['usuario', 'administrador'],
    })
    perfil: string;

    @Prop({ 
        required: true,
    })
    perfilImgUrl: string;

    // Campo para almacenar public_id de Cloudinary (necesario para eliminar imagen)
    @Prop({})
    cloudinaryPublicId?: string;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
