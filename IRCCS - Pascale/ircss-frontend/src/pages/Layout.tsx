import React, { ReactNode } from 'react';
import NavbarLaterale from '../components/NavBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <NavbarLaterale />
      <div style={{ 'marginTop': '40px' }}>{children}</div>
    </div>
  );
};

export default Layout;
