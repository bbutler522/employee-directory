import { IconOptions } from '../components/Icons';


export default function EmployeeList({...props}) {
  let employees = props.employees;

  const rowClasses = "transition-all hover:bg-gray-200"

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
      {employees.map((employee:any, index:number) => (
        <tr key={employee.slug} className={index % 2 ? rowClasses + ' bg-blue-100' : rowClasses}>
          <TableData><a href={"employee/" + employee.slug}><p>{employee.firstName}</p></a></TableData>
          <TableData><a href={"employee/" + employee.slug}><p>{employee.lastName}</p></a></TableData>
          <TableData><p>{employee.title.name}</p></TableData>
          <TableData><a href={"mailto:" + employee.email}><p>{employee.email}</p></a></TableData>
          <TableData><a href={"tel:" + employee.phone}><p>{employee.phone}</p></a></TableData>
          <TableData><a href={"employee/" + employee.slug}><button className="w-auto p-1 text-gray-400 transition-all hover:text-gray-600"><IconOptions></IconOptions></button></a></TableData>
        </tr>
      ))}
      </tbody>
    </table>
  )
 
  function TableHead({...props}) {
    return (
      <th className="border py-1 px-3">{props.title}</th>
    )
  }

  // interface MyProps { children?: React.ReactNode }
  function TableData({...props}) {

    return (
      <td className="relative border py-1 px-3">{props.children}</td>
    )
  }

}