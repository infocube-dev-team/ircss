import {notification, Modal, message, ModalFuncProps} from "antd";
import {ArgsProps} from "antd/lib/notification/interface";
import {ArgsProps as ArgsProps2} from "antd/lib/message";
import {EnvironmentManager, IService} from "./EnvironmentManager";
import {addAction} from "./HooksManager";
import {__} from "../translations/i18n";

/**
 *
 */
class NotificationManager implements IService {

    environmentManager: EnvironmentManager | undefined = undefined;

    getServiceKey(): string {
        return 'notificationManager'
    }

    /**
     * Init
     */
    init = async (environmentManager: EnvironmentManager) => {

        this.environmentManager = environmentManager

        // Registro hook di notifica
        this.registerHooks()
    }

    registerHooks = () => {
        this.registerErrorHooks()
    }

    /**
     * Registro hooks per i casi di errori
     */
    registerErrorHooks = () => {
        addAction('api_response_error', this.toastApiError);
    }

    /**
     * Genera toast per API errors
     * @param error
     */
    toastApiError = (error: any) => {
        errorToast(
            __('common.api'),
            __(`error.api`, {
                error_message: error.message,
                method: error.config.method.toUpperCase(),
                api: error.config.url
            }),
        )
    }

}

const notificationManager = new NotificationManager();
export default notificationManager;

const defaultToastConf = (title: string, description: string) => {
    return {
        message: title,
        description: description,
        placement: 'bottomRight',
        className: 'notification',
    };
}

/**
 * Toast di errore
 * @param title:string
 * @param  description:string
 * @param extConfig:ArgsProps configurazione toast extra
 */
export const errorToast = (title: string, description: string, extConfig: ArgsProps | undefined = undefined) => {
    toast(Object.assign(
        defaultToastConf(title, description), {
            type: 'error'
        }, extConfig)
    );
}

/**
 * Toast di warning
 * @param title:string
 * @param  description:string
 * @param extConfig:ArgsProps configurazione toast extra
 */
export const warningToast = (title: string, description: string, extConfig: ArgsProps | undefined = undefined) => {
    toast(Object.assign(
        defaultToastConf(title, description), {
            type: 'warning'
        }, extConfig)
    );
}

/**
 * Toast di successo
 * @param title:string
 * @param  description:string
 * @param extConfig:ArgsProps configurazione toast extra
 */
export const successToast = (title: string, description: string, extConfig: ArgsProps | undefined = undefined) => {
    toast(Object.assign(
        defaultToastConf(title, description), {
            type: 'success'
        }, extConfig)
    );
}

/**
 * Toast generico
 * @param title:string
 * @param  description:string
 * @param extConfig:ArgsProps configurazione toast extra
 */
export const infoToast = (title: string, description: string, extConfig: ArgsProps | undefined = undefined) => {
    toast(Object.assign(
        defaultToastConf(title, description), {
            type: 'info'
        }, extConfig)
    );
}

/**
 * Metodo per poter gestire dinamicamente la visualizzazione di Toast tramite apposita config,
 * è presente la possibilità di customizzare un Toast
 * @param toastConfig:ArgsProps configurazione toast
 */
export const toast = (toastConfig: ArgsProps) => {
    notification.open(toastConfig);
}

/**
 * Metodo per poter gestire dinamicamente la visualizzazione di Message tramite apposita config,
 * è presente la possibilità di customizzare il message
 * @param messageConfig:ARgsProps configurazione message
 */
export const messages = (messageConfig: ArgsProps2) => {
    message.open(messageConfig)
}

/**
 * Metodo per poter chiudere dinamicamente una modale
 *
 */
export const closeModal = () => {
    Modal.destroyAll();
}

/**
 * Metodo per poter gestire dinamicamente una Modale di tipo Info con apposita configurazione
 * @param modalConfig:ModalFuncProps
 */
export const infoModal = (modalConfig: ModalFuncProps) => {
    Modal.info(modalConfig);
}

/**
 * Metodo per poter gestire dinamicamente una Modale di tipo Warning con apposita configurazione
 * @param modalConfig:ModalFuncProps
 */
export const warningModal = (modalConfig: ModalFuncProps) => {
    Modal.warning(modalConfig);
}

/**
 * Metodo per poter gestire dinamicamente una Modale di tipo Error con apposita configurazione
 * @param modalConfig:ModalFuncProps
 */
export const errorModal = (modalConfig: ModalFuncProps) => {
    Modal.error(modalConfig);
}

/**
 * Metodo per poter gestire dinamicamente una Modale di tipo SUccess con apposita configurazione
 * @param modalConfig:ModalFuncProps
 */
export const successModal = (modalConfig: ModalFuncProps) => {
    Modal.success(modalConfig);
}


