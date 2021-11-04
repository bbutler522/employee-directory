import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useQuery,
  gql
} from "@apollo/client";

import { IconRemote, IconOffice, IconVacation, IconOff, IconOptions, IconGrid, IconList } from '../components/Icons';
import { PAGINATED_EMPLOYEES, EMPLOYEES_FILTER_TITLE, COUNT_EMPLOYEES } from '../Queryies';

import EmployeeGrid from '../components/EmployeeGrid';
import EmployeeList from '../components/EmployeeList';
import OrganizeData from '../components/OrganizeData';

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