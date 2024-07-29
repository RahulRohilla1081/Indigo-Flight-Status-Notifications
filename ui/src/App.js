import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Screens/Dashboard";
import { ADD_AIRLINES, ADD_AIRPORT, ADD_FLIGHTS, SEARCH_PNR } from "./utils/Routes";
import AddAirlines from "./Screens/AddAirlines";
import AddAirport from "./Screens/AddAirport";
import AddFlight from "./Screens/AddFlight";
import SearchPNR from "./Screens/SearchPNR";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Dashboard />} />
        <Route path={ADD_AIRLINES} element={<AddAirlines />} />
        <Route path={ADD_AIRPORT} element={<AddAirport />} />
        <Route path={ADD_FLIGHTS} element={<AddFlight />} />
        <Route path={SEARCH_PNR} element={<SearchPNR />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
