import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import { z } from 'zod'
import { readData, writeData } from 'DB'
import { UserSchema } from './models.users'
import type { User } from './models.users'

let __data : Array<User> | undefined = undefined
let __idCounter = 0
const getData = async (): Promise<Array<User>> => {
    if (__data) return __data
    __data = await readData<Array<User>>()
    __idCounter = Math.max(...__data.map(_ => _.id)) + 1
    return __data
}
const invalidateData = () => {
    __data = undefined
}
const getNextId = () => {
    return __idCounter++
}

// GET /users - Get all users with filtering, pagination, and sorting
const GetUsersQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
})

export const getUsers = createServerFn({method : "GET"})
  .inputValidator(GetUsersQuerySchema)
  .handler(async (params) => {
    const { search, page, pageSize } = params.data
    let data = await getData()
    
    // Filter by search query (phone, first_name, or last_name)
    if (search) {
      const searchLower = search.toLowerCase()
      data = data.filter(user => 
        user.phone.toLowerCase().includes(searchLower) ||
        user.first_name.toLowerCase().includes(searchLower) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchLower))
      )
    }
    
    // Sort by first_name
    data = data.sort((a, b) => 
      a.first_name.localeCompare(b.first_name)
    )
    
    // Calculate pagination
    const total = data.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = data.slice(startIndex, endIndex)
    
    return {
      data: UserSchema.array().parse(paginatedData),
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      }
    }
})

// GET /users/:id - Get a single user by ID
export const getUserById = createServerFn({method : "GET"}).inputValidator(UserSchema.pick({id : true})).handler(async (params) => {
    const data = await getData()
    const user = data.find(_ => _.id === params.data.id)
    if (!user) {
      throw notFound({data : {message : `User with id ${params.data.id} not found`}})
    }
    return UserSchema.parse(user)
})


// POST /users - Create a new user
export const createUser = createServerFn({method: "POST"}).inputValidator(UserSchema.omit({id: true})).handler(async (params) => {
  const data = await getData()
  const newUser = { ...params.data, id: getNextId() }
  data.push(newUser)
  await writeData(data)
  invalidateData()
  return UserSchema.parse(newUser)
})

// PUT /users/:id - Update an existing user
export const updateUser = createServerFn({method: "POST"}).inputValidator(z.object({
  id: UserSchema.shape.id,
  user: UserSchema.omit({id: true}).partial()
})).handler(async (params) => {
  const data = await getData()
  const userIndex = data.findIndex(_ => _.id === params.data.id)
  if (userIndex === -1) {
    throw notFound({data: {message: `User with id ${params.data.id} not found`}})
  }
  const updatedUser = { ...data[userIndex], ...params.data.user }
  data[userIndex] = updatedUser
  await writeData(data)
  invalidateData()
  return UserSchema.parse(updatedUser)
})

// DELETE /users/:id - Delete a user
export const deleteUser = createServerFn({method: "POST"}).inputValidator(UserSchema.pick({id: true})).handler(async (params) => {
  const data = await getData()
  const userIndex = data.findIndex(_ => _.id === params.data.id)
  if (userIndex === -1) {
    throw notFound({data: {message: `User with id ${params.data.id} not found`}})
  }
  data.splice(userIndex, 1)
  await writeData(data)
  invalidateData()
})
