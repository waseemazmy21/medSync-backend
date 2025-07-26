import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
  Admin = 'Admin',
  DepartmentManager = 'DepartmentManager',
  Doctor = 'Doctor',
  Nurse = 'Nurse',
  Staff = 'Staff',
  Patient = 'Patient',
}

@Schema({
  timestamps: true,
  discriminatorKey: 'role',
})
export class User {
  _id: string; // automatically mapped from _id
  @Prop({ required: true })
  dept_id: string;
  @Prop({ required: true, minlength: 3, maxlength: 30 })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ enum: ['male', 'female'] })
  gender: 'male' | 'female';

  @Prop({ enum: UserRole, required: true })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
