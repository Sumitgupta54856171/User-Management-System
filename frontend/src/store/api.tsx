import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from './authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl:import.meta.env.base_url,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as any).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // Token expired, logout
        api.dispatch(logout());
    }
    return result;
};

export const api = createApi({
    reducerPath:'api',
    baseQuery: baseQueryWithReauth,
    endpoints:(builder)=>({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({ user: data.user, token: data.token }));
                } catch (error) {
                    // Handle login error
                }
            },
        }),
        getUsers: builder.query({
            query: () => '/users',
        }),
        createUser: builder.mutation({
            query: (userData) => ({
                url: '/users/add',
                method: 'POST',
                body: userData,
            }),
        }),
        updateUser: builder.mutation({
            query: ({ id, ...userData }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: userData,
            }),
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
        }),
        updateProfile: builder.mutation({
            query: (userData) => ({
                url: '/users/profile',
                method: 'PUT',
                body: userData,
            }),
        }),
    })
})

export const { 
    useLoginMutation, 
    useGetUsersQuery, 
    useCreateUserMutation, 
    useUpdateUserMutation, 
    useDeleteUserMutation,
    useUpdateProfileMutation
} = api