import environmentManager from "../../services/EnvironmentManager";
import {addAction, addFilter} from "../../services/HooksManager";
import {ModuleList} from "../../services/ModulesManager";
import logo from "../assets/images/logo-pascale.png";
import organizationModule from "../modules/OrganizationModule";

class IrccsEnvironmentManager {

    constructor() {
        addFilter('app_main_logo', this.getMainLogo);
        addFilter('app_name', this.getApplicationName);
        addFilter('app_header_logo', this.getHeaderLogo);
        addFilter('app_default_route', this.getDefaultRoute)
        // addFilter('app_modules', this.getModules)
        addFilter('app_version', this.getVersion);

        addFilter('app_modules', this.addModules, 90);

        addAction('app_init', this.init);
    }

    init = () => {
    }

    getVersion(string: any) {
        return 'v 1.0.0';
    }

    getMainLogo(main_logo: any) {
        return logo;
    }

    getHeaderLogo(header_logo: any) {
        return logo;
    }

    getApplicationName(name: string) {
        return 'IRCCS dashboard';
    }

    getDefaultRoute(name: string) {
        return environmentManager?.getUserManager()?.isLoggedUser() ? '/dashboard' : '/login';
    }

    addModules = (modules: ModuleList) => {
        modules[organizationModule.getModuleKey()] = organizationModule;
        return modules;
    }

}


const irccsEnvironmentManager = new IrccsEnvironmentManager();
export default irccsEnvironmentManager;

