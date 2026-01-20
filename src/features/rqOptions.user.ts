import { createUser, deleteUser, getUserById, getUsers, updateUser } from './users/api.users'
import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import type { User } from './users/models.users'

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
    queryKey: [...userKeys.lists(), params],
    queryFn: ({pageParam}) => getUsers({ data: {...params, page: pageParam} }),
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
export function createUserOptions(): UseMutationOptions<
  User,
  Error,
  Omit<User, 'id'>
> {
  return {
    mutationFn: (user: Omit<User, 'id'>) => createUser({ data: user }),
  }
}

// PUT /users/:id - Update an existing user
export function updateUserOptions(): UseMutationOptions<
  User,
  Error,
  { id: number; user: Partial<Omit<User, 'id'>> }
> {
  return {
    mutationFn: (params: { id: number; user: Partial<Omit<User, 'id'>> }) =>
      updateUser({ data: params }),
  }
}

// DELETE /users/:id - Delete a user
export function deleteUserOptions(): UseMutationOptions<
  boolean,
  Error,
  { id: number }
> {
  return {
    mutationFn: (params: { id: number }) => deleteUser({ data: { id: params.id } }),
  }
}