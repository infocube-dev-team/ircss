import {EnvironmentManager, IService} from "./EnvironmentManager";
import { applyFilters } from "./HooksManager";

class Storage implements IService{

    environmentManager: EnvironmentManager | undefined = undefined;

    prefix = 'app::';

    __prefixFilter(){
        return applyFilters('prefix_filter', this.prefix);
    }

    /**
     * Init
     */
    async init(environmentManager: EnvironmentManager) {
        this.environmentManager = environmentManager
    }

    getServiceKey(): string {
        return 'storage'
    }

    async save(key: string, data: any): Promise<void> {
        return localStorage.setItem(this.__prefixFilter() + key, JSON.stringify(data))
    }

    async load(key: string, defaultValue?: any): Promise<any | undefined> {
        let data = await localStorage.getItem(this.__prefixFilter() + key);
        data = this.verifyData(data);
        return data && data !== 'undefined' ? JSON.parse(data) : defaultValue
    }

    verifyData(value: any) {
        try {
            JSON.parse(value);
        } catch (e) {
            return JSON.stringify(value);
        }

        return value;
    }

    async loadToken(key: string, defaultValue?: any): Promise<any | undefined> {
        let data = await localStorage.getItem(this.__prefixFilter() + key);
        if (data?.substring(0) === '"') {
            data = JSON.stringify(data);
        }

        return data && data !== 'undefined' ? JSON.parse(data) : defaultValue
    }

    async remove(key: string): Promise<void> {
        return localStorage.removeItem(this.__prefixFilter() + key)
    }

    async purgeAllData(): Promise<void> {
        return localStorage.clear()
    }

    async getItem(key: string) {
        return localStorage.getItem(key);
    }
}

const storage = new Storage();
export default storage;
