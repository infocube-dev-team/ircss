import {EnvironmentManager, IService} from "./services/EnvironmentManager";
// import stiEnvironmentManager from "./sti/services/StiEnvironmentManager";
// import stiUserManager from "./sti/services/StiUserManager";

class Ext implements IService {

    environmentManager: EnvironmentManager | undefined = undefined;

    stiEnvironmentManager: any;
    // stiUserManager: any;

    getServiceKey(): string {
        return 'customExt';
    }

    init = async (environmentManager: EnvironmentManager) => {
        this.environmentManager = environmentManager;
        // this.stiUserManager = stiUserManager;
        // this.stiEnvironmentManager = stiEnvironmentManager;
    }

}

const customExt = new Ext();
export default customExt;