export interface User {
  login: string;
  name: string;
  email: string;
  location: string;
  avatar: string;
  joinDate: Date;
  followers: number;
  following: number;
  numberOfRepos: number;
  bio: string;
}

export interface Repository {
  name: string;
  forks: number;
  stars: number;
}
