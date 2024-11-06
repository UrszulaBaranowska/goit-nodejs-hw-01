const fs = require("fs").promises;
const path = require("path");

async function getNanoid() {
  const { nanoid } = await import("nanoid");
  return nanoid;
}

const contactsPath = path.resolve("./db/contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading contacts:", error.message);
    return [];
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    return contacts.find((cont) => cont.id === contactId) || null;
  } catch (error) {
    console.error("Error fetching contact:", error.message);
    return null;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contactToRemove = contacts.find((cont) => cont.id === contactId);
    if (!contactToRemove) {
      console.error("Contact not found");
      return null;
    }

    const updatedContacts = contacts.filter((cont) => cont.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return contactToRemove;
  } catch (error) {
    console.error("Error removing contact:", error.message);
    return null;
  }
};

const addContact = async (name, email, phone) => {
  try {
    const contacts = await listContacts();
    const nanoid = await getNanoid();
    const newContact = { id: nanoid(), name, email, phone };
    const updatedContacts = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error.message);
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
};
