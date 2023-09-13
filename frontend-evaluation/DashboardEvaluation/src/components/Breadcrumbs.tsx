import { Breadcrumb } from "antd";
import { useEffect, useState } from "react";
import { withRouter, useLocation } from "react-router-dom";
import EnvironmentManager from "../services/EnvironmentManager";

interface Prop {

}

const Breadcrumbs = (props: Prop) => {

    let location = useLocation();

    const [breadcrumbs, setBreadcrumbs] = useState<{[key: string]: any}>({});

    const navManager = EnvironmentManager.getNavigationManager();

    useEffect(() => {
        const currentBreadcrumbs = navManager?.getBreadcrumbs();
        if (currentBreadcrumbs !== breadcrumbs) {
            setBreadcrumbs(navManager?.getBreadcrumbs());
        }

    }, []);

    useEffect( () => {
        navManager.setReloadBreadcrumb(setBreadcrumbs)
    }, [setBreadcrumbs, navManager]);

    useEffect( () => {
        navManager.onRouteChange(location);
    }, [location])

    const breads = Object.entries(breadcrumbs).map( ([key, bread]) =>  {
            return  {
                title: bread.label,
                href: "/" + bread.route,
                key: bread.key
            }
        })

    return (<>
        {breadcrumbs && 
        
        <Breadcrumb items={breads}>

        </Breadcrumb>}
        </>)

}


export default withRouter(Breadcrumbs);