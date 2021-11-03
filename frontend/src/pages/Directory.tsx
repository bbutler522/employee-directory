import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useQuery,
  gql
} from "@apollo/client";

import { IconRemote, IconOffice, IconVacation, IconOff, IconProfile, IconOptions } from '../components/Icons';

// const ALL_EMPLOYEES = gql`
//   query Employees {
//     employees {
//       id
//       firstName
//       lastName
//       email
//       slug
//       city
//       state
//       country
//       dob
//       phone
//       photo
//       status
//       title
//       teams {
//         name
//       }

const PAGINATED_EMPLOYEES = gql`
  query PaginatedEmployees($skip: Int, $take: Int) {
  employees(skip: $skip, take: $take) {
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
`;

const COUNT_EMPLOYEES = gql`
  query countEmployees {
    employeesCount
    remoteCount: employeesCount(where: {status: {equals: "remote"}})
    officeCount: employeesCount(where: {status: {equals: "office"}})
    vacationCount: employeesCount(where: {status: {equals: "vacation"}})
    offCount: employeesCount(where: {status: {equals: "off"}})
  }
`

export default function DirectoryPage() {
  const { loading, error, data } = useQuery(COUNT_EMPLOYEES);

  const [searchState, setSearchState] = useState({
    search: '',
  })

  function handleChange(e:any) {
    setSearchState({search: e.target.value})
  }

  return (
    <div>
      {/* Count of employees */}
      <p className="text-3xl font-bold text-black pt-8 pb-8">People <span className="text-gray-600">{data && data.employeesCount}</span></p>

      
      <div className="flex flex-row justify-between width-full">

        {/* Status Counts */}
        <StatusCounts data={data}></StatusCounts>

        {/* Add Employee */}
        <Link to="/employee/create" ><button className="bg-blue-700 px-6 py-2 rounded-full text-white">Add Employee</button></Link>
      </div>

      {/* Table filters and format */}
      <OrganizeData searchState={searchState} onStateChange={(e:any) => handleChange(e)}></OrganizeData>

      {/* List of employees and information */}
      <Employees searchState={searchState} />
    </div>
  );
}

function Employees({...props}) {
  const initialCount = 12;
  const increment = 12;
  const [count, setCount] = useState({});

  let { loading, error, data, fetchMore } = useQuery(PAGINATED_EMPLOYEES, {
    variables: {
      skip: 0,
      take: initialCount,
    },
  });

  function onLoadMore() {
    console.log(
    fetchMore({
      variables: {
        skip: data.employees.length
      },
    }))
    console.log(data)
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  let dataEmployees = data.employees;

  if (data && data.employees && props && props.searchState.search) {
    const filteredEmployees = data.employees.filter(
      (employee:any) => {
        return (
          employee
          .firstName
          .toLowerCase()
          .includes(props.searchState.search.toLowerCase()) ||
          employee
          .lastName
          .toLowerCase()
          .includes(props.searchState.search.toLowerCase()) ||
          employee
          .title.name
          .toLowerCase()
          .includes(props.searchState.search.toLowerCase()) ||
          employee
          .email
          .toLowerCase()
          .includes(props.searchState.search.toLowerCase())
        );
      }
    );
    console.log("filtered employees", filteredEmployees)
    dataEmployees = filteredEmployees;
  }

  return (
    <div>
      <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" >
        {dataEmployees.map((employee:any) => (
          <div key={employee.id} className="bg-gray-100 flex flex-col justify-center items-center relative py-6 rounded-xl transition-all hover:bg-gray-50">
            <div className="w-28 h-28 m-4 rounded-full overflow-hidden bg-blue-300">
              {employee.photo ?
              <img src={employee.photo} className="min-w-full min-h-full" />
              : 
              <IconProfile></IconProfile>
              }
            </div>
            <p className="font-bold mb-2">
              {employee.firstName} {employee.lastName} 
            </p>
            <p className="bg-blue-100 text-gray-800 px-3 py-1 text-sm rounded-2xl mb-2">{employee.title && employee.title.name}</p>
            <a href={'tel:' + employee.phone} className="text-gray-600 transition-all hover:text-gray-900"><p>{employee.phone}</p></a>
            <a href={'mailto:' + employee.email} className="text-blue-600 hover:text-blue-900"><p>{employee.email}</p></a>

            {/* Status Icon */}
            <p className="absolute top-2 left-2 w-2 text-blue-400">
              {employee.status && employee.status === 'remote' ?
                <IconRemote></IconRemote>
              : '' }
              {employee.status && employee.status === 'office' ?
                <IconOffice></IconOffice>
              : '' }
              {employee.status && employee.status === 'vacation' ?
                <IconVacation></IconVacation>
              : '' }
              {employee.status && employee.status === 'off' ?
                <IconOff></IconOff>
              : '' }

            </p>

            {/* Options button */}
            <IconOptions></IconOptions>
            
          </div>
        ))}
      </div>
      <button onClick={() => onLoadMore()}>Load More</button>
    </div>
  )
}

function StatusCounts({data}: {data:any}) {
  return (
    <div className="flex flex-row p-2 bg-gray-100 rounded-lg">
      <StatusCount data={data} count="remoteCount" name="Remote" icon={IconRemote}></StatusCount>
      <StatusCount data={data} count="officeCount" name="In Office" icon={IconOffice}></StatusCount>
      <StatusCount data={data} count="vacationCount" name="Vacation" icon={IconVacation}></StatusCount>
      <StatusCount data={data} count="offCount" name="Day Off" icon={IconOff}></StatusCount>
    </div>
  )
}

function StatusCount({data, count, name, icon} : {data: any, count: string, name: string, icon:any}) {
  const IconComponent = icon;

  return (
    <div className="flex flex-col px-2 w-24">
      <p className="text-sm text-gray-500">{name}</p>
      <p className="flex flex-row items-center">
        <IconComponent></IconComponent>
        {data && data[count]}
      </p>
    </div>
  )
}


const GET_TITLES = gql`
  query GetTitles {
    titles {
      name
    }
  }
`

function OrganizeData({...props}) {
  const { loading, error, data } = useQuery(GET_TITLES);

  console.log("Organize Data: ", props)

  return(
    <div className="bg-gray-100 p-5 mt-4 mb-8 text-gray-800 text-sm">
      <input 
        type="text" 
        className="w-1/4 py-2 px-4 rounded-xl border border-solid border-gray-200 outline-none transition-all focus:border-gray-400 mr-6"
        placeholder="Search by name, email, team, etc."
        value={props.searchState.search}
        onChange={(e) =>
          props.onStateChange(e)
        }
      ></input>
      <select 
        className="w-auto py-2 px-4 rounded-xl border border-solid border-gray-200 outline-none transition-all focus:border-gray-400"
        placeholder="Titles"
      >
        {data && data.titles.map((title:any) => (
          <option value={title.name}>{title.name}</option>
        ))}
      </select>
    </div>
  )
}
