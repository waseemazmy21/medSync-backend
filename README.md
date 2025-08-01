Add Arabic fields in schemas

Ensure all endpoints follow the structure

json
Copy
Edit
{
  "success": true | false,
  "message": "string",
  "data": { ... } | null,
  "errors": { ... } | null
}
Attach language field in req using global guard

Test with API tools

Ensure compatibility with bruno / API Dog

Appointment Schema
- date
- patient
- doctor
- departmetn
- notes 
- prescription {
  medicine
  dose
}
- follow up date

- create (patient)
- read (patient & doctor & admin)
- update (doctor -> notes & prescription & follow up date & patient -> date ((24 hours before date)))
- delete (patient (24 hours before date))