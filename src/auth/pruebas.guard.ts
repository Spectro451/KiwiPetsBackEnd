import { CanActivate, Injectable } from "@nestjs/common";

@Injectable()
export class AccesoTotal implements CanActivate{
  canActivate(){
    return true;
  }
}