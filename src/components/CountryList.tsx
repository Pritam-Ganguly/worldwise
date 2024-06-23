import React from "react";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCityContext } from "../contexts/CitiesContextProvider";

const CountryList: React.FC = () => {

  const {cities, isLoading} = useCityContext();

  if (isLoading) return <Spinner />;

  if (!cities.length) {
    return (
      <Message message="Please start selecting cities that you have visited" />
    );
  }

  const countries = cities.reduce(
    (arr: { country: string; emoji: string }[], city) => {
      if (
        !arr
          .map((el: { country: string; emoji: string }) => el.country)
          .includes(city.country)
      )
        return [...arr, { country: city.country, emoji: city.emoji }];
      else return arr;
    },
    []
  );

  return (
    <ul className={styles.cityList}>
      {countries.map((country, i) => (
        <CountryItem country={country.country} emoji={country.emoji} key={i} />
      ))}
    </ul>
  );
};

export default CountryList;
