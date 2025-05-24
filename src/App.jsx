import TeamMaker from "./components/TeamMaker"; 
import DummyData from "../public/DummyData";   

function App() {

  return (
    <div className="App">
      <TeamMaker
        teams={DummyData}
      />
    </div>
  );
}

export default App;
