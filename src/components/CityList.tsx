import React from 'react'
import styles from './CityList.module.css';
import Spinner from './Spinner';
import CityItem from './CityItem';
import Message from './Message';
import { useCityContext } from '../contexts/CitiesContextProvider';

const CityList : React.FC= () => {
  const {cities, isLoading} = useCityContext();
    if(isLoading) return <Spinner/>
    
    if(!cities.length){
      return <Message message='Please start selecting cities that you have visited'/>
    }

    return (
      <ul className={styles.cityList}>
        {cities.map((city) => <CityItem city={city} key={city.id}/>)}
      </ul>
  )
}

export default CityList
