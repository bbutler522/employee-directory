import {
  useQuery,
  gql
} from "@apollo/client";
import { IconGrid } from '../components/Icons';
import { IconList } from '../components/Icons';

import { GET_TITLES } from '../Queryies';

export default function OrganizeData({...props}) {
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
        <div className="flex flex-row ">
          <p className="mr-1 leading-loose	">Sort: </p>
          {/* <select className="">
            <option value="name-asc">Name (asc)</option>
            <option value="name-dsc">Name (dsc)</option>
          </select> */}
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
