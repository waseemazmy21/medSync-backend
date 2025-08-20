import { PartialType } from "@nestjs/mapped-types";
import { PatientRegisterDto } from "src/auth/dto/register.dto";

export class UpdatePatientDto extends PartialType(PatientRegisterDto) { }