import React, { useEffect } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import "./AppDrawer.css";
import { ADD_AIRLINES, ADD_AIRPORT, ADD_FLIGHTS, DASHBOARD, SEARCH_PNR } from "../../utils/Routes";
import { useNavigate } from "react-router-dom";

// import DASHBOARD from "../../Screens/Dashboard";

function AppDrawer({ isOpen, toggleDrawer, ActiveRoute }) {
  const LoggedInData = { EMAIL_ID: "" };

  const navigate=useNavigate()

  const RoutesList = [
    {
      label: "Dashboard",
      // icon: <HomeRoundedIcon />,
      path: DASHBOARD,
      SHOW: true,
      SUB_ROUTES: [],
    },
    {
      label: "Search PNR",
      // icon: <HomeRoundedIcon />,
      path: SEARCH_PNR,
      SHOW: true,
      SUB_ROUTES: [],
    },
    {
      label: "Airline",
      // icon: <HomeRoundedIcon />,
      path: ADD_AIRLINES,
      SHOW: true,
      SUB_ROUTES: [],
    },
    {
      label: "Airports",
      // icon: <HomeRoundedIcon />,
      path: ADD_AIRPORT,
      SHOW: true,
      SUB_ROUTES: [],
    },
    {
      label: "Flights",
      // icon: <HomeRoundedIcon />,
      path: ADD_FLIGHTS,
      SHOW: true,
      SUB_ROUTES: [],
    },
  ];

  return (
    <div className="drawer-container">
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
        className="drawer-container"
        style={{
          backgroundColor: "#000",
        }}
      >
      
        {/* <img
          src={ICONS.right_arrow}
          className="side-bar-logo"
          style={
            {
              // height: 100,
              // backgroundColor:"black"
            }
          }
        /> */}
        <div className="drawer-inner-container">
          {RoutesList.map((val, i) => {
            return (
              val.SHOW && (
                <div
                  className={`drawer-item${
                    val.path == ActiveRoute ? " active" : ""
                  }`}
                  onClick={() => {
                    navigate(val.path);
                  }}
                  key={i}
                >
                  {val.icon}
                  {val.label}
                </div>
              )
            );
          })}
        </div>

        {/* </motion.ul> */}
      </Drawer>
    </div>
  );
}

export default AppDrawer;
