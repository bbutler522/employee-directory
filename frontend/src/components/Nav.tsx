import {
  Link,
  useLocation
} from "react-router-dom";

export default function Nav() {
  let location = useLocation();

  const liClasses = 'bg-white p-5 mb-2 mr-5 rounded-full shadow-md';
  const liClassesSelected = 'bg-white p-5 mb-2 pr-10 rounded-l-full selected-li shadow-md';
  const linkClasses = 'text-gray-700 font-bold text-xs bg-gray-200 w-24 h-24 rounded-full flex flex-col justify-center items-center bg-white';
  const linkClassesSelected = 'text-white font-bold text-xs bg-blue-600 w-24 h-24 rounded-full flex flex-col justify-center items-center bg-white';

  return (

    <nav className="w-36 mt-5 flex flex-col">
      <ul className="w-full flex flex-col justify-center items-center">
        <li className={location && location.pathname === '/' ? liClassesSelected : liClasses}>
          <div>
            <Link to="/" className={location && location.pathname === '/' ? linkClassesSelected : linkClasses}>
              <IconUsers></IconUsers> Directory
            </Link>
          </div>
        </li>
        <li className={location && location.pathname === '/employee/create' ? liClassesSelected : liClasses}>
          <div>
            <Link to="../employee/create" className={location && location.pathname === '/employee/create' ? linkClassesSelected : linkClasses}> 
              <IconUserCreate></IconUserCreate> Create
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  )
}

function IconUsers() {
  return (
  <svg className="w-6 h-6 " xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>)
}

function IconUserCreate() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <line x1="20" y1="8" x2="20" y2="14"></line>
      <line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
  )
}
