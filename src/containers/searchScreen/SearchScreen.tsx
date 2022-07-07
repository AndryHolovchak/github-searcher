import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadNextResultAction, updateSearchAction } from "../../sagas/userSearchSaga";
import { selectUserSearchQuery, selectUserSearchResult } from "../../slices/userSearchSlice";
import { User } from "../../types/types";
import { Input } from "../../components/input/Input";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "./searchScreen.module.scss";
import { changePreviewUserAction } from "../../sagas/userPreviewSaga";
import { Header } from "../../components/header/Header";
import { LoadingMessage } from "../../components/loadingMessage/LoadingMessage";

export const SearchScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectUserSearchQuery);
  const searchResult = useAppSelector(selectUserSearchResult);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSearchAction({ value: e.target.value }));
  };

  const handleResultClick = (e: React.MouseEvent<HTMLElement>) => {
    const itemIndex = (e.target as HTMLElement).dataset["itemIndex"];

    if (itemIndex && searchResult) {
      navigate("/user");
      dispatch(changePreviewUserAction({ data: searchResult[+itemIndex] }));
    }
  };

  const handleResultScroll = (e: React.UIEvent) => {
    const target: HTMLElement = e.target as HTMLElement;
    const scrolledToBottom = target.scrollTop + target.clientHeight === target.scrollHeight;

    if (scrolledToBottom && searchResult && searchResult.length > 0) {
      dispatch(loadNextResultAction());
    }
  };

  return (
    <div className={styles.search_screen}>
      <Header title="GitHub Searcher">
        <Input value={searchQuery} onChange={handleInputChange} placeholder="Search for Users" />
      </Header>
      {!searchResult ? (
        <LoadingMessage />
      ) : (
        <ul
          onScroll={handleResultScroll}
          className={styles.search_screen__result}
          onClick={handleResultClick}
        >
          {searchResult.map((e, i) => (
            <SearchResultItem data-item-index={i.toString()} key={i} userInfo={e} />
          ))}
        </ul>
      )}
    </div>
  );
};

interface SearchResultItemProps {
  userInfo: User;
  "data-item-index": string;
}

const SearchResultItem = (props: SearchResultItemProps) => {
  return (
    <li className={styles.search_result_item} data-item-index={props["data-item-index"]}>
      <img src={props.userInfo.avatar} className={styles.search_result_item__avatar} />
      <span className={styles.search_result_item__name}>{props.userInfo.name || props.userInfo.login}</span>
      <span className={styles.search_result_item__number_of_repos_prefix}>Repo: </span>
      <span className={styles.search_result_item__number_of_repos}>{props.userInfo.numberOfRepos}</span>
    </li>
  );
};
