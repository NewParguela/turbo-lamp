import { createUser, deleteUser, getUserById, getUsers, updateUser } from './users/api.users'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import type { User } from './users/models.users'

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

// GET /users - Get all users with filtering and pagination
export function getUsersOptions(params?: {
  search?: string
  page?: number
  pageSize?: number
}): UseQueryOptions<{
  data: Array<User>
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}> {
  return {
    queryKey: [...userKeys.lists(), params],
    queryFn: () => getUsers({ data: params || {} }),
  }
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
  void,
  Error,
  { id: number }
> {
  return {
    mutationFn: (params: { id: number }) => deleteUser({ data: { id: params.id } }),
  }
}