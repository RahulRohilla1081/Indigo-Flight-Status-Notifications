
import React, { useEffect, useState } from "react";
import MainScreen from "../Components/AppDrawer/MainScreen";
import {  ADD_AIRPORT } from "../utils/Routes";
import ReactDataTable from "../Components/DataTable/ReactDataTable";
import Modal from "react-modal";

import ICONS from "../assets/ICONS";
import axios from "../utils/CustomAxios";
import AXIOS from "../utils/AXIOS";

// Modal.setAppElement("#AddAirlines");

function AddAirport() {
  const [Tbody, setTbody] = useState([]);

  const [formData, setFormData] = useState({
    AIRPORT_NAME: "",
    AIRPORT_NAME_ERROR: false,
    CITY:"",
    CITY_ERROR:false,
    COUNTRY: "",
    COUNTRY_ERROR: false,
    IATA_CODE: "",
    IATA_CODE_ERROR: false,
    ICAO_CODE: "",
    ICAO_CODE_ERROR: false,
  });

  useEffect(() => {
    getAirportList();
  }, []);
  const getAirportList = () => {
    console.log("Asdkhabsdkasd", AXIOS.axiosUrl + AXIOS.getAirline);
    axios
      .post(AXIOS.axiosUrl + AXIOS.getAirports)
      .then((response) => {
        console.log("Asdasdsa", response);
        setTbody(response);
      })
      .catch((err) => {
        console.log("sdjnasd", err);
      });
  };
  const columns = [
    {
      name: "Airport ID",
      selector: (val) => val.airport_id,
      sortable: false,
      // width: "80px",
      // cell: (val, index) => (
      //   <input
      //     type="checkbox"
      //     checked={val?.IS_CHECKED}
      //     onClick={() => {
      //       handleClickedRowCheckBox(val, index);
      //     }}
      //   />
      // ),
    },
    {
      name: "Airport Name",
      selector: (val) => val.name,
      sortable: false,
    },
    {
      name: "City",
      selector: (val) => val.city,
      sortable: false,
    },
    {
      name: "Country",
      selector: (val) => val.country,
      sortable: false,
    },
    {
      name: "IATA Code",
      selector: (val) => val.iata_code,
      sortable: false,
    },
    {
      name: "ICAO Code",
      selector: (val) => val.icao_code,
      sortable: false,
    },
  ];
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "400px",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
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
      console.log("asdhbaghdbasdas", payload);

     axios
       .post(AXIOS.axiosUrl + AXIOS.createAirport, {
         filter: {
           name: payload.AIRPORT_NAME,
           city: payload.CITY,
           country: payload.COUNTRY,
           iata_code: payload.IATA_CODE,
           icao_code: payload.ICAO_CODE,
         },
       })
       .then((response) => {
         getAirportList();
         closeModal();

         Object.keys(tempFormData).map((key, colIndex) => {
           if (typeof tempFormData[key] != "boolean") {
             tempFormData[key] = "";
           }
         });
       })
       .catch((err) => {
         console.log("SAdasdasd", err);
       });
    }
    setFormData(tempFormData);
  };

  return (
    <MainScreen ActiveRoute={ADD_AIRPORT}>
      {/* <button onClick={openModal}>Open Modal</button> */}
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
            <p className="font-semibold text-lg">Add Airport</p>
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
            <p>Airport Name</p>
            <div className="mb-3 mt-2 ">
              <input
                placeholder="Airport Name"
                type="text"
                value={formData.AIRPORT_NAME}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    AIRPORT_NAME: e.target.value,
                    AIRPORT_NAME_ERROR: false,
                  }));
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {formData?.AIRPORT_NAME_ERROR && (
                <p className="text-highlight"> Please enter Airport Name</p>
              )}
            </div>

            <p>City</p>
            <div className="mb-3 mt-2 ">
              <input
                placeholder="City"
                type="text"
                value={formData.CITY}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    CITY: e.target.value,
                    CITY_ERROR: false,
                  }));
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {formData?.CITY_ERROR && (
                <p className="text-highlight">Please enter Country</p>
              )}
            </div>
            <p>Country</p>
            <div className="mb-3 mt-2 ">
              <input
                placeholder="Country"
                type="text"
                value={formData.COUNTRY}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    COUNTRY: e.target.value,
                    COUNTRY_ERROR: false,
                  }));
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {formData?.COUNTRY_ERROR && (
                <p className="text-highlight">Please enter Country</p>
              )}
            </div>

            <p>IATA Code</p>
            <div className="mb-3 mt-2 ">
              <input
                placeholder="IATA Code"
                type="text"
                value={formData.IATA_CODE}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    IATA_CODE: e.target.value,
                    IATA_CODE_ERROR: false,
                  }));
                }}
                className="flex  h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {formData?.IATA_CODE_ERROR && (
                <p className="text-highlight"> Please enter IATA Code</p>
              )}
            </div>

            <p>ICAO Code</p>
            <div className=" mt-2 ">
              <input
                placeholder="ICAO Code"
                type="text"
                value={formData.ICAO_CODE}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    ICAO_CODE: e.target.value,
                    ICAO_CODE_ERROR: false,
                  }));
                }}
                className="flex h-10 mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {formData?.ICAO_CODE_ERROR && (
                <p className="text-highlight"> Please enter ICAO Code</p>
              )}
            </div>

            <div className="flex justify-end">
              <button className="button mt-4" type="submit">
                {" "}
                Create
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <div className="flex flex-row-reverse m-2">
        <button
          className="mt-5  button"
          type="submit"
          onClick={() => {
            // getCompanyList();
            openModal();
          }}
        >
          Add Airport
        </button>
      </div>
      <div className="min-w-full">
        <ReactDataTable columns={columns} data={Tbody} loading={true} />
      </div>
    </MainScreen>
  );
}

export default AddAirport;
