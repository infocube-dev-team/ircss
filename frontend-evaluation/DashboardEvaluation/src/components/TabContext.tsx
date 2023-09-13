import React from "react";
// const activeKey: string = 'details';
// const TabContext = React.createContext(activeKey);

const TabContext = React.createContext<{
    activeKey: string | null,
    setActiveKey: (newValue: any) => void
  }>({
    activeKey: null,
    setActiveKey: () => undefined
  })
export { TabContext };