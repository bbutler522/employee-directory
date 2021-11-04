import {
  useLocation
} from "react-router-dom";
import {
  useQuery,
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

  let { loading, error, data, refetch, fetchMore } = useQuery(GET_EMPLOYEE, {
    variables: {
      slug: slug
    }
  })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  let employee = data.employee;

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
                    <p className="bg-gray-200 px-3 py-1 text-sm rounded-2xl mb-2 mr-2 w-auto">{team.name}</p>
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
            <p>Update Employee</p>
          </div>

          {/* Delete Employee */}
          <button></button>

        </div>

      </div>
    </div>
  )
}