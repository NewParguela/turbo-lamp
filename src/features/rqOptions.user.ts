import { createUser, deleteUser, getUserById, getUsers, updateUser } from './users/api.users';
import type { InfiniteData, QueryClient, UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import type { User } from './users/models.users';
import { mergeMutationOptions } from '@/lib/mergeMutationOptions';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

// GET /users - Get all users with filtering and pagination (infinite)
export function getUsersInfiniteOptions(params?: {
  search?: string
  page?: number
  pageSize?: number
}) {
  return {
    queryKey: [...userKeys.lists(), params?.search],
    queryFn: ({ pageParam }) => getUsers({ data: { ...params, page: pageParam } }),
    initialPageParam: params?.page || 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.pagination.page > 1
        ? firstPage.pagination.page - 1
        : undefined,
  } satisfies UseInfiniteQueryOptions<{
    data: Array<User>
    pagination: {
      page: number
      pageSize: number
      total: number
      totalPages: number
    }
  }>
}

// GET /users/:id - Get a single user by ID
export function getUserByIdOptions(
  params: { id: number }
): UseQueryOptions<User> {
  return {
    queryKey: userKeys.detail(params.id),
    queryFn: () => getUserById({ data: { id: params.id } }),
    enabled: !!params.id,
  }
}

// POST /users - Create a new user
type CreateUserOptions = UseMutationOptions<
  User,
  Error,
  Omit<User, 'id'>
>
export function createUserOptions(queryClient?: QueryClient, extend?: Omit<CreateUserOptions, "mutationFn">): CreateUserOptions {
  return mergeMutationOptions({
    mutationFn: (user: Omit<User, 'id'>) => createUser({ data: user }),
    onSuccess: () => {
      queryClient?.invalidateQueries({ queryKey: userKeys.lists() })
    },
  }, extend) satisfies CreateUserOptions
}

// PUT /users/:id - Update an existing user
type UpdateUserOptions = UseMutationOptions<User, Error, { id: number; user: Partial<Omit<User, 'id'>> }>
export function updateUserOptions(queryClient?: QueryClient, extend?: Omit<UpdateUserOptions, "mutationFn">) {

  return mergeMutationOptions({
    mutationFn: (params: { id: number; user: Partial<Omit<User, 'id'>> }) =>
      updateUser({ data: params }),
    onSuccess: (_data, variables) => {
      queryClient?.setQueryData<Awaited<ReturnType<typeof getUserById>>>(userKeys.detail(variables.id),
        (oldData) => {
          if (!oldData) return oldData;

          const newData = {
            ...oldData,
            ...variables.user
          }
          return newData
        })

      queryClient?.setQueryData<InfiniteData<Awaited<ReturnType<typeof getUsers>>>>(getUsersInfiniteOptions({ search: undefined }).queryKey,
        (oldData) => {
          console.log("OLD DATA", oldData)
          if (!oldData) return oldData;

          const newData = {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((user) =>
                user.id === variables.id ? { ...user, ...variables.user } : user
              ),
            }))
          }

          console.log("NEW DATA", newData)
          return newData
        })

    }
  }, extend) satisfies UpdateUserOptions
}

// DELETE /users/:id - Delete a user
type DeleteUserOptions = UseMutationOptions<
  boolean,
  Error,
  { id: number }
>

export function deleteUserOptions(queryClient?: QueryClient, extend?: Omit<DeleteUserOptions, "mutationFn">): DeleteUserOptions {
  return mergeMutationOptions({
    mutationFn: (params: { id: number }) => deleteUser({ data: { id: params.id } }),
    onSuccess: (_data, variables) => {
      queryClient?.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient?.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
    },
  }, extend) satisfies DeleteUserOptions
}