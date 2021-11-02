import React, { useState } from 'react';
import {
  useMutation,
  gql
} from "@apollo/client";

const CREATE_EMPLOYEE_MUTATION = gql`
  mutation CreateEmployee(
    $firstName: String!
    $lastName: String!
    $email: String!
    $slug: String!
  ) {
    createEmployee(data: {firstName: $firstName, lastName: $lastName, email: $email, slug: $slug}) {
      firstName
      lastName
      email
      slug
    }
  }
`;

export default function EmployeeCreatePage() {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    slug: '',
  })

  const [createEmployee] = useMutation(CREATE_EMPLOYEE_MUTATION, {
    variables: {
      firstName: formState.firstName,
      lastName: formState.lastName,
      email: formState.email,
      slug: formState.slug,
    }
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-black pt-8 pb-8">Create a new employee</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createEmployee();
        }}
      >
        <div className="flex flex-row mb-4">
          <div className="flex flex-col mr-10">
            <label htmlFor="firstName">First Name</label>
            <input value={formState.firstName} 
              onChange={(e) =>
                setFormState({
                  ...formState,
                  firstName: e.target.value
                })
              }
              type="text" 
              name="firstName" 
              className="bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName">Last Name</label>
            <input value={formState.lastName} 
              onChange={(e) =>
                setFormState({
                  ...formState,
                  lastName: e.target.value
                })
              }
              type="text" 
              name="lastName" 
              className="bg-gray-200" 
            />
          </div>
        </div>

        <div className="flex flex-row mb-4">
          <div className="flex flex-col mr-10">
            <label htmlFor="email">Email</label>
            <input value={formState.email} 
              onChange={(e) =>
                setFormState({
                  ...formState,
                  email: e.target.value
                })
              }
              type="text" 
              name="email" 
              className="bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="slug">Slug</label>
            <input value={formState.slug} 
              onChange={(e) =>
                setFormState({
                  ...formState,
                  slug: e.target.value
                })
              }
              type="text" 
              name="slug" 
              className="bg-gray-200" 
            />
          </div>
        </div>
        
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}