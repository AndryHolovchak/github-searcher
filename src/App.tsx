import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SearchScreen } from "./app/containers/searchScreen/SearchScreen";
import "./App.scss";
import "./reset.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
