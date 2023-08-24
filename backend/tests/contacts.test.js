const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const testHelper = require('./test_utils')

const User = require('../models/userModel')
const Contact = require('../models/contactModel')

describe('contact route is protected', () => {
  let auth = {}
  beforeAll(async () => {
    const response = await api
      .post('/api/users/login')
      .send({ email: 'lucky@gmail.com', password: '123456' })

    auth.token = response.body.token
  }, 100000)

  beforeEach(async () => {
    await Contact.deleteMany({})

    const contactsObject = testHelper.initialContacts.map(
      (contact) => new Contact(contact)
    )
    const promiseArray = contactsObject.map((i) => i.save())
    await Promise.all(promiseArray)
  }, 100000)

  describe('where there are existing blogs', () => {
    test('they cannot be accessed by unauthenticated users', async () => {
      const response = await api
        .get('/api/contacts')
        .expect(401)
        .expect('Content-Type', /application\/json/)

      //assertions
      expect(response.body.error).toBe('unauthorized request')
    })
    test('authenticated users can access only blogs created by them', async () => {
      //contact object
      const contact = {
        firstName: 'Christiano',
        lastName: 'Ronaldo',
        contactInfo: {
          phone: '08037204400',
          email: 'cr7@gmail.com',
          city: 'Lisbon',
        },
        image: '',
        category: 'celebrity',
      }
      //create contact
      await api
        .post('/api/contacts')
        .set('Authorization', `Bearer ${auth.token}`)
        .send(contact)
      //make get request
      const response = await api
        .get('/api/contacts')
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      //assertions
      expect(response.body).toHaveLength(1)
      expect(response.body[0].lastName).toBe('Ronaldo')
    })
    test('accessing a blog fails with appropriate status code if user is authentocated, but id is invalid', async () => {
      const response = await api
        .get('/api/contacts/64ae8a37d41aa025e1c93fc')
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toBe('invalid id type')
    })
  })

  describe('adding a contact', () => {
    const contact = {
      firstName: 'Christiano',
      lastName: 'Ronaldo',
      contactInfo: {
        phone: '08037204400',
        email: 'cr7@gmail.com',
        city: 'Lisbon',
      },
      image: '',
      category: 'celebrity',
    }

    test('is successful if user is authenticated', async () => {
      const contactsAtStart = await testHelper.contactsInDb()

      const response = await api
        .post('/api/contacts')
        .set('Authorization', `Bearer ${auth.token}`)
        .send(contact)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const constactsAtEnd = await testHelper.contactsInDb()

      const firstNames = constactsAtEnd.map((i) => i.firstName)
      expect(constactsAtEnd.length).toBeGreaterThan(contactsAtStart.length)
      expect(firstNames).toContain('Christiano')
    })

    test('fails and returns appropriate status code if user is not authenticated', async () => {
      const contactsAtStart = await testHelper.contactsInDb()

      await api
        .post('/api/contacts')
        .send(contact)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const constactsAtEnd = await testHelper.contactsInDb()

      expect(constactsAtEnd.length).toBe(contactsAtStart.length)
    })

    test('fails if a required field is not completed', async () => {
      const newContact = { ...contact, firstName: '' }
      const contactsAtStart = await testHelper.contactsInDb()

      await api
        .post('/api/contacts')
        .set('Authorization', `Bearer ${auth.token}`)
        .send(newContact)
        .expect(400)

      const constactsAtEnd = await testHelper.contactsInDb()

      expect(constactsAtEnd.length).toBe(contactsAtStart.length)
    })
  })

  //test put requests
  describe('updating a contact', () => {
    beforeEach(async () => {
      const contact = {
        firstName: 'Christiano',
        lastName: 'Ronaldo',
        contactInfo: {
          phone: '08037204400',
          email: 'cr7@gmail.com',
          city: 'Lisbon',
        },
        image: '',
        category: 'celebrity',
      }
      //create contact
      await api
        .post('/api/contacts')
        .set('Authorization', `Bearer ${auth.token}`)
        .send(contact)
    }, 100000)

    test('is succesful if user is authenticated, id is valid, and contact is initially added by user', async () => {
      const contactsBeforeUpdate = await testHelper.contactsInDb()
      const contactToupdate = contactsBeforeUpdate[2]
      const contact = { ...contactToupdate, category: 'footballer' }

      await api
        .put(`/api/contacts/${contactToupdate.id}`)
        .set('authorization', `Bearer ${auth.token}`)
        .send({ contact })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      contactsAfterupdate = await testHelper.contactsInDb()
      const categories = contactsAfterupdate.map((i) => i.category)

      expect(categories).toContain('footballer')
    })

    test('fails with appropriate status code if user is authenticated, id is valid, but contact not initially added by user', async () => {
      const contactsBeforeUpdate = await testHelper.contactsInDb()
      const contactToupdate = contactsBeforeUpdate[0]
      const contact = { ...contactToupdate, category: 'footballer' }

      const response = await api
        .put(`/api/contacts/${contactToupdate.id}`)
        .set('authorization', `Bearer ${auth.token}`)
        .send({ contact })
        .expect(403)
        .expect('Content-Type', /application\/json/)

      contactsAfterupdate = await testHelper.contactsInDb()
      const categories = contactsAfterupdate.map((i) => i.category)

      expect(categories).not.toContain('footballer')
      expect(response.body.error).toBe('Not authorized')
    })

    test('fails with appropriate status code if user is authenticated but id is invalid', async () => {
      const contactsBeforeUpdate = await testHelper.contactsInDb()
      const contactToupdate = contactsBeforeUpdate[0]
      const contact = { ...contactToupdate, category: 'footballer' }

      const response = await api
        .put('/api/contacts/64ae8a37d41aa025e1c93fc')
        .set('authorization', `Bearer ${auth.token}`)
        .send({ contact })
        .expect(400)

      contactsAfterupdate = await testHelper.contactsInDb()
      const categories = contactsAfterupdate.map((i) => i.category)

      expect(categories).not.toContain('footballer')
      expect(response.body.error).toBe('invalid id')
    })

    test('fails with appropriate status code if user is not authenticated', async () => {
      const contactsBeforeUpdate = await testHelper.contactsInDb()
      const contactToupdate = contactsBeforeUpdate[1]
      const contact = { ...contactToupdate, category: 'footballer' }

      const response = await api
        .put(`/api/contacts/${contact.id}`)
        .send(contact)
        .expect(401)

      contactsAfterupdate = await testHelper.contactsInDb()
      const categories = contactsAfterupdate.map((i) => i.category)

      expect(categories).not.toContain('footballer')
      expect(response.body.error).toBe('unauthorized request')
    })

    test('fails if a required field is not completed', async () => {
      const contactsBeforeUpdate = await testHelper.contactsInDb()
      const contactToupdate = contactsBeforeUpdate[2]
      const contact = { ...contactToupdate, firstName: '' }

      await api
        .put(`/api/contacts/${contact.id}`)
        .set('authorization', `Bearer ${auth.token}`)
        .send({ contact })
        .expect(400)

      contactsAfterupdate = await testHelper.contactsInDb()

      expect(contactsBeforeUpdate[1].firstName).not.toBeUndefined()
    })
  })

  describe('deleting a blog', () => {
    beforeEach(async () => {
      const contact = {
        firstName: 'Christiano',
        lastName: 'Ronaldo',
        contactInfo: {
          phone: '08037204400',
          email: 'cr7@gmail.com',
          city: 'Lisbon',
        },
        image: '',
        category: 'celebrity',
      }
      //create contact
      await api
        .post('/api/contacts')
        .set('Authorization', `Bearer ${auth.token}`)
        .send(contact)
    }, 100000)

    test('succeeds if user is authenticated, id is valid, and contact initially added by user', async () => {
      const contactsBeforeDelete = await testHelper.contactsInDb()
      const contactToDelete = contactsBeforeDelete[2]

      await api
        .delete(`/api/contacts/${contactToDelete.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(204)

      const contactsAfterDelete = await testHelper.contactsInDb()
      const firstNames = contactsAfterDelete.map((i) => i.firstName)

      expect(contactsAfterDelete.length).toBe(2)
      expect(firstNames).not.toContain('Christiano')
    })

    test('fails with apporopriate status code if user is authenticated but id is invalid', async () => {
      const response = await api
        .delete('/api/contacts/64ae8a37d41aa025e1c93fc6')
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(400)

      const contactsAfterDelete = await testHelper.contactsInDb()
      const firstNames = contactsAfterDelete.map((i) => i.firstName)

      expect(contactsAfterDelete.length).toBe(3)
      expect(firstNames).toContain('Christiano')
      expect(response.body.error).toBe('invalid contact')
    })

    test('fails with apporopriate status code if user is not authenticated', async () => {
      const contactsBeforeDelete = await testHelper.contactsInDb()
      const contactToDelete = contactsBeforeDelete[2]

      const response = await api
        .delete(`/api/contacts/${contactToDelete.id}`)
        .expect(401)

      const contactsAfterDelete = await testHelper.contactsInDb()
      const firstNames = contactsAfterDelete.map((i) => i.firstName)

      expect(contactsAfterDelete.length).toBe(3)
      expect(firstNames).toContain('Christiano')
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
