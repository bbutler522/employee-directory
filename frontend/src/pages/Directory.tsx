
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
export default function DirectoryPage() {
  

  return (
    <div>
      <p>Hello</p>
      <Employees />
    </div>
  );
}



const ALL_EMPLOYEES = gql`
  query Employees {
    employees {
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

function Employees() {
  const { loading, error, data } = useQuery(ALL_EMPLOYEES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="container 2xl grid grid-cols-4 gap-4">
      {data.employees.map((employee:any) => (
        <a key={employee.id} href="#" className="bg-blue-50 flex flex-col justify-center items-center relative py-6 transition-all hover:bg-gray-50">
          <div className="w-28 h-28 m-4 rounded-full overflow-hidden bg-blue-300">
            {employee.photo ?
            <img src={employee.photo} className="min-w-full min-h-full" />
            : 
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="4 0 40 40" className="min-w-full min-h-full fill-current text-purple-100">
              <path d="M24 24c4.42 0 8-3.59 8-8 0-4.42-3.58-8-8-8s-8 3.58-8 8c0 4.41 3.58 8 8 8zm0 4c-5.33 0-16 2.67-16 8v4h32v-4c0-5.33-10.67-8-16-8z"/>
              <path d="M0 0h48v48h-48z" fill="none"/>
            </svg> 
            }
          </div>
          <p className="font-bold mb-2">
            {employee.firstName} {employee.lastName} 
          </p>
          <p className="bg-blue-200 text-gray-800 px-3 py-1 text-sm rounded-2xl mb-2">{employee.title}</p>
          <a href={'tel:' + employee.phone} className="text-gray-600 transition-all hover:text-gray-900"><p>{employee.phone}</p></a>
          <a href={'mailto:' + employee.email} className="text-blue-600 hover:text-blue-900"><p>{employee.email}</p></a>

          {/* Status Icon */}
          <p className="absolute top-2 left-2 w-2 text-blue-300">
            {employee.status && employee.status == 'remote' ?
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                <circle fill="currentColor" stroke="currentColor" cx="12" cy="20.5" r="1.5"/>
              </svg>
            : '' }
            {employee.status && employee.status == 'office' ?
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            : '' }
            {employee.status && employee.status == 'vacation' ?
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            : '' }
            {employee.status && employee.status == 'off' ?
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            : '' }

          </p>
          
        </a>
      ))}
    </div>
  )
}