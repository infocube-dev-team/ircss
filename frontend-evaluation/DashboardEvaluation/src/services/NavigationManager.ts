import { ReactNode } from "react";
import { EnvironmentManager, IService } from "./EnvironmentManager";
import userManager from "./UserManager";
import { applyActions, applyFilters } from "./HooksManager";

export interface Bread {
    key: string,
    route: string,
    label: ReactNode
}

class NavigationManager implements IService {

    environmentManager: EnvironmentManager | undefined = undefined;
    breadcrumbs: {[key: string]:Bread} = {};
    reloadBreadcrumb: any = () => {};

    getServiceKey(): string {
        return 'navigationManager'
    }

    getBreadcrumbs = () => {
        return applyFilters('navigation_manager_breadcrumbs', this.breadcrumbs, this);
    }

    addBreadcrumb = (breadcrumb: Bread) => {
        //applyFilters
        this.breadcrumbs[breadcrumb.key] = breadcrumb;

    }

    cleanBreadcumbs = () => {
        this.breadcrumbs = {};
    }

    setReloadBreadcrumb = (reloadBreadcrumb :any) => {
        this.reloadBreadcrumb = reloadBreadcrumb;
    }

    reloadBreadcrumbs = () => {
        this.reloadBreadcrumb(this.breadcrumbs);
    }

    /**
     * Init
     */
    init = async (environmentManager: EnvironmentManager) => {

        this.environmentManager = environmentManager;

    }

    onRouteChange = async (location: any) => {
        this.cleanBreadcumbs();
        applyActions('nav_route_change', location, this);
        this.reloadBreadcrumbs();
        await userManager.reloadLoggedUser();
    }
}

const navigationManager = new NavigationManager();
export default navigationManager;
