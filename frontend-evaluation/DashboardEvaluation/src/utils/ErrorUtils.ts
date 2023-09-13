import { errorToast, successToast } from "../services/NotificationManager"
import { reloadApp } from "../shared/router"
import { __ } from "../translations/i18n"

interface ErrorRes {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  message: string
  path: string
}

class ErrorUtils {

  /** 
   * Verifica se obj è di tipo ErrorRes 
   * @param obj
  */
  static isErrorRes = (obj: any): obj is ErrorRes => {
    return (
      obj &&
      typeof obj.type === 'string' &&
      typeof obj.title === 'string' &&
      typeof obj.status === 'number' &&
      typeof obj.detail === 'string' &&
      typeof obj.instance === 'string' &&
      typeof obj.message === 'string' &&
      typeof obj.path === 'string'
    );
  }

  /**
   * Verifica che la call api non vada in errore
   * @param apiCall 
   * @param successMessage
   * @param successCallback
   */
  static catchError = async (apiCall: Promise<any>, successMessage: string, successCallback: () => void) => {
    try {
      const res = await apiCall;
      if (this.isErrorRes(res)) {
        throw new Error(res.detail);
      }
      successToast(__('common.success'), successMessage);
      successCallback();
    } catch (error: any) {
      errorToast(__('common.error'), error.message)
    } 
  }

}

export default ErrorUtils;