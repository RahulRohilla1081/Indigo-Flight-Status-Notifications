import React, { useEffect, useState } from "react";
import MainScreen from "../Components/AppDrawer/MainScreen";
import { ADD_FLIGHTS, FlightStatusArr } from "../utils/Routes";
import Modal from "react-modal";
import ICONS from "../assets/ICONS";
import ReactDataTable from "../Components/DataTable/ReactDataTable";
import axios from "../utils/CustomAxios";
import AXIOS from "../utils/AXIOS";
import CustomSelect from "../Components/CustomSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, {Toaster} from "react-hot-toast"

function AddFlight() {
  const [Tbody, setTbody] = useState([]);
  const [airportOptions, setAirportOptions] = useState([]);
  const [airlineOptions, setAirlineOptions] = useState([]);
  const [aircraftsOptions, setAircraftsOptions] = useState([]);

  const [selectedFlightHistory,setSelectedFlightHistory]=useState({

  })

  const [selectedFlightDtls, setSelectedFlightDtls] = useState({});
  

  const [formData, setFormData] = useState({
    DEPARTURE_AIRPORT_ID: "",
    AIRCRAFT_ID: "",
    AIRCRAFT_ID_ERROR: false,
    DEPARTURE_AIRPORT_ID_ERROR: false,
    AIRLINE_ID: "",
    AIRLINE_ID_ERROR: false,
    ARRIVAL_AIRPORT_ID: "",
    ARRIVAL_AIRPORT_ID_ERROR: false,
    DEPARTURE_DATE: new Date(),
    DEPARTURE_DATE_ERROR: false,
    DEPARTURE_TIME: "",
    DEPARTURE_TIME_ERROR: false,
    ARRIVAL_DATE: new Date(),
    ARRIVAL_DATE_ERROR: false,
    ARRIVAL_TIME: "",
    ARRIVAL_TIME_ERROR: false,
    TERMINAL: "",
    TERMINAL_ERROR: false,
    GATE_NUMBER: "",
    GATE_NUMBER_ERROR: false,
  });

  useEffect(() => {
    getFlightData();
    getAirportData();
    getAirLineData();
  }, []);

  const getFlightData = () => {
    axios
      .get(AXIOS.axiosUrl + AXIOS.getFlights)
      .then((response) => {
        setTbody(response);
      })
      .catch((err) => {
        console.log("Asdkasbdhjasdas", err);
      });
  };
  const getAirCraftsData = (airline_id) => {
    axios
      .post(AXIOS.axiosUrl + AXIOS.getAirCrafts, {
        filter: {
          airline_id: airline_id,
        },
      })
      .then((response) => {
        let tempResponse = [];

        console.log("ASdkasbdjhasbdjhasbdhasd", response);
        response.map((val) => {
          tempResponse.push({
            label: val.name,
            value: val.aircraft_id,
            ...val,
          });
        });
        setAircraftsOptions(tempResponse);
      })
      .catch((err) => {
        console.log("Asdkasbdhjasdas", err);
      });
  };
  const getAirportData = () => {
    axios
      .post(AXIOS.axiosUrl + AXIOS.getAirports)
      .then((response) => {
        let tempResponse = [];
        response.map((val) => {
          tempResponse.push({
            label: val.name,
            value: val.airport_id,
            ...val,
          });
        });
        setAirportOptions(tempResponse);
      })
      .catch((err) => {
        console.log("Asdkasbdhjasdas", err);
      });
  };
  const getAirLineData = () => {
    axios
      .post(AXIOS.axiosUrl + AXIOS.getAirline)
      .then((response) => {
        console.log("asdbashjdsadkhasbdjhas", response);

        let tempResponse = [];
        response.map((val) => {
          tempResponse.push({
            label: val.name,
            value: val.airline_id,
            ...val,
          });
        });
        setAirlineOptions(tempResponse);
      })
      .catch((err) => {
        console.log("Asdkasbdhjasdas", err);
      });
  };

  const formatTime = (date) => {
    if (date) {
      let SelectedDate = new Date(date);

      const hours = String(SelectedDate.getHours()).padStart(2, "0");
      const minutes = String(SelectedDate.getMinutes()).padStart(2, "0");
      console.log("asdasdasdasd", `${hours}:${minutes}`);
      return `${hours}:${minutes}`;
    }
  };

    const HistoryColumns = [
      {
        name: "ID",
        selector: (val) => val.history_id,
        sortable: false,
        width: "100px",
        // cell: (val, index) => <p></p>,
      },
      {
        name: "Prev Status",
        selector: (val) => val.prev_status,
        sortable: false,
        width: "200px",
        cell: (val, index) => {
          let status_data = FlightStatusArr.find(
            (item) => Number(item.value) == Number(val.prev_status)
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
      {
        name: "Current Status",
        selector: (val) => val.prev_status,
        sortable: false,
        width: "200px",
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
      {
        name: "Prev Actual Departure Time",
        selector: (val) => val.prev_actual_departure_time,
        sortable: false,
        width: "300px",
        cell: (val, index) => {
          return (
            val.prev_actual_departure_time && (
              <p>
                {new Date(val.prev_actual_departure_time).toDateString()}
                <span className="ml-2">
                  {new Date(val.prev_actual_departure_time).toLocaleTimeString(
                    "en-US",
                    {
                      timeStyle: "short",
                      hour12: true,
                    }
                  )}
                </span>
              </p>
            )
          );
        },
      },
      {
        name: "Prev Actual Arrival Time",
        selector: (val) => val.prev_actual_arrival_time,
        sortable: false,
        width: "300px",
        cell: (val, index) => {
          return (
            val.prev_actual_arrival_time && (
              <p>
                {new Date(val.prev_actual_arrival_time).toDateString()}
                <span className="ml-2">
                  {new Date(val.prev_actual_arrival_time).toLocaleTimeString(
                    "en-US",
                    {
                      timeStyle: "short",
                      hour12: true,
                    }
                  )}
                </span>
              </p>
            )
          );
        },
      },
      {
        name: "Actual Departure Time",
        selector: (val) => val.actual_departure_time,
        sortable: false,
        width: "300px",
        cell: (val, index) => {
          return (
            val.actual_departure_time && (
              <p>
                {new Date(val.actual_departure_time).toDateString()}
                <span className="ml-2">
                  {new Date(val.actual_departure_time).toLocaleTimeString(
                    "en-US",
                    {
                      timeStyle: "short",
                      hour12: true,
                    }
                  )}
                </span>
              </p>
            )
          );
        },
      },
      {
        name: "Actual Arrival Time",
        selector: (val) => val.actual_arrival_time,
        sortable: false,
        width: "300px",
        cell: (val, index) => {
          return (
            val.actual_arrival_time && (
              <p>
                {new Date(val.actual_arrival_time).toDateString()}
                <span className="ml-2">
                  {new Date(val.actual_arrival_time).toLocaleTimeString(
                    "en-US",
                    {
                      timeStyle: "short",
                      hour12: true,
                    }
                  )}
                </span>
              </p>
            )
          );
        },
      },
      {
        name: "Prev Terminal",
        selector: (val) => val.prev_terminal,
        sortable: false,
        width: "150px",
      },
      {
        name: "Terminal",
        selector: (val) => val.terminal,
        sortable: false,
        width: "150px",
      },
      {
        name: "Prev Gate Number",
        selector: (val) => val.prev_gate_number,
        sortable: false,
        width: "200px",
      },
      {
        name: "Gate Number",
        selector: (val) => val.gate_number,
        sortable: false,
        width: "150px",
      },
      {
        name: "Prev Airport ID",
        selector: (val) => val.prev_arrival_airport_id,
        sortable: false,
        width: "200px",
      },
      {
        name: "Airport ID",
        selector: (val) => val.arrival_airport_id,
        sortable: false,
        width: "140px",
      },
    ];
  const columns = [
    {
      name: "ID",
      selector: (val) => val.flight_id,
      sortable: false,
      cell: (val, index) => (
        <p>
          {val.airline_iata_code}
          {val.flight_id}
        </p>
      ),
    },
    {
      name: "Action",
      selector: (val) => val.u_id,
      sortable: false,
      cell: (val, index) => {
        return (
          <button
            className="button"
            type="submit"
            style={{
              height: 35,
            }}
            onClick={() => {
              console.log("Asdashbdhasd", val.flight_id);
              setSelectedFlightDtls({
                AIRLINE_ID: val.airline_id,
                AIRCRAFT_ID: val.aircraft_id,
                DEPARTURE_AIRPORT_ID: val.departure_airport_id,
                ARRIVAL_AIRPORT_ID: val.arrival_airport_id,
                DEPARTURE_DATE: val.scheduled_departure_time,
                DEPARTURE_TIME: formatTime(val.scheduled_departure_time),
                ARRIVAL_TIME: formatTime(val.scheduled_arrival_time),
                ACTUAL_DEPARTURE_TIME: formatTime(val.actual_departure_time),
                ACTUAL_DEPARTURE_DATE: val.actual_departure_time,
                ACTUAL_ARRIVAL_TIME: formatTime(val.actual_arrival_time),
                ACTUAL_ARRIVAL_DATE: val.actual_arrival_time,
                ARRIVAL_DATE: val.scheduled_arrival_time,
                GATE_NUMBER: val.gate_number,
                TERMINAL: val.terminal,
                STATUS: val.status,
                FLIGHT_ID: val.flight_id,
                ...val,
              });
              openUpdateFlightModal();
              getAirCraftsData(val.airline_id);
            }}
          >
            <img
              src={ICONS.edit_icon}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </button>
        );
      },
    },
    {
      name: "History",
      selector: (val) => val.u_id,
      sortable: false,
      cell: (val, index) => {
        return (
          <button
            className="button"
            type="submit"
            style={{
              height: 35,
              backgroundColor: "#FB773C",
            }}
            onClick={() => {
              // console.log("Asdashbdhasd", val.flight_id);
              setSelectedFlightHistory(val.HISTORY);
              openHistoryFlightModal();
              // getAirCraftsData(val.airline_id);
            }}
          >
            <img
              src={ICONS.history_icon}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </button>
        );
      },
    },
    {
      name: "Status",
      selector: (val) => val.status,
      sortable: false,
      width: "250px",
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
    {
      name: "Airline ID",
      selector: (val) => val.airline_name,
      sortable: false,
    },
    {
      name: "Air Craft",
      selector: (val) => val.aircraft_name,
      sortable: false,
      width: "200px",
    },
    {
      name: "Departure Airport",
      selector: (val) => val.departure_airport_iata_code,
      sortable: false,
    },
    {
      name: "Arrival Airport",
      selector: (val) => val.arrival_airport_iata_code,
      sortable: false,
    },
    {
      name: "Schedule Arrival Time",
      selector: (val) => val.scheduled_arrival_time,
      sortable: false,
      width: "250px",
      cell: (val, index) => (
        <p>
          {new Date(val.scheduled_arrival_time).toDateString()}
          <span className="ml-2">
            {new Date(val.scheduled_arrival_time).toLocaleTimeString("en-US", {
              timeStyle: "short",
              hour12: true,
            })}
          </span>
        </p>
      ),
    },
    {
      name: "Schedule Departure Time",
      selector: (val) => val.scheduled_departure_time,
      sortable: false,
      width: "250px",
      cell: (val, index) => (
        <p>
          {new Date(val.scheduled_departure_time).toDateString()}
          <span className="ml-2">
            {new Date(val.scheduled_departure_time).toLocaleTimeString(
              "en-US",
              {
                timeStyle: "short",
                hour12: true,
              }
            )}
          </span>
        </p>
      ),
    },
    {
      name: "Actual Arrival Time",
      selector: (val) => val.actual_arrival_time,
      sortable: false,
      width: "250px",
      cell: (val, index) => {
        return (
          val.actual_arrival_time && (
            <p>
              {new Date(val.actual_arrival_time).toDateString()}
              <span className="ml-2">
                {new Date(val.actual_arrival_time).toLocaleTimeString("en-US", {
                  timeStyle: "short",
                  hour12: true,
                })}
              </span>
            </p>
          )
        );
      },
    },
    {
      name: "Actual Departure Time",
      selector: (val) => val.actual_departure_time,
      sortable: false,
      width: "250px",
      cell: (val, index) => {
        return (
          val.actual_departure_time && (
            <p>
              {new Date(val.actual_departure_time).toDateString()}
              <span className="ml-2">
                {new Date(val.actual_departure_time).toLocaleTimeString(
                  "en-US",
                  {
                    timeStyle: "short",
                    hour12: true,
                  }
                )}
              </span>
            </p>
          )
        );
      },
    },
    {
      name: "Terminal",
      selector: (val) => val.terminal,
      sortable: false,
    },
    {
      name: "Gate Number",
      selector: (val) => val.gate_number,
      sortable: false,
      width: "140px",
    },
  ];

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "500px",
      height: "80vh",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const customHistoryStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      minWidth: "300px",
      maxWidth: "700px",
      maxHeight: "80vh",
      minHeight: "30vh",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }
  const [UpdateFlightModalIsOpen, setUpdateFlightModalIsOpen] = useState(false);

  function openUpdateFlightModal() {
    setUpdateFlightModalIsOpen(true);
  }

  function closeUpdateFlightModal() {
    setUpdateFlightModalIsOpen(false);
  }
  const [historyFlightModalIsOpen, setHistoryFlightModalIsOpen] = useState(false);

  function openHistoryFlightModal() {
    setHistoryFlightModalIsOpen(true);
  }

  function closeHistoryFlightModal() {
    setHistoryFlightModalIsOpen(false);
  }
  function embedTimeIntoDate(dateStr, timeStr) {
    console.log("ASdasndasd previous", dateStr);
    // Parse the original date string to a Date object
    const originalDate = new Date(dateStr);

    // Split the time string into hours and minutes
    const [hours, minutes] = timeStr.split(":").map(Number);

    // Set the hours and minutes of the original date
    originalDate.setHours(hours);
    originalDate.setMinutes(minutes);
    console.log("ASdasndasd new", originalDate);

    return originalDate;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let tempFormData = { ...formData };

    let payload = {};

    let ErrorFoundFlag = false;
    Object.keys(tempFormData).map((key, colIndex) => {
      if (typeof tempFormData[key] != "boolean") {
        if (tempFormData[key] == "") {
          tempFormData[key + "_ERROR"] = true;
          ErrorFoundFlag = true;
        }
      }
    });

    if (ErrorFoundFlag == false) {
      payload = { ...tempFormData };
      Object.keys(tempFormData).map((key, colIndex) => {
        if (typeof tempFormData[key] == "boolean") {
          delete payload[key];
        }
      });
      console.log("asdhbaghdbasdas", {
        airline_id: formData.AIRLINE_ID,
        departure_airport_id: formData.DEPARTURE_AIRPORT_ID,
        arrival_airport_id: formData.ARRIVAL_AIRPORT_ID,
        scheduled_departure_time: embedTimeIntoDate(
          formData.DEPARTURE_DATE,
          formData.DEPARTURE_TIME
        ),
        scheduled_arrival_time: embedTimeIntoDate(
          formData.ARRIVAL_DATE,
          formData.ARRIVAL_TIME
        ),
        aircraft_id: formData.AIRCRAFT_ID,
        gate_number: formData.GATE_NUMBER,
        terminal: formData.TERMINAL,
        status: "1",
      });

      axios
        .post(AXIOS.axiosUrl + AXIOS.createFlight, {
          filter: {
            airline_id: formData.AIRLINE_ID,
            departure_airport_id: formData.DEPARTURE_AIRPORT_ID,
            arrival_airport_id: formData.ARRIVAL_AIRPORT_ID,
            scheduled_departure_time: embedTimeIntoDate(
              formData.DEPARTURE_DATE,
              formData.DEPARTURE_TIME
            ),
            scheduled_arrival_time: embedTimeIntoDate(
              formData.ARRIVAL_DATE,
              formData.ARRIVAL_TIME
            ),
            aircraft_id: formData.AIRCRAFT_ID,
            gate_number: formData.GATE_NUMBER,
            terminal: formData.TERMINAL,
            status: "1",
          },
        })
        .then((response) => {
          closeModal();
          getFlightData();
          setFormData({
            DEPARTURE_AIRPORT_ID: "",
            AIRCRAFT_ID: "",
            AIRCRAFT_ID_ERROR: false,
            DEPARTURE_AIRPORT_ID_ERROR: false,
            AIRLINE_ID: "",
            AIRLINE_ID_ERROR: false,
            ARRIVAL_AIRPORT_ID: "",
            ARRIVAL_AIRPORT_ID_ERROR: false,
            DEPARTURE_DATE: new Date(),
            DEPARTURE_DATE_ERROR: false,
            DEPARTURE_TIME: "",
            DEPARTURE_TIME_ERROR: false,
            ARRIVAL_DATE: new Date(),
            ARRIVAL_DATE_ERROR: false,
            ARRIVAL_TIME: "",
            ARRIVAL_TIME_ERROR: false,
            TERMINAL: "",
            TERMINAL_ERROR: false,
            GATE_NUMBER: "",
            GATE_NUMBER_ERROR: false,
          });
        })
        .catch((err) => {
          console.log("SAdasdasd", err);
        });
    }
    setFormData(tempFormData);
  };


  const handleFlightUpdate=(e)=>{

    e.preventDefault()

    console.log("asdkadhsadasd", selectedFlightDtls);
    axios
      .post(AXIOS.axiosUrl + AXIOS.updateFlight, {
        filter: {
          airline_id: selectedFlightDtls.AIRLINE_ID,
          flight_id: selectedFlightDtls.flight_id,
          departure_airport_id: selectedFlightDtls.DEPARTURE_AIRPORT_ID,
          arrival_airport_id: selectedFlightDtls.ARRIVAL_AIRPORT_ID,
          actual_departure_time: embedTimeIntoDate(
            selectedFlightDtls.ACTUAL_DEPARTURE_DATE,
            selectedFlightDtls.ACTUAL_DEPARTURE_TIME
          ),
          actual_arrival_time: embedTimeIntoDate(
            selectedFlightDtls.ACTUAL_ARRIVAL_DATE,
            selectedFlightDtls.ACTUAL_ARRIVAL_TIME
          ),
          aircraft_id: selectedFlightDtls.AIRCRAFT_ID,
          gate_number: selectedFlightDtls.GATE_NUMBER,
          terminal: selectedFlightDtls.TERMINAL,
          status: selectedFlightDtls.STATUS,
        },
      })
      .then((response) => {
        
        toast.success("Flight Data updated");
        getFlightData();
      })
      .catch((err) => {
        console.log("SAdasdasd", err);
      });

  }
  return (
    <MainScreen ActiveRoute={ADD_FLIGHTS}>
      <Toaster />
      <div className="p-3">
        <button
          className="mt-5  button"
          type="submit"
          onClick={() => {
            // getCompanyList();
            openModal();
          }}
        >
          Add Flight
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}></h2>
          <div className="flex justify-between p-2">
            <p className="font-semibold text-lg">Add Flight</p>
            <img
              onClick={closeModal}
              src={ICONS.cross_icon}
              style={{
                width: 30,
                height: 30,
                cursor: "pointer",
              }}
            />
          </div>
          <div
            style={{
              backgroundColor: "#dedede",
              height: 1,
            }}
          />
          <form className="gap-5" onSubmit={handleSubmit}>
            <div className="flex gap-2 grid grid-cols-1 lg:w-full lg:mb-0 lg:grid-cols-2">
              <div className="mt-3">
                <p className="font-semibold">Airline</p>
                <div className="mb-2 mt-2 ">
                  <CustomSelect
                    id={"selectItem1"}
                    options={airlineOptions}
                    value={airlineOptions.find(
                      (val) => val.value == formData.AIRLINE_ID
                    )}
                    onChange={(e) => {
                      getAirCraftsData(e.value);
                      setFormData((prev) => ({
                        ...prev,
                        AIRLINE_ID: e.value,
                        AIRLINE_ID_ERROR: false,
                      }));
                    }}
                  />
                  {formData?.AIRLINE_ID_ERROR && (
                    <p className="text-highlight">
                      {" "}
                      Please select Departure Airport Name
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <p className="font-semibold">Air Craft</p>
                <div className="mb-2 mt-2 ">
                  <CustomSelect
                    id={"selectItem1"}
                    options={aircraftsOptions}
                    value={aircraftsOptions.find(
                      (val) => val.value == formData.AIRCRAFT_ID
                    )}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        AIRCRAFT_ID: e.value,
                        AIRCRAFT_ID_ERROR: false,
                      }));
                    }}
                  />
                  {formData?.AIRCRAFT_ID_ERROR && (
                    <p className="text-highlight"> Please select Air Craft</p>
                  )}
                </div>
              </div>
              <div className="">
                <p className="font-semibold">Departure Airport Name</p>
                <div className="mb-3 mt-2 ">
                  <CustomSelect
                    id={"selectItem1"}
                    options={airportOptions}
                    value={airportOptions.find(
                      (val) => val.value == formData.DEPARTURE_AIRPORT_ID
                    )}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        DEPARTURE_AIRPORT_ID: e.value,
                        DEPARTURE_AIRPORT_ID_ERROR: false,
                      }));
                    }}
                  />
                  {formData?.DEPARTURE_AIRPORT_ID_ERROR && (
                    <p className="text-highlight">
                      {" "}
                      Please select Departure Airport Name
                    </p>
                  )}
                </div>
              </div>
              <div className="">
                <p className="font-semibold">Arrival Airport Name</p>
                <div className="mb-3 mt-2 ">
                  <CustomSelect
                    id={"selectItem1"}
                    options={airportOptions}
                    value={airportOptions.find(
                      (val) => val.value == formData.ARRIVAL_AIRPORT_ID
                    )}
                    onChange={(e) => {
                      // setSelectedSubCat(e.value);
                      setFormData((prev) => ({
                        ...prev,
                        ARRIVAL_AIRPORT_ID: e.value,
                        ARRIVAL_AIRPORT_ID_ERROR: false,
                      }));
                    }}
                  />

                  {formData?.ARRIVAL_AIRPORT_ID_ERROR && (
                    <p className="text-highlight">
                      Please select Arrival Airport Name
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold">Departure Date</p>
                <div className="mb-3 mt-2 ">
                  <DatePicker
                    selected={new Date(formData?.DEPARTURE_DATE)}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        DEPARTURE_DATE: e,
                        DEPARTURE_DATE_ERROR: false,
                      }));
                    }}
                    minDate={new Date()}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  {formData?.DEPARTURE_DATE_ERROR && (
                    <p className="text-highlight">
                      Please enter Departure Date
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold">Departure Time</p>
                <div className="mb-3 mt-2 ">
                  <input
                    placeholder="Departure Time"
                    type="time"
                    value={formData.DEPARTURE_TIME}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        DEPARTURE_TIME: e.target.value,
                        DEPARTURE_TIME_ERROR: false,
                      }));
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {formData?.DEPARTURE_TIME_ERROR && (
                    <p className="text-highlight">
                      Please enter Departure Time
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold">Arrival Date</p>
                <div className="mb-3 mt-2 ">
                  <DatePicker
                    selected={new Date(formData?.ARRIVAL_DATE)}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        ARRIVAL_DATE: e,
                        ARRIVAL_DATE_ERROR: false,
                      }));
                    }}
                    minDate={new Date()}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  {formData?.ARRIVAL_DATE_ERROR && (
                    <p className="text-highlight">Please enter Arrival Date</p>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold">Arrival Time</p>
                <div className="mb-3 mt-2 ">
                  <input
                    placeholder="Arrival Time"
                    type="time"
                    value={formData.ARRIVAL_TIME}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        ARRIVAL_TIME: e.target.value,
                        ARRIVAL_TIME_ERROR: false,
                      }));
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {formData?.ARRIVAL_TIME_ERROR && (
                    <p className="text-highlight">Please enter Arrival Time</p>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold">Terminal</p>
                <div className="mb-3 mt-2 ">
                  <input
                    placeholder="Terminal"
                    type="text"
                    value={formData.TERMINAL}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        TERMINAL: e.target.value,
                        TERMINAL_ERROR: false,
                      }));
                    }}
                    className="flex  h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {formData?.TERMINAL_ERROR && (
                    <p className="text-highlight"> Please enter Terminal</p>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold">Gate Number</p>
                <div className=" mt-2 ">
                  <input
                    placeholder="Gate Number"
                    type="text"
                    value={formData.GATE_NUMBER}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        GATE_NUMBER: e.target.value,
                        GATE_NUMBER_ERROR: false,
                      }));
                    }}
                    className="flex h-10 mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {formData?.GATE_NUMBER_ERROR && (
                    <p className="text-highlight"> Please enter gate number</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="button mt-4" type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      </Modal>
      {/* update Modal */}
      <Modal
        isOpen={UpdateFlightModalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeUpdateFlightModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}></h2>
          <div className="flex justify-between p-2">
            <p className="font-semibold text-lg">Update Flight</p>
            <img
              onClick={closeUpdateFlightModal}
              src={ICONS.cross_icon}
              style={{
                width: 30,
                height: 30,
                cursor: "pointer",
              }}
            />
          </div>
          <div
            style={{
              backgroundColor: "#dedede",
              height: 1,
            }}
          />
          <form className="gap-5" onSubmit={handleFlightUpdate}>
            <div className="flex gap-2 grid grid-cols-1 lg:w-full lg:mb-0 lg:grid-cols-2">
              <div className="mt-3">
                <p className="font-semibold">Airline</p>
                <div className="mb-2 mt-2 ">
                  <CustomSelect
                    id={"selectItem1"}
                    IS_DISABLED={true}
                    options={airlineOptions}
                    value={airlineOptions.find(
                      (val) => val.value == selectedFlightDtls.AIRLINE_ID
                    )}
                    onChange={(e) => {
                      getAirCraftsData(e.value);
                      setSelectedFlightDtls((prev) => ({
                        ...prev,
                        AIRLINE_ID: e.value,
                        AIRLINE_ID_ERROR: false,
                      }));
                    }}
                  />
                  {selectedFlightDtls?.AIRLINE_ID_ERROR && (
                    <p className="text-highlight">
                      {" "}
                      Please select Departure Airport Name
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <p className="font-semibold">Air Craft</p>
                <div className="mb-2 mt-2">
                  <CustomSelect
                    id={"selectItem1"}
                    IS_DISABLED={true}
                    options={aircraftsOptions}
                    value={aircraftsOptions.find(
                      (val) => val.value == selectedFlightDtls.AIRCRAFT_ID
                    )}
                    onChange={(e) => {
                      setSelectedFlightDtls((prev) => ({
                        ...prev,
                        AIRCRAFT_ID: e.value,
                        AIRCRAFT_ID_ERROR: false,
                      }));
                    }}
                  />
                  {selectedFlightDtls?.AIRCRAFT_ID_ERROR && (
                    <p className="text-highlight"> Please select Air Craft</p>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Status</p>
                <div className="mb-3 mt-2 ">
                  <CustomSelect
                    id={"selectItem1"}
                    options={FlightStatusArr}
                    value={FlightStatusArr.find(
                      (val) => val.value == selectedFlightDtls.STATUS
                    )}
                    onChange={(e) => {
                      // setSelectedSubCat(e.value);
                      setSelectedFlightDtls((prev) => ({
                        ...prev,
                        STATUS: e.value,
                        STATUS_ERROR: false,
                      }));
                    }}
                  />

                  {selectedFlightDtls?.STATUS_ERROR && (
                    <p className="text-highlight">Please select status</p>
                  )}
                </div>
              </div>
              <div className="">
                <p className="font-semibold">Departure Airport Name</p>
                <div className="mb-3 mt-2 ">
                  <CustomSelect
                    id={"selectItem1"}
                    options={airportOptions}
                    IS_DISABLED={true}
                    value={airportOptions.find(
                      (val) =>
                        val.value == selectedFlightDtls.DEPARTURE_AIRPORT_ID
                    )}
                    onChange={(e) => {
                      setSelectedFlightDtls((prev) => ({
                        ...prev,
                        DEPARTURE_AIRPORT_ID: e.value,
                        DEPARTURE_AIRPORT_ID_ERROR: false,
                      }));
                    }}
                  />
                  {selectedFlightDtls?.DEPARTURE_AIRPORT_ID_ERROR && (
                    <p className="text-highlight">
                      Please select Departure Airport Name
                    </p>
                  )}
                </div>
              </div>
              {selectedFlightDtls.STATUS == "13" && (
                <div className="">
                  <p className="font-semibold">Arrival Airport Name</p>
                  <div className="mb-3 mt-2 ">
                    <CustomSelect
                      id={"selectItem1"}
                      options={airportOptions}
                      value={airportOptions.find(
                        (val) =>
                          val.value == selectedFlightDtls.ARRIVAL_AIRPORT_ID
                      )}
                      onChange={(e) => {
                        // setSelectedSubCat(e.value);
                        setSelectedFlightDtls((prev) => ({
                          ...prev,
                          ARRIVAL_AIRPORT_ID: e.value,
                          ARRIVAL_AIRPORT_ID_ERROR: false,
                        }));
                      }}
                    />

                    {selectedFlightDtls?.ARRIVAL_AIRPORT_ID_ERROR && (
                      <p className="text-highlight">
                        Please select Arrival Airport Name
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="font-semibold">Schedule Departure Date</p>
                <div className="mb-3 mt-2 ">
                  <DatePicker
                    selected={new Date(selectedFlightDtls?.DEPARTURE_DATE)}
                    disabled
                    onChange={(e) => {
                      setSelectedFlightDtls((prev) => ({
                        ...prev,
                        DEPARTURE_DATE: e,
                        DEPARTURE_DATE_ERROR: false,
                      }));
                    }}
                    minDate={new Date()}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  {selectedFlightDtls?.DEPARTURE_DATE_ERROR && (
                    <p className="text-highlight">
                      Please enter Schedule Departure Date
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold">Schedule Departure Time</p>
                <div className="mb-3 mt-2 ">
                  <input
                    placeholder="Departure Time"
                    disabled
                    type="time"
                    value={selectedFlightDtls.DEPARTURE_TIME}
                    onChange={(e) => {
                      setSelectedFlightDtls((prev) => ({
                        ...prev,
                        DEPARTURE_TIME: e.target.value,
                        DEPARTURE_TIME_ERROR: false,
                      }));
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {selectedFlightDtls?.DEPARTURE_TIME_ERROR && (
                    <p className="text-highlight">
                      Please enter Schedule Departure Time
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="font-semibold">Schedule Arrival Date</p>
                <div className="mb-3 mt-2 ">
                  <DatePicker
                    selected={new Date(selectedFlightDtls?.ARRIVAL_DATE)}
                    disabled
                    onChange={(e) => {
                      setSelectedFlightDtls((prev) => ({
                        ...prev,
                        ARRIVAL_DATE: e,
                        ARRIVAL_DATE_ERROR: false,
                      }));
                    }}
                    minDate={new Date()}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  {selectedFlightDtls?.ARRIVAL_DATE_ERROR && (
                    <p className="text-highlight">
                      Please enter Schedule Arrival Date
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold">Arrival Time</p>
                <div className="mb-3 mt-2 ">
                  <input
                    placeholder="Arrival Time"
                    type="time"
                    disabled
                    value={selectedFlightDtls.ARRIVAL_TIME}
                    onChange={(e) => {
                      setSelectedFlightDtls((prev) => ({
                        ...prev,
                        ARRIVAL_TIME: e.target.value,
                        ARRIVAL_TIME_ERROR: false,
                      }));
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {selectedFlightDtls?.ARRIVAL_TIME_ERROR && (
                    <p className="text-highlight">Please enter Arrival Time</p>
                  )}
                </div>
              </div>
              {(selectedFlightDtls.STATUS == "3" ||
                selectedFlightDtls.STATUS == "4") && (
                <>
                  <div>
                    <p className="font-semibold">Actual Departure Date</p>
                    <div className="mb-3 mt-2 ">
                      <DatePicker
                        selected={
                          new Date(selectedFlightDtls?.ACTUAL_DEPARTURE_DATE)
                        }
                        onChange={(e) => {
                          setSelectedFlightDtls((prev) => ({
                            ...prev,
                            ACTUAL_DEPARTURE_DATE: e,
                            ACTUAL_DEPARTURE_DATE_ERROR: false,
                          }));
                        }}
                        minDate={new Date()}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />

                      {selectedFlightDtls?.ACTUAL_DEPARTURE_DATE_ERROR && (
                        <p className="text-highlight">
                          Please enter Actual Departure Date
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Actual Departure Time</p>
                    <div className="mb-3 mt-2 ">
                      <input
                        placeholder="Departure Time"
                        type="time"
                        value={selectedFlightDtls.ACTUAL_DEPARTURE_TIME}
                        onChange={(e) => {
                          setSelectedFlightDtls((prev) => ({
                            ...prev,
                            ACTUAL_DEPARTURE_TIME: e.target.value,
                            ACTUAL_DEPARTURE_TIME_ERROR: false,
                          }));
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      {selectedFlightDtls?.ACTUAL_DEPARTURE_TIME_ERROR && (
                        <p className="text-highlight">
                          Please enter Actual Departure Time
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Actual Arrival Date</p>
                    <div className="mb-3 mt-2 ">
                      <DatePicker
                        selected={
                          new Date(selectedFlightDtls?.ACTUAL_ARRIVAL_DATE)
                        }
                        onChange={(e) => {
                          setSelectedFlightDtls((prev) => ({
                            ...prev,
                            ACTUAL_ARRIVAL_DATE: e,
                            ACTUAL_ARRIVAL_DATE_ERROR: false,
                          }));
                        }}
                        minDate={new Date()}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />

                      {selectedFlightDtls?.ACTUAL_ARRIVAL_DATE_ERROR && (
                        <p className="text-highlight">
                          Please enter Actual Arrival Date
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Actual Arrival Time</p>
                    <div className="mb-3 mt-2 ">
                      <input
                        placeholder="Departure Time"
                        type="time"
                        value={selectedFlightDtls.ACTUAL_ARRIVAL_TIME}
                        onChange={(e) => {
                          setSelectedFlightDtls((prev) => ({
                            ...prev,
                            ACTUAL_ARRIVAL_TIME: e.target.value,
                            ACTUAL_ARRIVAL_TIME_ERROR: false,
                          }));
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      {selectedFlightDtls?.ACTUAL_ARRIVAL_TIME_ERROR && (
                        <p className="text-highlight">
                          Please enter Actual Arrival Time
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
              {selectedFlightDtls.STATUS == "18" && (
                <div>
                  <p className="font-semibold">Terminal</p>
                  <div className="mb-3 mt-2 ">
                    <input
                      placeholder="Terminal"
                      type="text"
                      value={selectedFlightDtls.TERMINAL}
                      onChange={(e) => {
                        setSelectedFlightDtls((prev) => ({
                          ...prev,
                          TERMINAL: e.target.value,
                          TERMINAL_ERROR: false,
                        }));
                      }}
                      className="flex  h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {selectedFlightDtls?.TERMINAL_ERROR && (
                      <p className="text-highlight"> Please enter Terminal</p>
                    )}
                  </div>
                </div>
              )}

              {selectedFlightDtls.STATUS == "17" && (
                <div>
                  <p className="font-semibold">Gate Number</p>
                  <div className=" mt-2 ">
                    <input
                      placeholder="Gate Number"
                      type="text"
                      value={selectedFlightDtls.GATE_NUMBER}
                      onChange={(e) => {
                        setSelectedFlightDtls((prev) => ({
                          ...prev,
                          GATE_NUMBER: e.target.value,
                          GATE_NUMBER_ERROR: false,
                        }));
                      }}
                      className="flex h-10 mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {selectedFlightDtls?.GATE_NUMBER_ERROR && (
                      <p className="text-highlight">
                        {" "}
                        Please enter gate number
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button className="button mt-4" type="submit">
                Update Flight
              </button>
            </div>
          </form>
        </div>
      </Modal>
      {/* History modal */}
      <Modal
        isOpen={historyFlightModalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeHistoryFlightModal}
        style={customHistoryStyles}
        // className={"min-w-full"}
        //  className={"modal-style w-full"}
        contentLabel="Example Modal"
      >
        <div className="flex justify-between p-2">
          <p className="font-semibold text-lg">Flight History</p>
          <img
            onClick={closeHistoryFlightModal}
            src={ICONS.cross_icon}
            style={{
              width: 30,
              height: 30,
              cursor: "pointer",
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: "#dedede",
            height: 1,
          }}
        />
        <div className="p-2">
          <ReactDataTable
            columns={HistoryColumns}
            data={selectedFlightHistory}
            loading={true}
          />
        </div>{" "}
      </Modal>
      <div className="p-2">
        <ReactDataTable columns={columns} data={Tbody} loading={true} />
      </div>{" "}
    </MainScreen>
  );
}

export default AddFlight;
