"use client";

import useAuth from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

import { useEffect } from "react";

const Persist = ({ children }) => {
  const { type } = useAuth();
  const router = useRouter();

  const pathName = usePathname();

  useEffect(() => {
    if (!type) {
      router.replace("/login");
      return;
    }

   /*  if (type) {
      if (type === "bns-worker") {
        router.replace("/bnsUser");
      } else if (type === "bns-admin") {
        router.replace("/superAdmin");
      } else if (type === "bns-user") {
        router.replace("/dashboard");
      }
    } */
  }, [type, pathName]);

  return <>{children} </>;
};

export default Persist;
