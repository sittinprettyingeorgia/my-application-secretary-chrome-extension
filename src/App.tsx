import { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import reactLogo from "./assets/react.svg";
import { SignInHeader, Header, Footer, SignInFooter } from "./login";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import awsconfig from "./aws-exports";
import { UserContext, useUserContext } from "./context/UserContext";
import theme from "./theme";

// const getCognitoUser = (AccessToken) => {
//   try {
//     const client = new CognitoIdentityProviderClient({
//       region: process.env.REGION,
//     });
//     let user;

//     // Set up the GetUser command with the user access token
//     const getUserCommand = new GetUserCommand({
//       AccessToken,
//     });

//     user = await client.send(getUserCommand);

//     // Call the GetUser command to get user information from AWS Cognito
//     const command = new AdminGetUserCommand({
//       UserPoolId: process.env.AUTH_MYAPPLICATIONSECRETARYAMPLIFY_USERPOOLID,
//       Username: user.Username,
//     });

//     this.authUser = await client.send(command);
//   } catch (e) {
//     console.log(e);
//   }
// };

const App = () => {
  return (
    <main>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <Box>WELCOME!!!</Box>
        </StyledThemeProvider>
      </ThemeProvider>
    </main>
  );
};

export default App;
