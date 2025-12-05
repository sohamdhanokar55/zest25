import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Football from "./pages/Football";
import Cricket from "./pages/Cricket";
import BoxCricket from "./pages/BoxCricket";
import Futsal from "./pages/Futsal";
import Kabaddi from "./pages/Kabaddi";
import Basketball from "./pages/Basketball";
import Badminton from "./pages/Badminton";
import Volleyball from "./pages/Volleyball";
import Athletics from "./pages/Athletics";
import Carrom from "./pages/Carrom";
import Chess from "./pages/Chess";
import TugOfWar from "./pages/TugOfWar";
import BGMI from "./pages/BGMI";
import Valorant from "./pages/Valorant";
import TableTennis from "./pages/TableTennis";
// import Jersey from "./pages/Jersey";

function App() {
  return (
    <BrowserRouter basename="/zest">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/football" element={<Football />} />
        <Route path="/cricket" element={<Cricket />} />
        <Route path="/boxcricket" element={<BoxCricket />} />
        <Route path="/futsal" element={<Futsal />} />
        <Route path="/kabaddi" element={<Kabaddi />} />
        <Route path="/basketball" element={<Basketball />} />
        <Route path="/badminton" element={<Badminton />} />
        <Route path="/volleyball" element={<Volleyball />} />
        <Route path="/athletics" element={<Athletics />} />
        <Route path="/carrom" element={<Carrom />} />
        <Route path="/chess" element={<Chess />} />
        <Route path="/tugofwar" element={<TugOfWar />} />
        <Route path="/bgmi" element={<BGMI />} />
        <Route path="/valorant" element={<Valorant />} />
        <Route path="/tabletennis" element={<TableTennis />} />
        {/* <Route path="/jersey" element={<Jersey />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
