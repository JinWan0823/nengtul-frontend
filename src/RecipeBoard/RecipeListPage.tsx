import Header from "../common/Header";
import MobileWrap from "../common/MobileWrap";
import styled from "styled-components";
import theme from "../common/theme";
import { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import RecipeListCard from "./RecipeListCard";
import axios from "axios";
import { useInView } from "react-intersection-observer";

export interface Post {
  id: number;
  title: string;
  thumb: string;
  like: number;
  writer: string;
}

export default function RecipeListPage() {
  const [category, setCategory] = useState("전체");
  const [viewCount, setViewCount] = useState("인기순");
  const [categoryView, setCategoryView] = useState(false);
  const [viewCountView, setViewCountView] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const page = useRef<number>(1);
  const [ref, inView] = useInView();

  const fetch = useCallback(async () => {
    try {
      const { data } = await axios.get<Post[]>(
        `http://localhost:5000/posts?_limit=5&_page=${page.current}`
      );
      setPosts((prevPosts) => [...prevPosts, ...data]);
      setHasNextPage(data.length === 5);
      if (data.length) {
        page.current += 1;
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    console.log(inView, hasNextPage);
    const fetchData = () => {
      if (inView && hasNextPage) {
        fetch().catch((error) => {
          console.error(error);
        });
      }
    };
    fetchData();
  }, [fetch, hasNextPage, inView]);

  const selectOpt = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value;
    setCategory(value);
    setCategoryView(!categoryView);
  };

  const selectViewOpt = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value;
    setViewCount(value);
    setViewCountView(!viewCountView);
  };

  return (
    <MobileWrap>
      <Header />
      <ListWrap>
        <CategoryBtn>
          <button
            onClick={() => {
              setCategoryView(!categoryView);
            }}
          >
            {category}
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
          {categoryView && (
            <ul>
              <li>
                <button onClick={selectOpt} value="전체">
                  전체
                </button>
              </li>
              <li>
                <button onClick={selectOpt} value="한식">
                  한식
                </button>
              </li>
              <li>
                <button onClick={selectOpt} value="중식">
                  중식
                </button>
              </li>
              <li>
                <button onClick={selectOpt} value="일식">
                  일식
                </button>
              </li>
            </ul>
          )}
        </CategoryBtn>
        <CategoryBtn>
          <button
            onClick={() => {
              setViewCountView(!viewCountView);
            }}
          >
            {viewCount}
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
          {viewCountView && (
            <ul>
              <li>
                <button onClick={selectViewOpt} value="인기순">
                  인기순
                </button>
              </li>
              <li>
                <button onClick={selectViewOpt} value="최신순">
                  최신순
                </button>
              </li>
            </ul>
          )}
        </CategoryBtn>
        <CardWrap>
          {posts?.map((post) => (
            <RecipeListCard key={post.id} post={post} />
          ))}
          <div ref={ref} />
        </CardWrap>
      </ListWrap>
    </MobileWrap>
  );
}

const ListWrap = styled.div`
  width: 92%;
  margin: 0 auto;
  padding-top: 70px;
`;

const CategoryBtn = styled.div`
  position: relative;
  font-size: 14rem;
  width: 110px;
  height: 38px;
  border: 2px solid ${theme.colors.main};
  display: inline-block;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.31);
  border-radius: 9px;

  &:nth-of-type(2) {
    margin-left: 4px;
  }

  button {
    padding: 0px 8px;
    width: 100%;
    height: 100%;
    text-align: left;
    font-weight: 800;
    background-color: #fff;
    cursor: pointer;
  }
  & > button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 9px;
  }
  ul {
    position: absolute;
    top: 120%;
    left: 0;
    border: 1px solid #333;
    width: 100%;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.31);
    border-radius: 9px;
    border: 2px solid ${theme.colors.main};
    overflow: hidden;
    li {
      width: 100%;
      height: 38px;
      &:not(:nth-of-type(1)) {
        border-top: 1px solid #c5ffe0;
      }
    }
  }
`;

const CardWrap = styled.ul`
  width: 100%;
`;
