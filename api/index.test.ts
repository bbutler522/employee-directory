// import { KeystoneContext } from '@keystone-next/keystone/types';
import { setupTestEnv, setupTestRunner, TestEnv } from '@keystone-next/keystone/testing';
import { lists } from './schema';


let config = {
  db: {
    provider: 'sqlite',
    url: 'file:./keystone.db',
    async onConnect(context) {
      if (process.argv.includes('--seed-data')) {
        await insertSeedData(context);
      }
    },
  },
  lists,
}

const runner = setupTestRunner({ config });

test(
  'Employee Create',
  runner(async ({ context }) => {
    const employee = await context.query.Employee.createOne({
      data: { firstName: 'Allison', lastName: 'Wonderland', slug: 'AWonderland', email: 'AWonderland@example.com'},
      query: 'id firstName lastName slug email',
    });
    expect(employee.firstName).toEqual('Allison');
    expect(employee.email).toEqual('AWonderland@example.com');
  })
);

test(
  'Title Create',
  runner(async ({ context }) => {
    const title = await context.query.Title.createOne({
      data: { name: 'Software Engineer', employees: [] },
      query: 'name'
    })
    expect(title.name).toEqual('Software Engineer');
  })
)