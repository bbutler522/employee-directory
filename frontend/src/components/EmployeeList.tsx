import { IconOptions } from '../components/Icons';


export default function EmployeeList({...props}) {
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
          <TableData><a href={"employee/" + employee.slug}>{employee.firstName}</a></TableData>
          <TableData><a href={"employee/" + employee.slug}>{employee.lastName}</a></TableData>
          <TableData>{employee.title.name}</TableData>
          <TableData><a href={"mailto:" + employee.email}>{employee.email}</a></TableData>
          <TableData><a href={"tel:" + employee.phone}>{employee.phone}</a></TableData>
          <TableData><a href={"employee/" + employee.slug}><button className="w-auto p-1 text-gray-400 transition-all hover:text-gray-600"><IconOptions></IconOptions></button></a></TableData>
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