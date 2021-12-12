const { readFile, writeFile } = require('fs').promises;
const { randomUUID } = require('crypto');
const path = require('path');

const contactsPath = path.relative(__dirname, 'db/contacts.json');

async function listContacts() {
  const data = await readFile(contactsPath, 'utf-8');
  return  JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();

    for (const el of contacts) {
      if (el.id == contactId) {
        return el;
      }
    }

  throw new Error(`Contact with id: ${contactId} not found. Try different id.`)
}

async function addContact(name, email, phone) {
    if (!name || !email || !phone) {
        throw new Error('Please fill all fields to add a new contact!')
    }

  const contacts = await listContacts();
  const id = randomUUID();
  const newContacts = contacts.concat({ id, name, email, phone });
  await writeFile(contactsPath, JSON.stringify(newContacts));
  return newContacts;
}

async function removeContact(contactId) {
  const contacts = await listContacts();

  if (contacts.some(el => el.id == contactId)) {
    const filteredContacts = contacts.filter(el => el.id != contactId);
    await writeFile(contactsPath, JSON.stringify(filteredContacts))
    return filteredContacts;
  }

  throw new Error(`Contact with id: ${contactId} not found. Try different id.`)
}


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
}