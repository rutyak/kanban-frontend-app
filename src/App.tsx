import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

const App: React.FC = () => {

  return (
    <div className="bg-appbgcolor">
          <Navbar/>
          <Outlet/>
    </div>
  );
};

export default App;
