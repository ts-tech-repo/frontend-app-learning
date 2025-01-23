import React from 'react';
import { SIDEBAR_ORDER, SIDEBARS } from './sidebars';

const Sidebar = () => (
  <>
    {
      SIDEBAR_ORDER.map((sideBarId) => {
        console.log(sideBarId);
        const SidebarToRender = SIDEBARS[sideBarId].Sidebar;
        return <SidebarToRender />;
      })
    }
  </>
);

export default Sidebar;
