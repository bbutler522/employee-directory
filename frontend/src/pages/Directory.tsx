import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useQuery,
  gql
} from "@apollo/client";

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
    title
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

  return (
    <div>
      <p className="text-3xl font-bold text-black pt-8 pb-8">People <span className="text-gray-600">{data && data.employeesCount}</span></p>

      
      <div className="flex flex-row justify-between width-full">

        {/* Status Counts */}
        <StatusCounts data={data}></StatusCounts>

        {/* Add Employee */}
        <Link to="/employee/create" ><button className="bg-blue-700 px-6 py-2 rounded-full text-white">Add Employee</button></Link>
      </div>

      {/* Table filters and format */}
      <OrganizeData></OrganizeData>

      <Employees />
    </div>
  );
}

function Employees() {
  const initialCount = 12;
  const increment = 12;
  const [count, setCount] = useState(initialCount);

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

  return (
    <div>
      <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" >
        {data.employees.map((employee:any) => (
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
            <p className="bg-blue-100 text-gray-800 px-3 py-1 text-sm rounded-2xl mb-2">{employee.title}</p>
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

function OrganizeData() {
  return(
    <div className="bg-gray-100 p-5 mt-4 mb-8">
    </div>
  )
}

function IconRemote() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      <circle fill="currentColor" stroke="currentColor" cx="12" cy="20.5" r="1.5"/>
    </svg>
  )
}

function IconOffice() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  )
}

function IconVacation() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}

function IconOff() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function IconProfile() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" className="min-w-full min-h-full fill-current text-blue-100">
      <path d="M24 24c4.42 0 8-3.59 8-8 0-4.42-3.58-8-8-8s-8 3.58-8 8c0 4.41 3.58 8 8 8zm0 4c-5.33 0-16 2.67-16 8v4h32v-4c0-5.33-10.67-8-16-8z"/>
      <path d="M0 0h48v48h-48z" fill="none"/>
    </svg> 
  )
}

function IconOptions() {
  return (
    <button className="absolute top-2 right-2 w-auto p-1 text-gray-400 transition-all hover:text-gray-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"  viewBox="0 0 20 20" stroke="currentColor" fill="currentColor" strokeWidth="2">
        <circle cx="9" cy="2" r="1"></circle>
        <circle cx="9" cy="10" r="1"></circle>
        <circle cx="9" cy="18" r="1"></circle>
      </svg>
    </button>
  )
}