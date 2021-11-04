
import { IconRemote, IconOffice, IconVacation, IconOff, IconProfile, IconOptions } from '../components/Icons';

export default function EmployeeGrid({...props}) {
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