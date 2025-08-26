import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Department {
    @Prop({ required: true, unique: true, minlength: 3, maxlength: 50 })
    name: string;

    @Prop({ required: true, unique: true, minlength: 3, maxlength: 50 })
    nameAr: string;

    @Prop({ required: true, minlength: 10, maxlength: 255 })
    description: string;

    @Prop({ required: true, minlength: 10, maxlength: 255 })
    descriptionAr: string;

    @Prop({ required: true })
    appointmentFee: number;

    @Prop()
    image: string;

}

export const DepartmentSchema = SchemaFactory.createForClass(Department);


DepartmentSchema.virtual("staffCount", {
    ref: "User",
    localField: '_id',
    foreignField: "department",
    count: true
})

DepartmentSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'department'
})

DepartmentSchema.virtual('numberOfReviews')
    .get(function () {
        const reviews = this.get('reviews');
        return reviews ? reviews.length : 0;
    })


DepartmentSchema.virtual('averageRating').get(function () {
    const reviews = this.get('reviews');
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return sum / reviews.length;
});

