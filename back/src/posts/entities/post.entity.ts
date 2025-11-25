import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types, type ObjectId } from "mongoose";

export type PostDocument = HydratedDocument<Post>;
export type ComentarioDocument = HydratedDocument<Comentario>;

@Schema({ 
    timestamps: true 
})
export class Comentario {

    @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
    _id: Types.ObjectId;

    @Prop({ required: true })
    mensaje: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    usuarioId: Types.ObjectId;

    @Prop({ default: false })
    modificado?: boolean;

    @Prop()
    createdAt: Date;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);

@Schema( {
    timestamps: true
})
export class Post {
    _id: ObjectId;
   
    @Prop({ 
        required: true, 
        type: Types.ObjectId, 
        ref: 'User'})
    usuarioId: Types.ObjectId;

    @Prop({ 
        required: true, 
        maxlength: 50, 
        trim: true })
    titulo: string;

    @Prop({
        required: true, 
        maxlength: 150,
    })
    mensaje: string;

    @Prop({
        default: 'consulta',
        enum: ['consulta', 'partido', 'logro'],
    })
    tipoPublicacion: string;

    @Prop({
        required: true,
        enum: [
            'Fútbol',
            'Básquet',
            'Vóley',
            'Tenis',
            'Running',
            'Ciclismo',
            'Natación',
            'Baseball',
            'Béisbol',
            'Bádminton',
            'Pádel',
            'Rugby',
            'Judo',
            'Hockey',
            'Otro'
        ]
    })
    deporte: string;

    @Prop({ 
    })
    postImgUrl?: string;

    @Prop({})
    cloudinaryPublicId?: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    meGusta: Types.ObjectId[];

    @Prop({ type: [ComentarioSchema], default: [] })
    comentarios: Comentario[];

    @Prop({ default: false })
    borradoLogico: boolean;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

