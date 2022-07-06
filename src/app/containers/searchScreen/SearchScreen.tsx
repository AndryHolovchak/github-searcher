import React, { useEffect } from "react";
import { Input } from "../../../components/input/Input";
import { updateSearchAction } from "../../../sagas/userSearchSaga";
import {
  selectUserSearchIsLoading,
  selectUserSearchQuery,
  selectUserSearchResult,
} from "../../../slices/userSearchSlice";
import { UserInfo } from "../../../types/types";
import { useAppDispatch, useAppSelector } from "../../hooks";
import styles from "./searchScreen.module.scss";

export const SearchScreen = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectUserSearchQuery);
  const isLoading = useAppSelector(selectUserSearchIsLoading);
  const searchResult = useAppSelector(selectUserSearchResult);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSearchAction({ value: e.target.value }));
  };

  return (
    <div className={styles.search_screen}>
      <header className={styles.search_screen__header}>
        <h1 className={styles.search_screen__header_title}>GitHub Searcher</h1>
        <Input value={searchQuery} onChange={handleInputChange} placeholder="Search for Users" />
      </header>
      <ul className={styles.search_screen__result}>
        {isLoading ? (
          <div className={styles.search_screen__loading_message}>
            <span>Loading...</span>
          </div>
        ) : (
          searchResult.map((e, i) => <SearchResultItem key={i} userInfo={e} />)
        )}
      </ul>
    </div>
  );
};

interface SearchResultItemProps {
  userInfo: UserInfo;
}

const SearchResultItem = ({ userInfo }: SearchResultItemProps) => {
  return (
    <li className={styles.search_result_item}>
      <img src={userInfo.avatar} className={styles.search_result_item__avatar} />
      <span className={styles.search_result_item__name}>{userInfo.name}</span>
      <span className={styles.search_result_item__number_of_repos}>Repo: {userInfo.numberOfRepos}</span>
    </li>
  );
};
