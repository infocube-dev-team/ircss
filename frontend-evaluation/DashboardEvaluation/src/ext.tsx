import {EnvironmentManager, IService} from "./services/EnvironmentManager";
import irccsEnvironmentManager from "./irccs/services/IrccsEnvironmentManager";
// import stiUserManager from "./sti/services/StiUserManager";

class Ext implements IService {

    environmentManager: EnvironmentManager | undefined = undefined;

    irccsEnvironmentManager: any;
    // stiUserManager: any;

    getServiceKey(): string {
        return 'customExt';
    }

    init = async (environmentManager: EnvironmentManager) => {
        this.environmentManager = environmentManager;
        // this.stiUserManager = stiUserManager;
        this.irccsEnvironmentManager = irccsEnvironmentManager;
    }

}

const customExt = new Ext();
export default customExt;