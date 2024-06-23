import { createContext, useContext, useEffect, useReducer } from "react";
import { ICities } from "../App";

interface ICitiesContext {
  cities: ICities[];
  isLoading: boolean;
  currentCity: ICities;
  getCity: (id: string) => void;
  createCity: (data: string) => void;
  deleteCity: (id: string) => void;
}

const initialCitiesContextState: ICitiesContext = {
  cities: [],
  isLoading: true,
  currentCity: {
    cityName: "",
    country: "",
    date: "2027-10-31T15:59:59.138Z",
    emoji: "",
    id: -1,
    notes: "",
    position: { lat: 0, lng: 11 },
  },
  getCity: () => {},
  createCity: () => {},
  deleteCity: () => {},
};

interface IInitialReducerState {
  cities: ICities[];
  currentCity: ICities;
  isLoading: boolean;
  error: string;
}

const initialReducerState: IInitialReducerState = {
  cities: [],
  currentCity: initialCitiesContextState.currentCity,
  isLoading: false,
  error: "",
};

const reducer: (
  state: IInitialReducerState,
  action: { type: string; payload?: any }
) => IInitialReducerState = (state, action) => {
  switch (action.type) {
    case "isLoading":
      return { ...state, isLoading: true };
    case "cities/setCities":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/currCity":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/create":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/delete":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(
          (city) => String(city.id) !== action.payload
        ),
      };
    case "rejected":
      return { ...state, isLoading: false, error: String(action.payload) };
    default:
      return { ...state, isLoading: false, error: "Invalid reducer operation" };
  }
};

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext<ICitiesContext>(initialCitiesContextState);

const CitiesContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialReducerState
  );

  useEffect(() => {
    const fetchCities = async () => {
      try {
        dispatch({ type: "isLoading" });
        const jsonData = await fetch(`${BASE_URL}/cities`);
        const citiesData = await jsonData.json();
        dispatch({ type: "cities/setCities", payload: citiesData });
      } catch {
        dispatch({ type: "rejected", payload: "Error loading cities" });
        alert(error);
      }
    };
    fetchCities();
  }, []);

  const getCity = async (id: string) => {
    if (String(currentCity.id) === id) return;
    const fetchCities = async () => {
      try {
        dispatch({ type: "isLoading" });
        const jsonData = await fetch(`${BASE_URL}/cities/${id}`);
        const cityData = await jsonData.json();
        dispatch({ type: "city/currCity", payload: cityData });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error fetching city details.",
        });
        alert(error);
      }
    };
    await fetchCities();
  };

  const createCity = async (cityDetails: string) => {
    try {
      dispatch({ type: "isLoading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: cityDetails,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const cityData = await res.json();
      dispatch({ type: "city/create", payload: cityData });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating a new city.",
      });
      alert(error);
    }
  };

  const deleteCity = async (id: string) => {
    try {
      dispatch({ type: "isLoading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/delete", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting a new city.",
      });
      alert(error);
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities: cities,
        isLoading: isLoading,
        currentCity: currentCity,
        getCity: getCity,
        createCity: createCity,
        deleteCity: deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCityContext = () => {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error("Out of scope");
  return context;
};

export { CitiesContextProvider, useCityContext };
