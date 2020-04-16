import React from "react";
import "./App.scss";

import Maze from "./Components/Maze/Maze";

function App() {
  return (
    <div className="App">
      <div className="maze">
        <Maze />
      </div>
    </div>
  );
}

export default App;
