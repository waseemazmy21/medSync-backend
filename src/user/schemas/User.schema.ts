import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Gender, UserRole } from "src/common/types";

export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    discriminatorKey: 'role',
})
export class User {
    @Prop({ required: true, minlength: 3, maxlength: 50 })
    name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ required: true, unique: true })
  phone: string;

    @Prop({ required: true, enum: Gender })
    gender: Gender;
  @Prop()
  _id?: string;
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
