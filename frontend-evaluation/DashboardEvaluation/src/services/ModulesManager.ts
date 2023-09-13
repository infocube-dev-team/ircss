/**
 * Modules Manager
 */
import {applyActions, applyFilters} from "./HooksManager";
import {EnvironmentManager, IService} from "./EnvironmentManager";

export interface IModule {
    /**
     * Init module
     */
    init(): void;

    /**
     * Ritnrna identificativa del modulo
     */
    getModuleKey(): string;
}

export interface ModuleList {
    [key: string]: IModule
}

class ModulesManager implements IService {

    environmentManager: EnvironmentManager | undefined = undefined;

    /**
     * Lista di moduli installati
     */
    modules: ModuleList | undefined;

    getServiceKey(): string {
        return 'modulesManager'
    }

    /**
     * Init
     */
    init = async (environmentManager: EnvironmentManager) => {

        this.environmentManager = environmentManager

        const modules = this.getModules();

        // Ciclo sui moduli
        if (modules) {
            for (const moduleKey in modules) {
                console.debug('Init module', moduleKey);
                const module = modules[moduleKey];
                module.init();

                /**
                 * Notifica inizializzazione modulo ${moduleKey}
                 * @hook app_module_init_${moduleKey}
                 * @param module Modulo
                 */
                applyActions(`app_module_init_${moduleKey}`, module);

                /**
                 * Notifica inizializzazione di un modulo
                 * @hook app_module_init
                 * @param moduleKey:string Modulo
                 * @param module Modulo
                 */
                applyActions('app_module_init', moduleKey, module);
            }
        }

        console.debug('Modules inizialized');

        /**
         * Moduli inizializzati
         * @hook app_modules_init
         */
        applyActions('app_modules_init');

    }

    getModules = () => {
        if (!this.modules) {
            this.modules = applyFilters('app_modules', {});
            return this.modules;
        }
    }

    getModule = (key: string): IModule | null => {
        if (!this.modules || this.modules[key] === undefined) {
            console.error(`Nessun module ${key} attivo`);
            return null;
        }

        return this.modules[key]
    }

}

const modulesManager = new ModulesManager();
export default modulesManager;
