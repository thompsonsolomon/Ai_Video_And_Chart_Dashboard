import HeroSection from "./Components/HeroSection";
import DashboardCards from "./Components/Cards";
import Chat from "./Components/Chart";

function App() {
  return (
    <div className="flex gap-4 bg-gray-100">
      <div className="right">
      <HeroSection />
      <DashboardCards />
      </div>
      <div className="left">
        <Chat />
      </div>
    </div>
  );
}

export default App;
