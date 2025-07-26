import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/User.schema';
import { Patient, PatientSchema } from './schemas/Patient.schema';
import { Doctor, DoctorSchema } from './schemas/Doctor.schema';
import { Nurse, NurseSchema } from './schemas/Nurse.schema';
import { Staff, StaffSchema } from './schemas/Staff.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        discriminators: [
          { name: Patient.name, schema: PatientSchema },
          { name: Doctor.name, schema: DoctorSchema },
          { name: Nurse.name, schema: NurseSchema },
          { name: Staff.name, schema: StaffSchema }
        ]
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
