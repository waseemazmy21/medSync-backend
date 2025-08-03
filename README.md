
# Project TODOs

## Schema Enhancements
- [ ] Add Arabic fields in database schemas to support multi-language data storage (e.g., name_ar, description_ar).

## Validation & Error Handling
- [ ] Centralize validation message keys to ensure consistency across DTOs and validation logic.
  - [ ] Research and establish best practices for storing and managing validation message templates.
  - [x] Standardize API error response structure:
      ```json
      {
        "success": true | false,
        "messageKey": "string",
        "messageArgs": { ... },
        "data": { ... } | null,
        "errors": { ... } | null
      }
    ```
    Example:
      ```json
      {
        "success": true | false,
        "messageKey": "errors.minLength",
        "messageArgs": {
          "field": "password",
          "min": 8
        },
        "data": { ... } | null,
        "errors": { ... } | null
      }
    ```
- [ ] Ensure all errors (validation, business logic, server exceptions) adhere to this format.

## Middleware & Global Guards
- [x] Implement a gloabl guart to skip authentication.
- [ ] Implement a global guard to extract and attach the preferred language (e.g., `req.language`) from request headers.
  * This will enable context-aware message resolution.

## API Testing & Tool Compatibility

- [ ] Search for an API testing tool that supports team collaboration.
- [ ] Create A Collection and share it to test the API endpoints
- [ ] Test API responses using API testing tools (Postman, Insomnia) with scenarios including message key resolution.

## Localization

## Additional TODOs

```
