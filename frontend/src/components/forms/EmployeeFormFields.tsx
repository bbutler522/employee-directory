export default function EmployeeFormFields({...props}) {
  console.log(props)
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <EmployeeFormField name="firstName" title="First Name" formState={props.formState} onChange={(e:any) => props.handleFormState("firstName", e)}></EmployeeFormField>
      <EmployeeFormField name="lastName" title="Last Name" formState={props.formState} onChange={(e:any) => props.handleFormState("lastName", e)}></EmployeeFormField>
      <EmployeeFormField name="email" title="Email" formState={props.formState} onChange={(e:any) => props.handleFormState("email", e)}></EmployeeFormField>
      <EmployeeFormField name="phone" title="Phone" formState={props.formState} onChange={(e:any) => props.handleFormState("phone", e)}></EmployeeFormField>
      <EmployeeFormField name="slug" title="Slug" formState={props.formState} onChange={(e:any) => props.handleFormState("slug", e)}></EmployeeFormField>
      <EmployeeFormField name="city" title="City" formState={props.formState} onChange={(e:any) => props.handleFormState("city", e)}></EmployeeFormField>
      <EmployeeFormField name="state" title="State" formState={props.formState} onChange={(e:any) => props.handleFormState("state", e)}></EmployeeFormField>
      <EmployeeFormField name="country" title="Country" formState={props.formState} onChange={(e:any) => props.handleFormState("country", e)}></EmployeeFormField>
      <EmployeeFormField name="photo" title="Photo Url" formState={props.formState} onChange={(e:any) => props.handleFormState("photo", e)}></EmployeeFormField>
      <EmployeeFormField name="title" title="Title (Must exist already atm.)" formState={props.formState} onChange={(e:any) => props.handleFormState("title", e)}></EmployeeFormField>
    </div>
  )
}

export function EmployeeFormField({...props}) {
  const name = props.name

  return(
    <div className="flex flex-col">
      <label className="text-sm font-bold" htmlFor={props.name}>{props.title}</label>
      <input value={props.formState[name]} 
        onChange={(e) => props.onChange(e)}
        type="text" 
        name={props.name} 
        className="bg-gray-100 py-1 px-2 rounded-xl border border-solid border-gray-200 outline-none transition-all focus:border-gray-400"
      />
    </div>
  )
}