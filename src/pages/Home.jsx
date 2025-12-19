import SubNavbar from "../components/SubNavbar/SubNavbar";
import Background from "../components/Background/Background";
import DealsAndHighLights from "../components/DealsAndHighlights/DealsAndHighLights";
import TourList from "../components/Activity/TourList";
import TopRatedTours from "../components/Activity/TopRatedTours";
const Home = () => {
  return (
    <div>
      <SubNavbar></SubNavbar>
      <Background></Background>
      <DealsAndHighLights></DealsAndHighLights>
      <TourList></TourList>
      <TopRatedTours></TopRatedTours>
    </div>
  );
};

export default Home;
