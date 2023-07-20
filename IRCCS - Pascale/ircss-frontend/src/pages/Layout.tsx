import React, { ReactNode } from 'react';
import NavbarLaterale from '../components/NavBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout= (props: LayoutProps) => {
  return (
    <div>
      <NavbarLaterale child={props.children} />
    </div>
  );
};

export default Layout;
