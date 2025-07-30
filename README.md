✅ TODO
debug your guard

Add Arabic fields in schemas

Centralize validation messages

Research best practices (Markos search) for storing validation messages.

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