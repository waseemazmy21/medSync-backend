export enum Gender {
  Male = 'male',
  Female = 'female',
}

export enum UserRole {
  Admin = 'Admin',
  DepartmentManager = 'DepartmentManager',
  Doctor = 'Doctor',
  Nurse = 'Nurse',
  Staff = 'Staff',
  Patient = 'Patient',
}

export type Shift = {
  days: (
    | 'saturday'
    | 'sunday'
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
  )[];
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
};

export enum BloodType {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}
