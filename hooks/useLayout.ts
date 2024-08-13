import { useRouter } from "next/router";

export function useLayout() {
  const router = useRouter();
  return {
    isCondensed: router.pathname === "/transfer",
    useContainer: router.pathname !== "/transfer",
  };
}
