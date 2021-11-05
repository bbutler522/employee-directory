/*
Welcome to the schema! The schema is the heart of Keystone.

Here we define our 'lists', which will then be used both for the GraphQL
API definition, our database tables, and our Admin UI layout.

Some quick definitions to help out:
A list: A definition of a collection of fields with a name. For the starter
  we have `User`, `Post`, and `Tag` lists.
A field: The individual bits of data on your list, each with its own type.
  you can see some of the lists in what we use below.

*/

// Like the `config` function we use in keystone.ts, we use functions
// for putting in our config so we get useful errors. With typescript,
// we get these even before code runs.
import { list } from '@keystone-next/keystone';

// We're using some common fields in the starter. Check out https://keystonejs.com/docs/apis/fields#fields-api
// for the full list of fields.
import {
  text,
  relationship,
  password,
  timestamp,
  select,
} from '@keystone-next/keystone/fields';
// The document field is a more complicated field, so it's in its own package
// Keystone aims to have all the base field types, but you can make your own
// custom ones.
import { document } from '@keystone-next/fields-document';

// We have a users list, a blogs list, and tags for blog posts, so they can be filtered.
// Each property on the exported object will become the name of a list (a.k.a. the `listKey`),
// with the value being the definition of the list, including the fields.
export const lists = {
  // Here we define the user list.
  User: list({
    // Here are the fields that `User` will have. We want an email and password so they can log in
    // a name so we can refer to them, and a way to connect users to posts.
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      // The password field takes care of hiding details and hashing values
      password: password({ validation: { isRequired: true } }),
    },
    // Here we can configure the Admin UI. We want to show a user's name and posts in the Admin UI
    ui: {
      listView: {
        initialColumns: ['name'],
      },
    },
  }),
  Employee: list({
    fields: {
      firstName: text({ validation: { isRequired: true } }),
      lastName: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      slug: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      // title: text(),
      city: text(),
      state: text(),
      country: text(),
      dob: text(),
      phone: text(),
      photo: text(),
      status: select({
        options: [
          { label: 'Remote', value: 'remote' },
          { label: 'In Office', value: 'office' },
          { label: 'Vacation', value: 'vacation' },
          { label: 'Off', value: 'off' },
        ],
        defaultValue: 'remote',
        ui: {
          displayMode: 'segmented-control',
        },
        defaultIsFilterable: true,
        defaultIsOrderable: true,
      }),
      teams: relationship({ 
        ref: 'Team',
        many: true,
        ui: {
          labelField: 'name',
        }
      }),
      title: relationship({
        ref: 'Title.employees',
      })
    },
    ui: {
      listView: {
        initialColumns: ['firstName', 'lastName', 'email', 'title'],
        pageSize: 5000,
      },
      labelField: 'slug',
    },
  }),
  Team: list({
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      employees: relationship({
        ref: 'Employee',
        ui: {
          cardFields: ['firstName', 'lastName', 'email', 'teams'],
          linkToItem: true,
        },
        many: true
      }),
    },
    ui: {
      listView: {
        initialColumns: ['name'],
      },
    }
  }),
  Title: list({
    fields: {
      name: text({ 
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      employees: relationship({
        ref: 'Employee.title',
        many: true,
      })
    }
  })
};
