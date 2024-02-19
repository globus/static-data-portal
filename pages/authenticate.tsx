import React from "react";
import { Text } from "@chakra-ui/react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";

export default function Authenticate() {
  const auth = useAuth();
  const router = useRouter();

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <Text>Signing you in...</Text>;
    case "signoutRedirect":
      return <Text>Signing you out...</Text>;
  }

  if (auth.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (auth.error) {
    return <Text>Oops... {auth.error.message}</Text>;
  }

  if (auth.isAuthenticated) {
    router.replace("/");
    return;
  }
  return <button onClick={() => auth.signinRedirect()}>Log in</button>;
}
