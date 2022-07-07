import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SearchScreen } from "./containers/searchScreen/SearchScreen";
import { UserScreen } from "./containers/userScreen/UserScreen";

import "./reset.css";
import { useWindowSize } from "./hooks/useWindowSize";
import { DesktopInfoScreen } from "./containers/desktopInfoScreen/DesktopInfoScreen";

function App() {
  const windowSize = useWindowSize();

  if (windowSize.width >= 1024) {
    return <DesktopInfoScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchScreen />} />
        <Route path="/user" element={<UserScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
