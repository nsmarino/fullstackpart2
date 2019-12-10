import React, { useState, useEffect } from 'react'
import numberService from './services/numbers'
// import Countries from './components/Countries'


const Entry = ({person, removeEntry}) => {
  return (
    <li>
      {person.name} {person.number} 
      <button onClick={removeEntry}>delete</button>
    </li>
  )
}

const Filter = (props) => {
  const results = () => 
    props.searchResults.map(result =>
    <Entry key={result.name} person={result}/>)

  return (
    <div>
      <form>
      <label htmlFor="search">search: </label>
      <input name="search" 
             value={props.newSearch} 
             onChange={props.handleSearchChange} 
             onKeyUp={props.handleSearchChange} />
      </form>

      <ul>
      {results()}
      </ul>
    </div>
  )
}

const Contacts = (props) => {
  const contactlist = () => props.persons.map(person => <Entry key={person.name} person={person} removeEntry={() => props.remove(person.id)}/>
  )
  
  return (
      <ul>
      {contactlist()}
      </ul>
  )
}

const PersonForm = (props) => {
return (
        <form>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange} />
        </div>
        <div>number <input value={props.newNumber} onChange={props.handleNumberChange}/></div>
        <div>
          <button onClick={props.handleClick} type="submit">add</button>
        </div>
      </form>
)
}

const Notification = ({ message }) => {
  if (message === null) {
    return;
  }

  return (
    <div className="confirmation">
      {message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')
  const [ searchResults, setSearchResults ] = useState([])
  const [notify, setNotify] = useState('')

  useEffect( () => {
    numberService.getAll()
      .then(storedNumbers => {
        setPersons(storedNumbers)
      })
  }, [])
 
  const handleClick = (event) => {
    const doesInclude = persons.find(person => person.name === newName) ? true : false;
    event.preventDefault()
    if (newName === '' || newNumber === '') return;
    if (doesInclude) {
      if (window.confirm(`${newName} already exists in the contact list. Update phone number?`)) {
        const contactToUpdate = persons.find(person => person.name === newName)
        const updatedContact = {...contactToUpdate, number: newNumber}
        numberService.update(contactToUpdate.id, updatedContact)
          .then(numberService.getAll)
          .then(res => setPersons(res))
          .catch(error => {setNotify(`${contactToUpdate.name} has already been removed from this list. please refresh.`)
          setTimeout(() => {
            setNotify('');
          }, 2000)})
        setNewName('')
        setNewNumber('')
        return;
      }
      setNewName('')
      setNewNumber('')
      return;
    }
    const newPerson = {
      name: newName,
      number: newNumber
    }

    numberService
    .create(newPerson)
      .then(returnedPerson => {
        setNotify(`${returnedPerson.name} was added to contact list`)
        setTimeout(() => {
          setNotify('');
        }, 2000)
        setNewName('')
        setNewNumber('')
        setPersons(persons.concat(returnedPerson))

      })


  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
    const regex = new RegExp(newSearch, 'gi')
    setSearchResults(persons.filter(person => person.name.match(regex)))
  }
  
  const remove = id => {
    const entry = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${entry.name}?`)) {
      numberService.remove(entry.id).then(numberService.getAll).then(res => setPersons(res))
    }
  }
return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notify} />
      <Filter newSearch={newSearch}
              handleSearchChange={handleSearchChange}
              searchResults={searchResults}
      />
      <h2>Add a contact</h2>
      <PersonForm newName={newName}
                  handleNameChange={handleNameChange}
                  newNumber={newNumber}
                  handleNumberChange={handleNumberChange}
                  handleClick={handleClick}
                  
      />
      <h2>Numbers go here</h2>
      <Contacts persons={persons} remove={remove} />

      {/* <h2>Country List</h2> */}
      {/* <Countries /> */}
    </div>
  )
}

export default App