import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { setCredentials } from './authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl:"http://localhost:3000",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const api = createApi({
    reducerPath:'api',
    baseQuery: baseQuery,
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
                    // Login failed, no auth state will be set
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