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
import EmployeeFormFields from '../components/forms/EmployeeFormFields';

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
      <div className="flex flex-row justify-between">

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

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($slug: String) {
    deleteEmployee(where:{slug:$slug}) {
      slug
    }
  }
`

function UpdateEmployeeForm({...props}) {
  const [deleted, setDeleted] = useState(false)

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

  function handleDelete() {

    deleteEmployee()
    .then((res) => {
      setDeleted(true)
    });
    
  }

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    variables: {slug: props.employee.slug}
  })

  if (deleted) {
    return (<Redirect to="/"></Redirect>)
  }


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateEmployee().then(() => {
          props.onSubmit();
        });
      }}
    >

      <EmployeeFormFields formState={formState} handleFormState={handleFormState}></EmployeeFormFields>
      
      <div className="grid grid-cols-2 gap-4">
        <button className="py-2 px-8 rounded-xl bg-blue-200 border border-solid border-gray-400 text-sm font-bold transition-all hover:bg-blue-400" type="submit">Update Employee</button>
        <button onClick={() => {if (window.confirm('Are you sure you wish to delete this employee?')) handleDelete()}} className="py-2 px-8 rounded-xl bg-red-200 border border-solid border-gray-400 text-sm font-bold transition-all hover:bg-red-400" type="button">Delete Employee</button>
      </div>
    </form>
  )
}