const getContacts = (req, res) => {
  res.status(200).json({ message: "GET all contacts" });
};

const getContact = (req, res) => {
  res.status(200).json({ message: `GET contact ${req.params.id}` });
};

const createNewContact = (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: `create new ${req.body}}` });
};

const updateContact = (req, res) => {
  res.status(200).json({ message: `UPDATE contact ${req.params.id}` });
};

const deleteContact = (req, res) => {
  res.status(200).json({ message: `DELETE contact ${req.params.id}` });
};

module.exports = {
  getContacts,
  getContact,
  createNewContact,
  updateContact,
  deleteContact,
};
