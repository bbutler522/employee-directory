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
      const response = await axios.get('https://randomuser.me/api/?results=150&nat=US,AU,GB&seed=412')
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
    let title = null;

    // Generate the slug based on the employee's name
    const slug = employeeData.name.first.charAt(0) + employeeData.name.last;

    // Check if the employee already exists by their unique slug
    try {
      employee = await context.query.Employee.findOne({
        where: { slug: slug },
        query: 'id',
      });
    } catch (e) {}

    // If they don't exists create the new employee
    if (!employee) {

      // Generate a slug and email based on the emmployee's name (In production, create incremented slugs)
      const slug = employeeData.name.first.charAt(0) + employeeData.name.last;
      const email = slug + '@postlight.com';

      // Set 'status' with it more likely for employees to be active
      const statusOptions = ['remote', 'office', 'vacation', 'off']
      const result = weightedRandom({0:0.5, 1:0.3, 2:0.1, 3:0.2});
      const status = statusOptions[result];
      
      // Seed some titles that we'll create and apply to employees
      const seedTitles = ['Software Engineer', 'Project Manager', 'HR', 'Legal', 'Manager', 'Designer', 'UX Researcher', 'Software Engineering Manager'];
      const randomTitle = Math.floor(Math.random() * seedTitles.length);
      const titleName = seedTitles[randomTitle];
      let title = null;

      // Check if the title exists, and if not, create it.
      try {
        title = await context.query.Title.findOne({
          where: {name: titleName},
          query: 'name',
        })
      } catch (e) {}
      if (title === null) {
        try {
          console.log(`🖋️ Adding title: ${titleName}`);
          title = await context.query.Title.createOne({
            data: {
              name: titleName
            },
            query: 'name',
          })
        } catch (e) {}
      }

      // Repeat the process for teams.
      const seedTeams = ['Probable Futures', 'MTA', 'Goldman Sachs', 'VICE', 'The Players\' Tribune', 'Audubon', 'Air Mail', 'Mailchimp'];
      const randomTeam = Math.floor(Math.random() * seedTitles.length);
      const teamName = seedTeams[randomTeam];
      let team = null;

      try {
        team = await context.query.Team.findOne({
          where: {name: teamName},
          query: 'name',
        })
      } catch (e) {}
      if (team === null) {
        try {
          console.log(`👥 Adding team: ${teamName}`);
          team = await context.query.Team.createOne({
            data: {
              name: teamName
            },
            query: 'name',
          })
        } catch (e) {}
      }

      // Create the new employee
      employee = await context.query.Employee.createOne({
        data: {
          firstName: employeeData.name.first, 
          lastName: employeeData.name.last,
          email: email,
          slug: slug,
          city: employeeData.location.city,
          state: employeeData.location.state,
          country: employeeData.location.country,
          title: {connect: { name: titleName}},
          teams: {connect: { name: teamName}},
          dob: employeeData.dob.date,
          phone: employeeData.phone,
          photo: employeeData.picture.large,
          status: status
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

// Function to make some elemeonts in an array more likely to be chosen
function weightedRandom(prob) {
  let i, sum=0, r=Math.random();
  for (i in prob) {
    sum += prob[i];
    if (r <= sum) return i;
  }
}