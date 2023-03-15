import { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import reactLogo from "./assets/react.svg";
import { SignInHeader, Header, Footer, SignInFooter } from "./login";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import awsconfig from "./aws-exports";
import { UserContext, useUserContext } from "./context/UserContext";
import theme from "./theme";

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
