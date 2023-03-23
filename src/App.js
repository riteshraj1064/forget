import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import Form from "./components/Form";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
