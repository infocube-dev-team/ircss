import environmentManager, {EnvironmentManager, IService} from "../../services/EnvironmentManager";
import {addFilter} from "../../services/HooksManager";

class IrccsDataProvider implements IService {

    environmentManager: EnvironmentManager | undefined = undefined;

    init(environmentManager: EnvironmentManager) {

        this.environmentManager = environmentManager

    }

    getServiceKey(): string {
        return 'irccsDataProvider'
    }

}


const irccsDataProvider = new IrccsDataProvider();
export default irccsDataProvider;
