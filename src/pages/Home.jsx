import SubNavbar from "../components/SubNavbar/SubNavbar";
import Background from "../components/Background/Background";
import DealsAndHighLights from "../components/DealsAndHighlights/DealsAndHighLights";
import TourList from "../components/Activity/TourList";
const Home = () => {
  return (
    <div>
      <SubNavbar></SubNavbar>
      <Background></Background>
      <DealsAndHighLights></DealsAndHighLights>
      <TourList></TourList>
    </div>
  );
};

export default Home;
