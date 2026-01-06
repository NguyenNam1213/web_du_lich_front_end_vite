import SubNavbar from "../components/SubNavbar/SubNavbar";
import Background from "../components/Background/Background";
import DealsAndHighLights from "../components/DealsAndHighlights/DealsAndHighLights";
import TourList from "../components/Activity/TourList";
import RecommendedTours from "../components/Activity/RecommendedTours";
import TopRatedTours from "../components/Activity/TopRatedTours";
import SuggestedTours from "../components/Activity/SuggestedTours";
const Home = () => {
  return (
    <div>
      <SubNavbar></SubNavbar>
      <Background></Background>
      <DealsAndHighLights></DealsAndHighLights>
      <TourList></TourList>
      {/* <RecommendedTours></RecommendedTours> */}
      <TopRatedTours></TopRatedTours>
      <SuggestedTours></SuggestedTours>
    </div>
  );
};

export default Home;
