
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
    }
  }
`;

function Employees() {
  const { loading, error, data } = useQuery(ALL_EMPLOYEES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data.employees[0].id)
  return data.employees.map((employee:any) => (
    <div key={employee.id}>
      <p>
        {employee.firstName} {employee.lastName} 
      </p>
    </div>
  ));
}