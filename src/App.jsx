import {
  BrowserRouter as Router
} from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
};

export default App;
