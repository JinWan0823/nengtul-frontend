import RecipeVideo from "../RecipeViewComponents/RecipeVideo";
import RecipeViewInfo from "../RecipeViewComponents/RecipeViewInfo";
import RequirerIngredient from "../RecipeViewComponents/RequireIngredient";
import RecipeIntro from "../RecipeViewComponents/RecipeIntro";
import RecipeStepCard from "../RecipeViewComponents/RecipeStepCard";
import { styled } from "styled-components";
import theme from "../../common/theme";
import RecipeComment from "../RecipeViewComponents/RecipeComment";
import ContensWrap from "../../common/ContentsWrap";
import { useParams, useNavigate } from "react-router-dom";
import { deleteData, getData } from "../../axios";
import { RECIPE_DETAIL_URL, RECIPE_URL } from "../../url";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import RecipeMainBanner from "./RecipeMainBanner";
import UpdateDeleteBtn from "./UpdateDeleteBtn";
import ComfirmModal from "../../Modal/ConfirmModal";

interface RecipeData {
  category: string;
  cookingStep: string;
  cookingTime: string;
  createAt: string;
  id: string;
  imageUrl: string;
  ingredient: string;
  intro: string;
  modifiedAt: string;
  nickName: string;
  serving: string;
  thumbnailUrl: string;
  title: string;
  userId: number;
  videoUrl: string;
  viewCount: number;
  point: number;
  userProfileUrl: string;
}

export default function RecipeViewWrap() {
  const navigate = useNavigate();
  const Token = useSelector((state: RootState) => state.accessTokenValue);
  const { accessTokenValue } = Token;
  const MY_TOKEN = accessTokenValue;

  const [step, setStep] = useState<string[]>([]);
  const [imgArr, setImgArr] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [recipe, setRecipe] = useState<RecipeData>({
    category: "",
    cookingStep: "",
    cookingTime: "",
    createAt: "",
    id: "",
    imageUrl: "",
    ingredient: "",
    intro: "",
    modifiedAt: "",
    nickName: "",
    serving: "",
    thumbnailUrl: "",
    title: "",
    userId: 0,
    videoUrl: "",
    viewCount: 0,
    point: 0,
    userProfileUrl: "",
  });
  const { recipeId } = useParams();
  const url = `${RECIPE_DETAIL_URL}/${recipeId}`;
  const deleteUrl = `${RECIPE_URL}/${recipe.id}`;

  useEffect(() => {
    getData(url)
      .then((response) => {
        const responseData = response as RecipeData;
        setRecipe(responseData);
        setStep(responseData.cookingStep.split("\\"));
        setImgArr(responseData.imageUrl.split("\\"));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [recipe.cookingStep]);

  const handleDelete = () => {
    deleteData(deleteUrl, MY_TOKEN as string)
      .then((data) => {
        console.log(data);
        setModalOpen(false);
        navigate(-1);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleUpdate = () => {
    console.log(recipe);
    navigate(`/update/${recipe.id}`, { state: { recipeData: recipe } });
  };

  return (
    <>
      {modalOpen && <ComfirmModal closeModal={closeModal} handleDelete={handleDelete} />}
      <ContensWrap>
        {/* <RecipeVideo /> */}
        {recipe.videoUrl ? (
          <RecipeVideo video={recipe.videoUrl} />
        ) : (
          <RecipeMainBanner thumb={recipe.thumbnailUrl} />
        )}
        <UpdateDeleteBtn handleUpdate={handleUpdate} handleModal={handleModal} />
        <RecipeViewInfo
          title={recipe.title}
          nickName={recipe.nickName}
          serving={recipe.serving}
          cookingTime={recipe.cookingTime}
          point={recipe.point}
          userProfileUrl={recipe.userProfileUrl}
        />
        <RequirerIngredient ingredient={recipe.ingredient} />
        <RecipeIntro thumbnailUrl={recipe.thumbnailUrl} intro={recipe.intro} />
        <ul>
          {step.length > 0 &&
            step.map((step, index) => (
              <RecipeStepCard key={index} count={index + 1} cookingStep={step} imgArr={imgArr} />
            ))}
        </ul>
        <RecipeSaveBtn>레시피 저장</RecipeSaveBtn>
        <RecipeComment />
      </ContensWrap>
      ;
    </>
  );
}

const RecipeSaveBtn = styled.button`
  background-color: ${theme.colors.main};
  width: 92%;
  margin: 0 auto;
  margin-top: 40px;
  display: block;
  padding: 12px 0px;
  font-size: 16rem;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  border-radius: 5px;
`;
