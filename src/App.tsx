import { Header } from "./components/Header/Header";
import { LeftSidebar } from "./components/LeftSidebar/LeftSidebar";
import { RightSidebar } from "./components/RightSidebar/RightSidebar";
import { Scene } from "./components/Scene/Scene";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app__content">
        <div className="app__viewport">
          <Scene />
          <LeftSidebar />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}

export default App;
