import { useParams} from "react-router-dom";
import styles from "./City.module.css";
import { useCityContext } from "../contexts/CitiesContextProvider";
import { useEffect } from "react";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

const formatDate = (date : string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {

  // const [searchParams, ] = useSearchParams();
  // const lat = searchParams.get('lat');
  // const lng = searchParams.get('lng');
  const {id} = useParams();
  const {currentCity, getCity, isLoading} = useCityContext();
  const { cityName, emoji, date, notes } = currentCity;

  useEffect(function(){
    if(getCity !== undefined && id !== undefined)
      getCity(id)
  }, [id])

  if(isLoading) return <Spinner/>

  return (
    // <div className={styles.city}>
    //   City = {id} <p>Latitute = {lat} Longitute{lng}</p>
    // </div>

    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name {id}</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
