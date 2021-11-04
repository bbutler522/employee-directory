import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useQuery,
  gql
} from "@apollo/client";

import { IconRemote, IconOffice, IconVacation, IconOff, IconProfile, IconOptions, IconGrid, IconList } from '../components/Icons';

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
const EMPLOYEES_FILTER_TITLE = gql`
  query GetEmployeesWithTitle($skip: Int, $take: Int, $title: String) {
    employees(skip: $skip, take: $take, where: {title: {name: {equals: $title}}}) {
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

  const [searchState, setSearchState] = useState({
    search: '',
    title: '',
    format: 'list',
  })

  function handleSearchChange(e:any) {
    setSearchState({
      ...searchState,
      search: e.target.value
    })
  }

  function handleTitleFilterChange(e:any) {
    setSearchState({
      ...searchState,
      title: e.target.value
    })
  }

  function handleFormatChange(format:string) {
    setSearchState({
      ...searchState,
      format: format
    })
  }

  return (
    <div>
      {/* Count of employees */}
      <PeopleCount></PeopleCount>
      
      <div className="flex flex-row justify-between width-full">

        {/* Status Counts */}
        <StatusCounts></StatusCounts>

        {/* Add Employee */}
        <Link to="/employee/create" ><button className="bg-blue-700 px-6 py-2 rounded-full text-white">Add Employee</button></Link>
      </div>

      {/* Table filters and format */}
      <OrganizeData 
        searchState={searchState} 
        onSearchChange={(e:any) => handleSearchChange(e)} 
        onTitleFilterChange={(e:any) => handleTitleFilterChange(e)}
        onFormatChange={(format:string) => handleFormatChange(format)}>
      </OrganizeData>

      {/* List of employees and information */}
      <Employees searchState={searchState} />
    </div>
  );
}

function Employees({...props}) {
  const initialCount = 48;
  const increment = 48;
  const [count, setCount] = useState({});
  const [queryName, setQueryName] = useState(
    PAGINATED_EMPLOYEES
  );

  useEffect(() => {
    // If searching by title, use the query
    if (props.searchState.title !== '') {
      setQueryName(EMPLOYEES_FILTER_TITLE)
      refetch({
        skip: 0,
        take: initialCount,
        title: props.searchState.title
      })
    } else {
      setQueryName(PAGINATED_EMPLOYEES)
      refetch({
        skip: 0,
        take: initialCount
      })
    }
  }, [props.searchState.title])

  // For initial search state change, refetch
  useEffect(() => {
    refetch({
      skip: 0,
      take: initialCount,
      title: props.searchState.title
    })
  }, [queryName])

  let { loading, error, data, refetch, fetchMore } = useQuery(queryName, {
    variables: {
      skip: 0,
      take: initialCount,
      title: ""
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
    dataEmployees = filteredEmployees;
  }

  return (
    <div>
      {props.searchState.format === 'grid' ?
      <EmployeeGrid employees={dataEmployees}></EmployeeGrid>
      : ''}
      {props.searchState.format === 'list' ?
      <EmployeeList employees={dataEmployees}></EmployeeList>
      : '' }
          
      <button onClick={() => onLoadMore()}>Load More</button>
    </div>
  )
}

function EmployeeGrid({...props}) {
  let dataEmployees = props.employees;
  
  return (
    <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" >
      {dataEmployees.map((employee:any) => (
        <div key={employee.id} className="bg-gray-100 flex flex-col justify-center items-center relative py-6 rounded-xl transition-all hover:bg-gray-50">
          <a href={'/employee/' + employee.slug}>
            <div className="w-28 h-28 m-4 rounded-full overflow-hidden bg-blue-300">
              {employee.photo ?
              <img src={employee.photo} className="min-w-full min-h-full" />
              : 
              <IconProfile></IconProfile>
              }
            </div>
          </a>
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
          <button className="absolute top-2 right-2 w-auto p-1 text-gray-400 transition-all hover:text-gray-600">
            <IconOptions></IconOptions>
          </button>
          
        </div>
      ))}
    </div>
  )
}

function EmployeeList({...props}) {
  let employees = props.employees;

  return (
    <table className="table w-full border-collapse">
      <thead>
      <tr className="text-left border">
        <TableHead title="First Name"></TableHead>
        <TableHead title="Last Name"></TableHead>
        <TableHead title="Title"></TableHead>
        <TableHead title="Email"></TableHead>
        <TableHead title="Phone"></TableHead>
        <TableHead title=""></TableHead>
      </tr>
      </thead>
      <tbody>
      {employees.map((employee:any) => (
        <tr key={employee.slug}>
          <TableData>{employee.firstName}</TableData>
          <TableData>{employee.lastName}</TableData>
          <TableData>{employee.title.name}</TableData>
          <TableData><a href={"mailto:" + employee.email}>{employee.email}</a></TableData>
          <TableData><a href={"tel:" + employee.phone}>{employee.phone}</a></TableData>
          <TableData><button className="w-auto p-1 text-gray-400 transition-all hover:text-gray-600"><IconOptions></IconOptions></button></TableData>
        </tr>
      ))}
      </tbody>
    </table>
  )
 
  function TableHead({...props}) {
    return (
      <th className="border">{props.title}</th>
    )
  }

  // interface MyProps { children?: React.ReactNode }
  function TableData({...props}) {

    return (
      <td className="relative">{props.children}</td>
    )
  }

}

function PeopleCount() {
  const { loading, error, data } = useQuery(COUNT_EMPLOYEES);

  return (
    <p className="text-3xl font-bold text-black pt-8 pb-8">People <span className="text-gray-600">{data && data.employeesCount}</span></p>
  )
}

function StatusCounts() {
  const { loading, error, data } = useQuery(COUNT_EMPLOYEES);

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
  const formatClasses = "ml-1 p-1";
  const formatSelectedClasses = "ml-1 p-1 bg-blue-200 rounded-md";

  return(
    <div className="bg-gray-100 p-4 rounded-xl mt-4 mb-8 text-gray-800 text-sm flex flex-row justify-between items-center">
      <div className="w-full">
        <input 
          type="text" 
          className="w-2/4 py-2 px-4 rounded-xl border border-solid border-gray-200 outline-none transition-all focus:border-gray-400 mr-6"
          placeholder="Search by name, email, team, etc."
          value={props.searchState.search}
          onChange={(e) =>
            props.onSearchChange(e)
          }
        ></input>
        <select 
          className="w-auto py-2 px-4 rounded-xl border border-solid border-gray-200 outline-none transition-all focus:border-gray-400"
          placeholder="Titles"
          onChange={(e) => {
            props.onTitleFilterChange(e)
            }
          }
        >
          <option defaultValue='' value='' className="text-gray-100">Filter by title</option>
          {data && data.titles.map((title:any) => (
            <option key={title.name} value={title.name}>{title.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-row mr-10">
          <p className="mr-1 leading-loose	">Sort: </p>
          <select className="">
            <option value="name-asc">Name (asc)</option>
            <option value="name-dsc">Name (dsc)</option>
          </select>
        </div>
        <button 
          onClick={() => props.onFormatChange('grid')} 
          className={props.searchState.format === 'grid' ? formatSelectedClasses : formatClasses}
        >
          <IconGrid></IconGrid>
        </button>
        <button 
          onClick={() => props.onFormatChange('list')} 
          className={props.searchState.format === 'list' ? formatSelectedClasses : formatClasses}
        >
          <IconList></IconList>
        </button>
      </div>
    </div>
  )
}
