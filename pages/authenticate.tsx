// import React from "react";
import { useRouter } from "next/router";
import { useGlobusAuth } from "@/components/globus-auth-context/useGlobusAuth";

export default function Authenticate() {
  const auth = useGlobusAuth();
  const router = useRouter();
  if (auth.isAuthenticated) {
    router.replace("/");
    return;
  }
  return null;
}
