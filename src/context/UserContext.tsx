import { createContext, useContext } from "react";

type Profile = {
  user: any;
  signOut: any;
};

const profile: Profile = {
  user: undefined,
  signOut: undefined,
};

//TODO: add user theme and context here.
export const UserContext = createContext(profile);

export const useUserContext = () => {
  const { user, signOut } = useContext(UserContext);
  return { user, signOut };
};
