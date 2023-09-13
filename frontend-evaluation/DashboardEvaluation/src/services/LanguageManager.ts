import i18n from "../translations/i18n";
import { EnvironmentManager, IService } from "../services/EnvironmentManager";
import { navigate, reloadApp } from "../shared/router";


export class LanguageManager implements IService {



    environmentManager: EnvironmentManager | undefined = undefined;

    init(environmentManager: EnvironmentManager): void {

        this.environmentManager = environmentManager

    }

    getServiceKey(): string {
        return 'languageManager';
    }

    /**
     *  Metodo che da la possibilità di scegliere la lingua dell'app 
    */
    sendUpdate(lang: string) {
        i18n.changeLanguage(lang);
        navigate('/dashboard');
    }
}




const languageManager = new LanguageManager();
export default languageManager;

