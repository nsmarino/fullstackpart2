import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Countries = () => {
    const [results, SetResults] = useState([])
    const [ newSearch, setNewSearch ] = useState('')
    const [data, setData] = useState([])

    useEffect( () => {
        axios 
          .get('https://restcountries.eu/rest/v2/all')
          .then(response => {
              setData(response.data)
          })
    }, [])

  const displayResults = () => {
    if (results.length > 10) {
      return <p>Too many matches, specify another filter</p>
    } else if (results.length < 10 && results.length > 1) {
      const r = results.map(result => <p key={result.name}>{result.name}</p>);
      return r;
    } else if (results.length === 1) {
      const r = results.map(result => (
      <div key={result.name}>
        <h2>{result.name}</h2>
        <p>capital {result.capital}</p>
        <p>population {result.population}</p>
        <h3>languages</h3>
        <ul>
          {result.languages.map(lang => <li key={lang.name}>{lang.name}</li>)}
        </ul>
        <img src={result.flag} alt={result.name} width="100px"/>
        <h3>Weather in {result.capital}</h3>
        <p>temperature: </p>
        <p>wind: </p>
      </div>
      ));
      return r;
    }
  }

  const handleSearchChange = (event) => {
        setNewSearch(event.target.value)
        const regex = new RegExp(newSearch, 'gi')
        SetResults(
          data.filter(data => data.name.match(regex))
        )
  }

      return (
      <div>
        <form>
            <label>find countries</label>
            <input name="search" value={newSearch} onChange={handleSearchChange} onKeyUp={handleSearchChange}/>
        </form>
        <div>
          {displayResults()}
        </div>
      </div>
    )
}

export default Countries