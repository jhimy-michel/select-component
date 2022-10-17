import { useState } from "react";
import Select from "./Select";

const options = [
  { label: "first", value: 1 },
  { label: "second", value: 2 },
  { label: "third", value: 3 },
];

function App() {
  return <Select options={options} />;
}

export default App;
