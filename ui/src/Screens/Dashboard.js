import React, { useEffect, useState } from "react";
import ICONS from "../assets/ICONS";
import "./Dashboard.css";
import AXIOS from "../utils/AXIOS";
import axios from "../utils/CustomAxios";
import AppDrawer from "../Components/AppDrawer/AppDrawer";
import MainScreen from "../Components/AppDrawer/MainScreen";
import { DASHBOARD, FlightStatusArr } from "../utils/Routes";
import ReactDataTable from "../Components/DataTable/ReactDataTable";

const socketUrl = "ws://localhost:8000/ws/updates";
function Dashboard() {
  const [Tbody, setTbody] = useState([]);
  const [searchedValue, setSearchedValue] = useState("");
  useEffect(() => {
    const socket = new WebSocket(socketUrl);

    socket.onmessage = (event) => {
      // const data = JSON.parse(event.data);
       const updatedFlightData = JSON.parse(event.data);
       console.log("Received flight update:", updatedFlightData);

       let tempTbody = [...Tbody];

       updatedFlightData.map((val) => {
         let index = tempTbody.findIndex(
           (item) => item.flight_id == val.flight_id
         );
         if (index == -1) {
           tempTbody.push({
             ...val,
           });
         } else {
           tempTbody[index] = { ...val };
         }
       });

       setTbody(tempTbody);
    };

    socket.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    // return () => {
    //   socket.close();
    // };
  }, []);

  useEffect(()=>{
getFlightStatus();
  },[])

  const getFlightStatus = () => {
    axios
      .get(AXIOS.axiosUrl + AXIOS.getFlights)
      .then((response) => {
        console.log("sadkhabsdhsad", response);
        setTbody(response);
      })
      .catch((err) => {
        console.log("ASdasdbasd",err);
      });
  };

    const formatTime = (date) => {
      if (date) {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      }
    };

  // actual_arrival_time: "2024-07-25T23:31:00.000Z";
  // actual_departure_time: "2024-07-25T22:33:00.000Z";
  // aircraft_id: "AR0001";
  // airline_id: "AL0001";
  // arrival_airport_id: "AP0001";
  // departure_airport_id: "AP0001";
  // flight_id: "AA100";
  // gate_number: "7";
  // scheduled_arrival_time: "2024-07-26T11:00:00";
  // scheduled_departure_time: "2024-07-26T08:00:00";
  // status: "15";
  // terminal: "T3";
  const columns = [
    {
      name: "STD",
      selector: (val) => val.actual_departure_time,
      sortable: false,
      // width: "80px",
      cell: (val, index) => {
        return (
          <p style={{}}>{formatTime(new Date(val.actual_departure_time))}</p>
        );
      },
    },
    {
      name: "Airline",
      selector: (val) => val.actual_departure_time,
      sortable: false,
      // width: "80px",
      cell: (val, index) => {
        return (
          <img
            src={
              "https://seekvectorlogo.com/wp-content/uploads/2022/01/indigo-vector-logo-2022-small.png"
            }
            style={{
              width: 100,
              height: 20,
              objectFit: "cover",
            }}
          />
        );
      },
    },
    {
      name: "Flight No.",
      selector: (val) => val.flight_id,
      sortable: false,
      cell: (val, index) => (
        <p>
          {val.airline_iata_code} {val.flight_id}
        </p>
      ),
    },
    {
      name: "Destination",
      selector: (val) => val.arrival_airport_iata_code,
      sortable: false,
    },
    {
      name: "Status",
      selector: (val) => val.status,
      sortable: false,
      cell: (val, index) => {
        let status_data = FlightStatusArr.find(
          (item) => Number(item.value) == Number(val.status)
        );
        console.log("ASdjnasdkjasd", val.status, status_data);
        return (
          <p
            style={{
              backgroundColor: status_data.bg_color,
              color: status_data.color,
              padding: 5,
              borderRadius: 10,
              fontWeight: "bold",
            }}
          >
            {status_data?.label}
          </p>
        );
      },
    },
  ];
  return (
    <MainScreen ActiveRoute={DASHBOARD}>
      <ReactDataTable columns={columns} data={Tbody} loading={true} />
    </MainScreen>
  );
}

export default Dashboard;
