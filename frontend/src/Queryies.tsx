// GraphQL Queryies

import {
  gql
} from "@apollo/client";

// Get a portion of paginated employees
export const PAGINATED_EMPLOYEES = gql`
  query PaginatedEmployees($skip: Int, $take: Int) {
  employees(skip: $skip, take: $take) {
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
    title {
      name
    }
    teams {
      name
    }
  }
  employeesCount
}
`;

// Get employees with a specific title
export const EMPLOYEES_FILTER_TITLE = gql`
  query GetEmployeesWithTitle($skip: Int, $take: Int, $title: String) {
    employees(skip: $skip, take: $take, where: {title: {name: {equals: $title}}}) {
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
      title {
        name
      }
      teams {
        name
      }
    }
    employeesCount(where: {title: {name: {equals: $title}}})
  }
`;

export const COUNT_EMPLOYEES = gql`
  query countEmployees {
    employeesCount
    remoteCount: employeesCount(where: {status: {equals: "remote"}})
    officeCount: employeesCount(where: {status: {equals: "office"}})
    vacationCount: employeesCount(where: {status: {equals: "vacation"}})
    offCount: employeesCount(where: {status: {equals: "off"}})
  }
`

export const GET_TITLES = gql`
  query GetTitles {
    titles {
      name
    }
  }
`

export const GET_EMPLOYEE = gql`
  query GetEmployee($slug: String) {
    employee(where: {slug: $slug}) {
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
      title {
        name
      }
      teams {
        name
      }
    }
  }
`