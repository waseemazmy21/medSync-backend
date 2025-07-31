import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
    @Prop({ required: true, unique: true, minlength: 3, maxlength: 50 })
    name: string;

    @Prop({ required: true, unique: true, minlength: 3, maxlength: 50 })
    nameAr: string;

    @Prop({ required: true, minlength: 10, maxlength: 255 })
    description: string;

    @Prop({ required: true, minlength: 10, maxlength: 255 })
    descriptionAr: string;

    @Prop()
    image: string;

    @Prop({ default: 0, min: 0, max: 5 })
    averageRating: number;

    @Prop({ default: 0, min: 0 })
    numberOfReviews: number;

    @Prop({ default: 0, min: 0 })
    staffCount: number;

}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
