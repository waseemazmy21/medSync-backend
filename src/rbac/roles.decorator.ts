import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/types';
export const ROLES_KEY = 'roles';

/**
 * @param Role.role_name
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
