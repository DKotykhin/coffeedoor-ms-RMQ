import { SetMetadata } from '@nestjs/common';

import { RoleTypes } from '../../common/types/enums';

export const ROLES_KEY = 'roles';

export const HasRoles = (...roles: RoleTypes[]) =>
  SetMetadata(ROLES_KEY, roles);
