import { Menu, MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import userManager from "../services/UserManager";
import { applyFilters } from "../services/HooksManager";
import { navigate } from "../shared/router";
import environmentManager from "../services/EnvironmentManager";

type MenuItem = Required<MenuProps>['items'][number];
export interface MenuNode {
    label: React.ReactNode,
    icon?: React.ReactNode,
    position: React.Key,
    children?: MenuNode[],
    key?: React.Key,
    caps?: any [], // string or array
    isroute?: boolean
}

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    isroute?: boolean,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        isroute,
        children,
        label,
    } as MenuItem;
}

interface Props {
    selectedKey: string
}

const MenuComponent = (props: Props) => {

    const [selectedKey, setSelectedKey] = useState<string[]>([]);

    useEffect(() => {
        let arr: string[] = selectedKey;
        arr.push(props.selectedKey);
        setSelectedKey(arr);
    }, []);

    const sortMenu = (a: MenuNode, b: MenuNode): number => {
        return (a.position > b.position ? 1 : -1);
    }

    const mapMenu = (item: MenuNode): MenuItem => {
        // have children ?
        let key;
        if (item.key) {
            key = item.key
        } else {
            key = item.position
        }

        if (item.children) {

            // Create menu for each child
            let listOfChild: MenuItem[] = []
            item.children.sort(sortMenu);
            item.children.map(children => {
                listOfChild.push(mapMenu(children));
            });

            // and create a menu with his childrens
            return getItem(item.label, key, item.icon, item.isroute, listOfChild);

        } else {
            // create a simple menu
            return getItem(item.label, key, item.icon, item.isroute);
        }
    }

    const getMenu = (): any => {

        let menu: MenuNode[] = [];

        /**
         *  Cattura il menu eventualmente modificato dall'estensione
         *  @hook app_menu
         *  @param menu:{ label: React.ReactNode, icon: React.ReactNode, position: React.Key, children?:{label: React.ReactNode, position: React.Key}[] }[] Array per la struttura del menu
         */
        menu = applyFilters('app_menu', menu);
        menu = menu.sort(sortMenu);

        let listOfMenu: MenuItem[] = []
        menu.map(item => {
            // ricerca capability in base alla chiave del menu, se il menu ha sottomenu fare lo stesso processo -> se ha i sottomenu senza cap bisogna eliminarli
            if (userManager.isLoggedUser()) {

                const hasParentCap = (!item.caps) || userManager.hasCaps(item.caps);
                if (hasParentCap) {
                    if (item.children) {
                        let menuItemChildren: { label: React.ReactNode; position: React.Key; key?: React.Key | undefined; }[] | undefined = []
                        item.children.forEach((c) => {

                            const hasCap = (!c.caps) || userManager.hasCaps(c.caps);
                            if (hasCap) {
                                menuItemChildren?.push(c);
                            }
                        })

                        item.children = menuItemChildren;
                    }
    
                    listOfMenu.push(mapMenu(item));
                }
            }
        });

        return listOfMenu;
    }

    const handleMenuItemClick = (key: string) => {
      if (key === 'logout') {
        environmentManager.getUserManager().doLogout().then(() => {
          environmentManager.reload()
        })
      } else {
        navigate(key);
      }
    }
      

    const navigateRoute = (item: any) => {
        const menu = getMenu();

        const menuitem = menu.find((m: any) => m.key === item.key);

        // verifico nei submenu presenti in controlPanel
        if (menuitem === undefined) {
            const childrenMenu = menu.find((m: any) => m.key === 'controlPanel');
            const subMenuItem = childrenMenu?.children?.find((m: any) => m.key === item.key);

            if (subMenuItem === undefined || subMenuItem.isroute === true || subMenuItem.isroute === undefined) {
                handleMenuItemClick(item.key);
            }
        }

        if (menuitem === undefined || menuitem.isroute === true || menuitem.isroute === undefined) {
            handleMenuItemClick(item.key);
        }
    }

    return (
        <Menu theme="dark" mode="inline" items={getMenu()} defaultSelectedKeys={selectedKey} onClick={navigateRoute} />
    )
}

export default MenuComponent;