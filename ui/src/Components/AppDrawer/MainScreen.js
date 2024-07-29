import React, { useEffect, useState } from "react";
import AppDrawer from "./AppDrawer";
// import Header from "./Header";

import { DASHBOARD } from "../../utils/Routes";
import Header from "./Header";

function MainScreen({ children, ActiveRoute }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const LoggedInData = {EMAIL_ID:""}

  const RoutesList = [
    {
      label: "Dashboard",
      // icon: <HomeRoundedIcon />,
      path:DASHBOARD,
      SHOW:true,
      SUB_ROUTES: [],
    },
    
  ];

  
  return (
    <div>
      <Header toggleDrawer={toggleDrawer} isOpen={isOpen} />
      <AppDrawer
        toggleDrawer={toggleDrawer}
        isOpen={isOpen}
        ActiveRoute={ActiveRoute}
      />
      {children}
    </div>
  );
}

export default MainScreen;
