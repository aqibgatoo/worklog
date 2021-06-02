import React, { useEffect, useState } from "react";
import { createWorkLog } from "../api";

export type Status = "idle" | "loading" | "success" | "error";

const useFetch = (url, payload) => {
  const [status, setStatus] = useState<Status>("idle");
  const reponse = createWorkLog(url, payload);
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
            "Content-Type": "application/vnd.api+json",
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.log(error);
      }
      fetchApi();
    };
  }, [url, payload]);

  return [status];
};

export { useFetch };
