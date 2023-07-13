const User = require('../models/userModel')
const Contact = require('../models/contactModel')

const initialContacts = [
  {
    firstName: 'Mikel',
    lastName: 'Obi',
    contactInfo: {
      phone: '08037208823',
      email: 'mikel@gmail.com',
      city: 'Lagos',
    },
    image: '',
    category: 'colleague',
    user: '6491ca8bd4af4db7e094a506',
  },

  {
    firstName: 'Messi',
    lastName: 'Lionel',
    contactInfo: {
      phone: '08037207729',
      email: 'messi@gmail.com',
      city: 'Boni Arus',
    },
    image: '',
    category: 'celebrity',
    user: '6491ca8bd4af4db7e094a506',
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const contactsInDb = async () => {
  const contacts = await Contact.find({})
  return contacts.map((contact) => contact.toJSON())
}

module.exports = { initialContacts, usersInDb, contactsInDb }
