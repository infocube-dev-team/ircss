import { User } from "../models/User"
import {IService} from "../services/EnvironmentManager";

interface UserDataProvider extends IService {

  getOne(idUser:number):User

  //TODO parametri
  getList():User[]

  create(user:User):User

  /**
   * Metodo per aggiornare un utente
   *
   * @param id:string identificativo
   * @param user:User dati utente
   *
   */
  update( id: String | number, user: User ): Promise<any>

  delete(idUser: number | string):Promise<any>

  getToken(username:string, password:string, rememberMe: boolean):Promise<any>

  getLoggedUser():Promise<User>

  recoverPassword(email: string):Promise<any>

  recoverPasswordFinish(key: string, newPassword: string):Promise<any>

  //TODO PARAMETRI E RETURN
  logout():any

}

export default UserDataProvider;
