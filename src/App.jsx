import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import "../main.scss";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
