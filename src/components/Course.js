import React from 'react'

const Subheader = ({name}) => <h2>{name}</h2>

const Content = ({parts}) => {
  const result = () => 
      parts.map(part =>
        <li key={part.id}>
          {part.name} {part.exercises}
        </li>
        )
  const total = parts.map (
        part => part.exercises
        ).reduce (
        (a,b) => a+b
        )
  return (
        <>
        <ul>{result()}</ul>
        <p>Total of {total} exercises</p>
        </>

  )
}

const Course = ({ course }) => {
    return(
        <>
        <Subheader name={course.name} />
        <Content parts={course.parts} />
        </>
    )
    
}

export default Course