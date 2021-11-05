import React, { useState } from 'react';
import {
  Redirect
} from "react-router-dom";
import {
  useMutation,
  gql
} from "@apollo/client";
import EmployeeFormFields from '../components/forms/EmployeeFormFields';

const CREATE_EMPLOYEE_MUTATION = gql`
  mutation CreateEmployee(
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
    $title: String!
  ) {
    createEmployee(data: {
      firstName: $firstName, 
      lastName: $lastName, 
      email: $email, 
      slug: $slug,
      city: $city,
      state: $state,
      country: $country,
      dob: $dob,
      phone: $phone,
      photo: $photo,
      title: { connect: { name: $title}}
      }) {
      firstName
      lastName
      email
      slug
    }
  }
`;

export default function EmployeeCreatePage() {
  const [created, setCreated] = useState(false)
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    slug: '',
    city: '',
    state: '',
    country: '',
    dob: '',
    phone: '',
    photo: '',
    status: '',
    title: '',

  })

  function handleCreateEmployee() {
    createEmployee().then((res) => {
      setCreated(true)
    });
  }

  const [createEmployee] = useMutation(CREATE_EMPLOYEE_MUTATION, {
    variables: {
      firstName: formState.firstName,
      lastName: formState.lastName,
      email: formState.email,
      slug: formState.slug,
      city: formState.city,
      state: formState.state,
      country: formState.country,
      dob: formState.dob,
      phone: formState.phone,
      photo: formState.photo,
      status: formState.status,
      title: formState.title,
    }
  });

  function handleFormState(name:string, e:any) {
    setFormState({
      ...formState,
      [name]: e.target.value
    })
  }

  // When created, redirect to the new employee
  if (created) {
    return (<Redirect to={"/employee/" + formState.slug}></Redirect>)
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-black pt-8 pb-8">Create a new employee</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateEmployee();
        }}
      >
        
        <EmployeeFormFields formState={formState} handleFormState={handleFormState}></EmployeeFormFields>
        
        <button type="submit" className="py-2 px-8 rounded-xl bg-blue-200 border border-solid border-gray-400 text-sm font-bold transition-all hover:bg-blue-400" >Create Employee</button>
      </form>
    </div>
  )
}