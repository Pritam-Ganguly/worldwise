import styles from "./CountryItem.module.css";

const CountryItem: React.FC<{country: string, emoji: string}> = ({ country, emoji }) =>{
  return (
    <li className={styles.countryItem}>
      <span>{emoji}</span>
      <span>{country}</span>
    </li>
  );
}

export default CountryItem;
