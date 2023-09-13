import PageViewer from "../components/PageViewer";
import {addFilter} from "../services/HooksManager";
import ParentModule from "../shared/module/CrudModule";
import NotFound from "../pages/NotFound";

class NotFoundModule extends ParentModule {

    init = () => {

        addFilter('app_routes', (routes: any) => {
            routes[this.getRoute()] = {component: PageViewer, props: {content: <NotFound/>, selectedKey: this.getRoute()}, visibility: 'private'};
            return routes;
        }, -100);
    }

    getModuleKey = (): string => {
        return "not_found";
    }

}

const module = new NotFoundModule();
export default module;
