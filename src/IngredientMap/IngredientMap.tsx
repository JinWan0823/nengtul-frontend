import ContensWrap from "../common/ContentsWrap";
import Header from "../common/Header";
import MobileWrap from "../common/MobileWrap";
import TabMenu from "../common/TabMenu";
import MarkerMap from "./MarkerMap";

export default function IngredientMap() {
  return (
    <>
      <MobileWrap>
        <Header />
        <ContensWrap>
          <MarkerMap />
        </ContensWrap>
        <TabMenu />
      </MobileWrap>
    </>
  );
}
