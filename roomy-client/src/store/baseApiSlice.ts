import { getAuthToken } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) headers.set("Authorization", token);
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
  tagTypes: ["Post", "User"],
});
