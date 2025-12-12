import {
  BrowserRouter as Router
} from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/common/ScrollToTop";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </UserProvider>
  );
};

export default App;
