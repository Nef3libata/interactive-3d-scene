import { Header } from "./components/Header/Header";
import { LeftSidebar } from "./components/LeftSidebar/LeftSidebar";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app__content">
        <LeftSidebar />
      </div>
    </div>
  );
}

export default App;
