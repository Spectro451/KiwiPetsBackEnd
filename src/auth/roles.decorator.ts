import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles';

export const Roles = (...roles:('Adoptante'|'Refugio')[])=> SetMetadata(ROLES_KEY,roles);