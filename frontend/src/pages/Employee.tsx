import { useState } from 'react';
import {
  useLocation,
  Redirect
} from "react-router-dom";
import {
  useQuery,
  useMutation,
  gql
} from "@apollo/client";
import Moment from 'react-moment';

import { IconProfile } from "../components/Icons";

const GET_EMPLOYEE = gql`
  query GetEmployee($slug: String) {
    employee(where: {slug: $slug}) {
      id
      firstName
      lastName
      email
      slug
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
`

export default function EmployeePage() {

  // Get employee slug from url
  const location = useLocation();
  const slug = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

  let { loading, error, data, refetch } = useQuery(GET_EMPLOYEE, {
    variables: {
      slug: slug
    }
  })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  let employee = data.employee;

  // If employee doesn't exist, redirect to home
  if (employee === null) {
    return(<Redirect to='/'></Redirect>) 
  }

  return (
    <div>
      <div className="h-20 bg-blue-500 -mx-10">

      </div>
      <div className="flex flex-row">

        {/* Employee Info */}
        <div className="flex flex-row">
          <div className="flex flex-col justify-start items-start mr-16 -mt-20 pt-1">
            <div className="w-28 h-28 m-4 rounded-full overflow-hidden bg-blue-300">
              {employee.photo ?
              <img src={employee.photo} className="min-w-full min-h-full" />
              : 
              <IconProfile></IconProfile>
              }
            </div>
            <div className="flex flex-row"> 
              <div className="flex flex-col justify-start items-start mr-10">
                <p className="font-bold text-xl mb-2">{employee.firstName} {employee.lastName}</p>
                <p className="bg-blue-100 text-gray-800 px-3 py-1 text-sm rounded-2xl mb-4 w-auto">{employee.title.name}</p>
                <p className="text-sm mb-1 font-bold">Teams:</p>
                <div className="mb-2">
                  {employee.teams && employee.teams.map((team:any) => (
                    <p key={team.name} className="bg-gray-200 px-3 py-1 text-sm rounded-2xl mb-2 mr-2 w-auto">{team.name}</p>
                  ))}
                </div>
                <p className="text-sm mb-1 font-bold">Contact</p>
                <a href={"mailto:" + employee.email}><p>{employee.email}</p></a>
                <a className="mb-4" href={"tel:" + employee.phone}><p>{employee.phone}</p></a>
              </div>
              <div className="flex flex-col justify-start items-start pt-8">
                <p className="text-sm mb-1 font-bold">Location</p>
                <p className="mb-4">{employee.city}, {employee.state}, {employee.country}</p>
                <p className="text-sm mb-1 font-bold">Birthday</p>
                <p className="mb-4"><Moment format="MM/DD/YYYY">{employee.dob}</Moment></p>
                <p className="text-sm mb-1 font-bold">Status</p>
                <p className="mb-4">{employee.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Update Employee */}
        <div>
          <div>
            <p className="text-lg font-bold my-4">Update Employee</p>
            <UpdateEmployeeForm employee={employee} onSubmit={() => refetch({})}></UpdateEmployeeForm>
          </div>

          {/* Delete Employee */}
          <button></button>

        </div>

      </div>
    </div>
  )
}

const UPDATE_EMPLOYEE_MUTATION = gql`
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

function UpdateEmployeeForm({...props}) {
  const [formState, setFormState] = useState({
    firstName: props.employee.firstName,
    lastName: props.employee.lastName,
    email: props.employee.email,
    slug: props.employee.slug,
    city: props.employee.city,
    state: props.employee.state,
    country: props.employee.country,
    dob: props.employee.dob,
    phone: props.employee.phone,
    photo: props.employee.photo,
    status: props.employee.status,
    title: props.employee.title.name,
  })

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE_MUTATION, {
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateEmployee();
        props.onSubmit();
      }}
    >

      <div className="grid grid-cols-2 gap-4 mb-6">
        <FormField name="firstName" title="First Name" formState={formState} onChange={(e:any) => handleFormState("firstName", e)}></FormField>
        <FormField name="lastName" title="Last Name" formState={formState} onChange={(e:any) => handleFormState("lastName", e)}></FormField>
        <FormField name="city" title="City" formState={formState} onChange={(e:any) => handleFormState("city", e)}></FormField>
        <FormField name="state" title="State" formState={formState} onChange={(e:any) => handleFormState("state", e)}></FormField>
        <FormField name="country" title="Country" formState={formState} onChange={(e:any) => handleFormState("country", e)}></FormField>
        <FormField name="dob" title="Birthday" formState={formState} onChange={(e:any) => handleFormState("dob", e)}></FormField>
        <FormField name="title" title="Title (Must exist already atm.)" formState={formState} onChange={(e:any) => handleFormState("title", e)}></FormField>
      </div>
      
      <div>
        <button className="py-2 px-8 rounded-xl bg-blue-200 border border-solid border-gray-400 text-sm font-bold mr-4 transition-all hover:bg-blue-400" type="submit">Update Employee</button>
      </div>
    </form>
  )
}

function FormField({...props}) {
  const name = props.name

  return(
    <div className="flex flex-col">
      <label className="text-sm font-bold" htmlFor={props.name}>{props.title}</label>
      <input value={props.formState[name]} 
        onChange={(e) => props.onChange(e)}
        type="text" 
        name={props.name} 
        className="bg-gray-100 py-1 px-2 rounded-xl border border-solid border-gray-200 outline-none transition-all focus:border-gray-400"
      />
    </div>
  )
}