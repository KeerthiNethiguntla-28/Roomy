import { apiSlice } from "../baseApiSlice";


export interface CreateReportRequest {
  description: string;
  postId: string;
}

export const reportApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createReport: build.mutation<any, CreateReportRequest>({
      query: (body) => ({
        url: "/reports/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateReportMutation } = reportApi;
