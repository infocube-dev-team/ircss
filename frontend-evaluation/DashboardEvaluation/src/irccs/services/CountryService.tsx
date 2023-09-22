import { SelectItem } from "../../models/SelectItem";
import environmentManager from "../../services/EnvironmentManager";

export const fetchCountriesByKey = async (key: string) => {
  const provider = environmentManager.getDataProvider();
  let countriesArray: SelectItem[] = []

  await provider.getList(0, 0, {
      params: {
          'name': key
      }
  }, 'https://restcountries.com/v2/all')
      .then((response: any[]) => {
          if (response?.length > 0) {
              response.forEach((element: any) => {
                  countriesArray.push({label: element.name, value: element.name})
              });
          }
      });
  return countriesArray
}