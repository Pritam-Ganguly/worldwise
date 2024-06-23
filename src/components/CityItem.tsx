import React, { FormEvent } from "react";
import { ICities } from "../App";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { useCityContext } from "../contexts/CitiesContextProvider";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const CityItem: React.FC<{ city: ICities }> = ({ city }) => {
  const { cityName, emoji, date, id , position} = city;
  const {currentCity, deleteCity} = useCityContext();
  const handleDeleteCity = (e: FormEvent) => {
    e.preventDefault();
    deleteCity(String(id));
  }

  return (
    <Link className={`${styles.cityItem} ${id === currentCity.id ? styles['cityItem--active'] : ""}` } to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
      <span className={styles.emoji}>{emoji}</span>
      <h3 className={styles.name}>{cityName}</h3>
      <time className={styles.date}>{formatDate(date)}</time>
      <button className={styles.deleteBtn} onClick={handleDeleteCity}
      >&times;</button>
    </Link>
  );
};

export default CityItem;
