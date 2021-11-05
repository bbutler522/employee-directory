import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useQuery,
  gql
} from "@apollo/client";
import ReactPaginate from 'react-paginate';

import { IconRemote, IconOffice, IconVacation, IconOff, IconOptions, IconGrid, IconList } from '../components/Icons';
import { PAGINATED_EMPLOYEES, EMPLOYEES_FILTER_TITLE, COUNT_EMPLOYEES } from '../Queryies';

import EmployeeGrid from '../components/EmployeeGrid';
import EmployeeList from '../components/EmployeeList';
import OrganizeData from '../components/OrganizeData';

export default function DirectoryPage() {
  

  const [searchState, setSearchState] = useState({
    search: '',
    title: '',
    format: 'grid',
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
      {/* {data && data.employees ? */}
      <PaginatedItems searchState={searchState}></PaginatedItems>
      {/* : ''} */}
      {/* <EmployeesOld searchState={searchState} /> */}
    </div>
  );
}

function PaginatedItems({ ...props }) {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [queryName, setQueryName] = useState(
    PAGINATED_EMPLOYEES
  );

  let limit = 24;
  let { loading, error, data, refetch, fetchMore } = useQuery(queryName, {
    variables: {
      skip: 0,
      take: limit,
      title: ""
    },
  });

  useEffect(() => {
    // If searching by title, use the query
    if (props.searchState.title !== '') {
      setQueryName(EMPLOYEES_FILTER_TITLE)
      refetch({
        skip: 0,
        take: limit,
        title: props.searchState.title
      })
    } else {
      setQueryName(PAGINATED_EMPLOYEES)
      refetch({
        skip: 0,
        take: limit
      })
    }
    setItemOffset(0)
  }, [props.searchState.title])

  // For initial search state change, refetch
  useEffect(() => {
    refetch({
      skip: 0,
      take: limit,
      title: props.searchState.title
    })
  }, [queryName])

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + limit;
    if (data){
      setCurrentItems(data.employees)
      setPageCount(Math.ceil(data.employeesCount / limit));
    }
  }, [itemOffset, props.itemsPerPage, data, props.searchState.title]);

  // Invoke when user click to request another page.
  const handlePageClick = (event:any) => {
    const newOffset = (event.selected * limit) % data.employeesCount;
    fetchMore({
      variables: {
        skip: newOffset,
      }
    })
    setItemOffset(newOffset);
  };

  return (
    <div>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={10}
        pageCount={pageCount}
        previousLabel="<"
        marginPagesDisplayed={1}
        containerClassName="flex flex-row text-xs font-bold mb-2 justify-end leading-loose	"
        pageClassName="flex h-6 justify-center align-center"
        pageLinkClassName="px-2 border h-full	"
        activeLinkClassName="bg-blue-100"
        previousClassName="flex h-6"
        previousLinkClassName="px-2 border rounded-l-lg"
        nextClassName="flex h-6"
        nextLinkClassName="px-2 border rounded-r-lg"
      />
      <Employees currentItems={currentItems} searchState={props.searchState} />
    </div>
  );
}

export function Employees ({...props}) {
  let currentEmployees = props.currentItems;

  // Search currently provided employees. Eventually should query all pages of relevant employees.
  if (props.currentItems && props && props.searchState.search) {
    const filteredEmployees = props.currentItems.filter(
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
    currentEmployees = filteredEmployees
  }

  if (!currentEmployees) {
    return (
      <p>Loading</p>
    )
  }

  return (
    <div>
      {props.searchState.format === 'grid' ?
        <EmployeeGrid employees={currentEmployees}></EmployeeGrid> : ''}
      {props.searchState.format === 'list' ?
        <EmployeeList employees={currentEmployees}></EmployeeList> : ''}
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