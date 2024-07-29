import React, { useEffect, useState } from "react";
import ICONS from "../assets/ICONS";
import "./Dashboard.css";
import AXIOS from "../utils/AXIOS";
import axios from "../utils/CustomAxios";
import AppDrawer from "../Components/AppDrawer/AppDrawer";
import MainScreen from "../Components/AppDrawer/MainScreen";
import { DASHBOARD, SEARCH_PNR } from "../utils/Routes";
import toast, {  Toaster } from "react-hot-toast";

function SearchPNR() {
  const [flightList, setFlightList] = useState([]);
  const [searchedValue, setSearchedValue] = useState("");

  const getFlightStatus = () => {
    if (searchedValue == "") {
      toast.error("Please enter PNR Number")
    } else {
      axios
        .post(AXIOS.axiosUrl + AXIOS.searchPNR, {
          filter: { pnr_number: searchedValue },
        })
        .then((response) => {
          console.log("sadkhabsdhsad", response);
          setFlightList(response);
        })
        .catch((err) => {});
    }
  };
  return (
    <MainScreen ActiveRoute={SEARCH_PNR}>
      <Toaster/>
      <div className="flex justify-start items-center">
        <div className="searchbar min-w-[500px] mr-2 ml-2">
          <div className="searchbar-wrapper">
            <div className="searchbar-left">
              <div className="search-icon-wrapper">
                <span className="search-icon searchbar-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                  </svg>
                </span>
              </div>
            </div>
            <div className="searchbar-center">
              <div className="searchbar-input-spacer" />
              <input
                type="text"
                className="searchbar-input"
                maxLength={2048}
                name="q"
                autoCapitalize="off"
                autoComplete="off"
                title="Search"
                role="combobox"
                placeholder="Search PNR"
                value={searchedValue}
                onChange={(e) => {
                  setSearchedValue(e.target.value.toUpperCase());
                }}
              />
            </div>
          </div>
        </div>

        <button
          className="button"
          onClick={() => {
            getFlightStatus();
          }}
        >
          Search
        </button>
      </div>

      <div className="grid text-center grid-cols-1 lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        {flightList.map((val) => {
          return (
            <div className="flight-card lg:w-[400px]">
              <div className="flight-card-header">
                <div className="flight-data">
                  {/* <div className="passanger-details"></div> */}
                  <div className="passanger-depart">
                    <span className="title">Depart</span>
                    <span className="detail">
                      {new Date(
                        val.flight.actual_departure_time
                      ).toDateString()}
                    </span>
                    <span className="detail">
                      {new Date(
                        val.flight.actual_departure_time
                      ).toLocaleTimeString("en-US", {
                        timeStyle: "short",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div className="passanger-depart">
                    <span className="title">Passenger</span>
                    <span className="detail">{val.passenger_name}</span>
                  </div>
                  <div className="passanger-arrives">
                    <span className="title">Arrives</span>
                    <span className="detail">
                      {new Date(val.flight.actual_arrival_time).toDateString()}
                    </span>
                    <span className="detail">
                      {new Date(
                        val.flight.actual_arrival_time
                      ).toLocaleTimeString("en-US", {
                        timeStyle: "short",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flight-card-content">
                <div className="flight-row">
                  <div className="flight-from">
                    <span className="from-code">
                      {val?.departure_airport?.iata_code}
                    </span>
                    <span className="from-city">
                      {val?.departure_airport?.name}
                    </span>
                  </div>
                  <div className="plane">
                    <img
                      src="https://cdn.onlinewebfonts.com/svg/img_537856.svg"
                      alt=""
                    />
                  </div>
                  <div className="flight-to">
                    <span className="to-code">
                      {val?.arrival_airport?.iata_code}
                    </span>
                    <span className="to-city">
                      {val?.arrival_airport?.name}
                    </span>
                  </div>
                </div>
                <div className="flight-details-row">
                  <div className="flight-operator">
                    <span className="title">Terminal</span>
                    <span className="detail">{val.flight.terminal}</span>
                  </div>
                  <div className="flight-operator">
                    <span className="title">Gate Number</span>
                    <span className="detail text-center" >{val.flight.gate_number}</span>
                  </div>
                  <div className="flight-class">
                    {/* <span className="title">CLASS</span>
                  <span className="detail">Economy</span> */}
                    <span className="title">FLIGHT</span>
                    <span className="detail">
                      {val?.airline_data?.iata_code} {val.flight_id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </MainScreen>
  );
}

export default SearchPNR;
