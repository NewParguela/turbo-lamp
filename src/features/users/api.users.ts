import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import { z } from 'zod'
import { readData, writeData } from 'DB'
import { UserSchema } from './model.users'
import type { User } from './model.users'

let __data : Array<User> | undefined = undefined
const getData = async (): Promise<Array<User>> => {
    if (__data) return __data
    __data = await readData<Array<User>>()
    return __data
}
const invalidateData = () => {
    __data = undefined
}

// GET /users - Get all users
export const getUsers = createServerFn({method : "GET"}).handler(
    async () => {
        const data = await getData()
        return UserSchema.array().parse(data)
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
  const newUser = { ...params.data, id: data.length + 1 }
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
