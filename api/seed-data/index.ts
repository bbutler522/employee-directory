import { KeystoneContext } from '@keystone-next/keystone/types';

type EmployeeProps = {
  firstName: string;
  lastName: string;
};

export async function insertSeedData(context: KeystoneContext) {
  console.log(`🌱 Generating and inserting seed data`);
  let generatedPeople = {};

  // Get generated people through a 3rd party API.
  const getPeople = async () => {
    const axios = require('axios');

    try {
      const response = await axios.get('https://randomuser.me/api/?results=50')
        .then(response => {
          generatedPeople = response.data.results
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error)
    }
  }

  // Check if an employee exists, and if not, create them.
  const createEmployee = async (employeeData: EmployeeProps) => {
    let employee = null;
    try {
      employee = await context.query.Employee.findOne({
        where: { firstName: employeeData.name.first },
        query: 'id',
      });
    } catch (e) {}
    if (!employee) {
      employee = await context.query.Employee.createOne({
        data: {
          firstName: employeeData.name.first, 
          lastName: employeeData.name.last,
        },
        query: 'id',
      });
    }
    return employee;
  };

  await getPeople();

  for (const employee of generatedPeople) {
    console.log(`🧑 Adding employee: ${employee.name.first} ${employee.name.last}`);
    await createEmployee(employee);
  }

  console.log(`✅ Seed data inserted`);
  console.log(`👋 Please start the process with \`yarn dev\` or \`npm run dev\``);
  process.exit();
}