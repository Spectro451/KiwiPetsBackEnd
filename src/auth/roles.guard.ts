import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate{
  constructor(private reflector:Reflector){}

  canActivate(context: ExecutionContext):boolean{
    //consigue los roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    //si no requiere rol permite acceso
    if (!requiredRoles) return true; 

    //Consigue el usuario
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    //si no hay usuario bloquea todo
    if(!user)return false;

    //si es admin tiene acceso a todo
    if(user.admin)return true;

    //permite el acceso si cumple con el tipo
    return requiredRoles.includes(user.tipo);
  }
}