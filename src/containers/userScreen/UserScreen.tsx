import React, { useEffect, useRef } from "react";
import {
  selectReposSearchQuery,
  selectUserInfo,
  selectUserRepos,
  setReposSearchQuery,
} from "../../slices/userPreviewSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "./userScreen.module.scss";
import { formatDate } from "../../utils/dateUtils";
import { Header } from "../../components/header/Header";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/input/Input";
import { loadUserReposAction } from "../../sagas/userPreviewSaga";
import { Repository, User } from "../../types/types";
import { LoadingMessage } from "../../components/loadingMessage/LoadingMessage";

export const UserScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUserInfo);
  const searchQuery = useAppSelector(selectReposSearchQuery);
  const repos = useAppSelector(selectUserRepos);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (!repos) {
      dispatch(loadUserReposAction());
    }
  }, []);

  if (!user) {
    return <></>;
  }

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setReposSearchQuery(e.target.value));
  };

  const filteredRepos = repos?.filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  return (
    <div className={styles.user_screen}>
      <Header title="GitHub Searcher" className={styles.user_screen__header}>
        <>
          <div className={styles.user_screen__info}>
            <div className={styles.user_screen__info_top}>
              <img src={user.avatar} className={styles.user_screen__avatar} />
              <ul className={styles.user_screen__main_info}>
                <li className={styles.user_screen__main_info_item}>{user.name || "no name"}</li>
                <li className={styles.user_screen__main_info_item}>{user.email || "no email"}</li>
                <li className={styles.user_screen__main_info_item}>{user.location || "no location"}</li>
                <li className={styles.user_screen__main_info_item}>{formatDate(user.joinDate)}</li>
                <li className={styles.user_screen__main_info_item}>{user.followers} followers</li>
                <li className={styles.user_screen__main_info_item}>following {user.following}</li>
              </ul>
            </div>
            <p className={styles.user_screen__bio}>{user.bio}</p>
          </div>
          <Input
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="Search for User's Repositories"
          />
        </>
      </Header>
      {repos ? (
        <ul className={styles.user_screen__repositories}>
          {filteredRepos.map((e, i) => (
            <RepositoryItem key={i} repository={e} user={user} />
          ))}
        </ul>
      ) : (
        <LoadingMessage />
      )}
    </div>
  );
};

interface RepositoryItemProps {
  repository: Repository;
  user: User;
}

const RepositoryItem = ({ repository, user }: RepositoryItemProps) => {
  return (
    <li className={styles.repository_item}>
      <a
        className={styles.repository_item__link}
        href={`https://github.com/${user.login}/${repository.name}`}
        target="_blank"
      >
        <span className={styles.repository_item__name}>{repository.name}</span>
        <div className={styles.repository_item__stats}>
          <span className={styles.repository_item__forks}>{repository.forks} Forks</span>
          <span className={styles.repository_item__stars}>{repository.stars} Stars</span>
        </div>
      </a>
    </li>
  );
};
