import { LoginReq, LoginRes, RegisterReq, RegisterRes } from "@/models/login/login";
import { apiSlice } from "../baseApiSlice";
import User from "@/models/user-model";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginRes, LoginReq>({
      query: (user) => ({
        url: "/users/login",
        method: "POST",
        body: user,
      }),
    }),
    register: build.mutation<RegisterRes, RegisterReq>({
      query: (note) => ({
        url: "/users/register",
        method: "POST",
        body: note,
      }),
    }),
    updateUser: build.mutation({
      query: (body: Partial<User>) => ({
        url: "/users/update",
        method: "PUT",
        body,
      }),
    }),
    deleteUser: build.mutation({
      query: () => ({
        url: "/users/delete",
        method: "DELETE",
      }),
    }),
    getUserContext: build.query<User, { skip?: boolean }>({
      query: () => ({
        url: "/users/context",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserContextQuery,
} = authApi;
