import { createContext, useContext } from "react";

type Profile = {
  user: any;
};

const profile: Profile = {
  user: undefined,
};

//TODO: add user theme and context here.
export const UserContext = createContext(profile);

export const useUserContext = () => {
  const { user } = useContext(UserContext);
  return { user };
};
