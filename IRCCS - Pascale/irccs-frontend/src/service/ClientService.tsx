import { useCallback, useState } from "react";
import { Country } from '../interfaces/Country';

//todo:: Centralize this and remove from OrganizationsEdit and New Center
function CountryService() {
    const [countries, setCountries] = useState<Country[]>([]);

    return  useCallback(async () => {
        try {
            const response = await fetch('https://restcountries.com/v2/all');
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

}

export default CountryService;

