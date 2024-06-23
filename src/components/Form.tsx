// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { FormEvent, useEffect, useState } from "react";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import useURLPosition from "../hooks/useURLPosition";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-date-picker";
import { useCityContext } from "../contexts/CitiesContextProvider";
import { useNavigate } from "react-router-dom";

type ValuePieceType = Date | null;

type ValueType = ValuePieceType | [ValuePieceType, ValuePieceType];

export function convertToEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useURLPosition();
  const [cityName, setCityName] = useState("");
  const [date, setDate] = useState<ValueType>(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState<boolean>(false);
  const [geoCodingError, setGeoCodingError] = useState<string>("");
  const [emoji, setEmoji] = useState<string>();
  const {createCity, isLoading} = useCityContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCityName = async () => {
      try {
        setGeoCodingError("");
        setIsLoadingGeoCoding(true);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (data.countryCode === "") {
          setGeoCodingError(
            "That doesn't seem to be a city, please click somewhere else. "
          );
          throw new Error("Invalid city location");
        }
        setCityName(data.city || data.locality || "");
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        console.log(error);
      } finally {
        await setIsLoadingGeoCoding(false);
      }
    };
    fetchCityName();
  }, [lat, lng]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cityData = {
      cityName: cityName,
      emoji: emoji,
      date: date,
      position: {
        lat: lat,
        lng: lng
      },
    }
    console.log("Here");
    await createCity(JSON.stringify(cityData));
    navigate("/app/cities")
  }

  if (isLoadingGeoCoding) return <Spinner />;

  if (geoCodingError) return <Message message={geoCodingError}/>;

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag} style={{ color: "black" }}>
          {emoji}
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker id="date" onChange={setDate} value={date} format="dd/MM/yyyy"/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button
          onClick={handleSubmit}
          type="primary"
        >
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
