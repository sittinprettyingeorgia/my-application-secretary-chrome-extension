import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import reactLogo from "./assets/react.svg";
import { Amplify, Auth } from "aws-amplify";
import {
  withAuthenticator,
  WithAuthenticatorProps,
} from "@aws-amplify/ui-react";
import { SignInHeader, Header, Footer, SignInFooter } from "./login";
import awsconfig from "./aws-exports";

Amplify.configure({
  ...awsconfig,
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: "us-east-1:0d0eb3be-0186-4f11-9863-44d32f45b070",

    // REQUIRED - Amazon Cognito Region
    region: "us-east-1",

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "us-east-1_r0KOVwzLe",

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "s3cn4kmffrljtshjbod7vue3i",
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
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <UserContext.Provider value={{ user: appUser, signOut }}>
            <Box>WELCOME!!!</Box>
          </UserContext.Provider>
        </StyledThemeProvider>
      </ThemeProvider>
    </main>
  );
};

export default withAuthenticator(App, {
  components: {
    //Header: Header, this should be custom logo
    SignIn: {
      Header: SignInHeader,
      Footer: SignInFooter,
    },
    Footer,
  },
  socialProviders: ["google"], //TODO: add facebook, apple, amazon, etc logins.
});

export async function getStaticProps() {
  return {
    props: {
      isPassedToWithAuthenticator: true,
    },
  };
}
