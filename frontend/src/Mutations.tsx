// GraphQL Mutations

import {
  gql
} from "@apollo/client";

// Update an employee with provided slug, with provided variables.
export const UPDATE_EMPLOYEE_MUTATION = gql`
  mutation UpdateEmployee(
    $firstName: String!
    $lastName: String!
    $email: String!
    $slug: String!
    $city: String!
    $state: String!
    $country: String!
    $dob: String!
    $phone: String!
    $photo: String!
    $status: String!
    $title: String!
  ) {
    updateEmployee(
      data: {
        firstName: $firstName, 
        lastName: $lastName, 
        email: $email, 
        city: $city,
        state: $state,
        country: $country,
        dob: $dob,
        phone: $phone,
        photo: $photo,
        status: $status,
        title: { connect: { name: $title}}
        }
      where: {slug: $slug}
      ) {
      firstName
      lastName
      email
      city
      state
      country
      dob
      phone
      photo
      status
      title {
        name
      }
      teams {
        name
      }
    }
  }
`;

// Delete the employee with the slug provided.
export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($slug: String) {
    deleteEmployee(where:{slug:$slug}) {
      slug
    }
  }
`