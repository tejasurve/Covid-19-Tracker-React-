import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import Infobox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import  { prettyPrintStat,sortData } from "./Util";
import Linegraph from "./LineGraph"

import './App.css';
import "leaflet/dist/leaflet.css";




function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData , setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom,setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");



  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {

      setCountryInfo(data);
      
    });

  },[]);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country, //united States,India
              value: country.countryInfo.iso2//us, ind, uk
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data)
          setCountries(countries);
        });

    };
    getCountriesData();
  }, []);


  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([ data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  }

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1><u>Covid-19 Tracker</u></h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>

              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>

                ))
              }

            </Select>

          </FormControl>

        </div>

        <div className="app_stats">
          <Infobox 
          isRed
          active={casesType === "cases"}
          onClick={(e) => setCasesType("cases")}
          title="CoronaVirun Cases"  
          /*cases={prettyPrintStat(countryInfo.todayCases)}  */
          cases={countryInfo.todayCases} 
          total={countryInfo.cases}/>

          <Infobox
          active={casesType === "recovered"}
          onClick={(e) => setCasesType("recovered")}
          title="Recovered" 
          /*cases={prettyPrintStat(countryInfo.todayRecovered)}*/
          cases={countryInfo.todayRecovered}
           total={countryInfo.recovered}/>

          <Infobox 
          isRed
          active={casesType === "deaths"}
          onClick={(e) => setCasesType("deaths")}
          title="Deaths"
            /*cases={prettyPrintStat(countryInfo.todayDeaths)} */
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
            
            
            />
            


        </div>


        {/* MApss */}
        <Map
        casesType={casesType}
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}
        ></Map>


      </div>

        <Card className="app_right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}></Table>
            <h3 className="app_graphTitle">Worldwide Live Cases {casesType}</h3>
            <Linegraph className="app_graph" casesType={casesType}></Linegraph>
            {/*graph */}
          </CardContent>
        </Card>
      </div>
   
  );
}

export default App;
