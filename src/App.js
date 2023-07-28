import "./App.css";
import Stopwatch from "./components/stopwatch/Stopwatch";
import Timer from "./components/timer/Timer";
import Tabs from "./components/tabs/Tabs";

function App() {
  const tabs = [
    {
      title: "Stopwatch",
      content: <Stopwatch />,
    },
    {
      title: "Timers",
      content: <Timer />,
    },
  ];

  return (
    <div className="App">
      <Tabs tabs={tabs} />
    </div>
  );
}

export default App;
