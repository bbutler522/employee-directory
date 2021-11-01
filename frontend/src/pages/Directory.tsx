
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
        <div key={employee.id} className="bg-purple-50 flex flex-col justify-center items-center	">
          <div className="w-28 h-28 m-4 rounded-full overflow-hidden bg-purple-300">
            {employee.photo ?
            <img src={employee.photo} className="min-w-full min-h-full" />
            : 
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="4 0 40 40" className="min-w-full min-h-full fill-current text-purple-100">
              <path d="M24 24c4.42 0 8-3.59 8-8 0-4.42-3.58-8-8-8s-8 3.58-8 8c0 4.41 3.58 8 8 8zm0 4c-5.33 0-16 2.67-16 8v4h32v-4c0-5.33-10.67-8-16-8z"/>
              <path d="M0 0h48v48h-48z" fill="none"/>
            </svg> 
            }
          </div>
          <p>
            {employee.firstName} {employee.lastName} 
          </p>
          <p>{employee.title}</p>
          <p>{employee.phone}</p>
          <p>{employee.email}</p>
        </div>
      ))}
    </div>
  )
}