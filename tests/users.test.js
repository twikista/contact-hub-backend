const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const User = require('../models/userModel')
const testHelper = require('./test_utils')

mongoose.set('bufferTimeoutMS', 30000)

describe('user administration', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const password = '123456'
    const salt = 10
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
      firstName: 'Lucky',
      lastName: 'Dube',
      email: 'lucky@gmail.com',
      passwordHash,
    })
    await user.save()
  }, 100000)

  describe('creating a new user', () => {
    const user = {
      firstName: 'James',
      lastName: 'Harford',
      email: 'smith@gmail.com',
      password: '123456',
    }

    test('succeeds if all required fields are completed', async () => {
      await api
        .post('/api/users/signup')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/users')
      const emails = response.body.map((i) => i.email)

      expect(response.body).toHaveLength(2)
      expect(emails).toContain('lucky@gmail.com')
    })

    test('fails if a required field is missing', async () => {
      const user = {
        firstName: 'James',
        lastName: 'Harford',
        email: '',
        password: '123456',
      }

      await api
        .post('/api/users/signup')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/users')

      expect(response.body).toHaveLength(1)
    })

    test('succeeds if a non-required field is missing', async () => {
      await api
        .post('/api/users/signup')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/users')
      const emails = response.body.map((i) => i.email)

      expect(response.body).toHaveLength(2)
      expect(emails).toContain('smith@gmail.com')
    })

    test('fails if email is not unique', async () => {
      const user = {
        firstName: 'Lucky',
        lastName: 'Dube',
        email: 'lucky@gmail.com',
        password: '123456',
      }

      const usersAtStart = await testHelper.usersInDb()
      await api.post('/api/users/signup').send(user).expect(400)

      const usersAtEnd = await testHelper.usersInDb()

      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('fails if password length is less than 3', async () => {
      const user = {
        firstName: 'Lucky',
        lastName: 'Dube',
        email: 'baby@gmail.com',
        password: '123',
      }

      const usersAtStart = await testHelper.usersInDb()

      const response = await api
        .post('/api/users/signup')
        .send(user)
        .expect(400)

      const usersAtEnd = await testHelper.usersInDb()

      expect(response.body.error).toBe(
        'password length too short. minimum length is 4 characters'
      )
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
  })

  describe('sign in', () => {
    test('succeeds with correct credentials', async () => {
      const response = await api
        .post('/api/users/login')
        .send({ email: 'lucky@gmail.com', password: '123456' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.email).toBe('lucky@gmail.com')
      expect(response.body.token).toBeDefined()
    })

    test('fails with incorrect credentials', async () => {
      const response = await api
        .post('/api/users/login')
        .send({ email: 'lucky@gmail.com', password: 'abcdefg' })
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(response.body.email).toBeUndefined()
      expect(response.body.error).toBe('incorrect email or password')
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
