import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import reactLogo from "./assets/react.svg";
import { Amplify, Auth } from "aws-amplify";
import {
  withAuthenticator,
  WithAuthenticatorProps,
} from "@aws-amplify/ui-react";
import { SignInHeader, Header, Footer, SignInFooter } from "./login";

Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: "us-east-1:0d0eb3be-0186-4f11-9863-44d32f45b070",

    // REQUIRED - Amazon Cognito Region
    region: "us-east-1",
  },
  oauth: {
    domain: "nzsfjm18d6cv-dev.auth.us-east-1.amazoncognito.com",
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn:
      "https://dev.myapplicationsecretary.com,http://localhost:3000",
    redirectSignOut:
      "https://dev.myapplicationsecretary.com,http://localhost:3000",
    responseType: "code",
  },
});
// You can get the current config object
const currentConfig = Auth.configure();

interface Props extends WithAuthenticatorProps {
  isPassedToWithAuthenticator: boolean;
}

const App = ({ isPassedToWithAuthenticator, signOut, user }: Props) => {
  const [appUser, setAppUser] = useState<any>();

  if (!isPassedToWithAuthenticator) {
    throw new Error(`isPassedToWithAuthenticator was not provided`);
  }

  const retrieveCurrentAppUser = async (currentAuthUser: any) => {
    console.log(currentAuthUser);
    let currentUser;

    try {
      currentUser = undefined;
      setAppUser(currentUser);
    } catch (e: any) {
      if (
        e.errors.find((t: any) => t.errorType === "Unauthorized") &&
        currentAuthUser.username
      ) {
        // user is not authorized, prompt signup
      }
      //TODO: we should add error logging
    }
  };

  useEffect(() => {
    retrieveCurrentAppUser(user);
  }, [user]);

  return (
    <main>
      <Box>WELCOME!!!</Box>
    </main>
  );
};

export default withAuthenticator(App);

export async function getStaticProps() {
  return {
    props: {
      isPassedToWithAuthenticator: true,
    },
  };
}
