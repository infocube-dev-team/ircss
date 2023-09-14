import CrudModule from "../../shared/module/CrudModule";
import {addFilter, applyFilters} from "../../services/HooksManager";
import { __i } from "../translations/i18n";

class IrccsCrudModule extends CrudModule {

    init() {
        super.init();
    }

    getMapData = async (data: any) => {
      const map: any[] = [];
      if (data?.entry?.length > 0) {
          data.entry.forEach((res: any, i: number) => {
  
              /**
              * Ritorna le colonne per il listing del modulo
              * @hook ${this.getModuleKey()}_table_data_row
              * @param obj Riga della tabella
              * @param res Response da mappare
              * @param i indice Riga tabella
              * @param columns Mapping delle colonne della tabella
              * @param module Modulo
              */
              const mappedObj = applyFilters(`${this.getModuleKey()}_table_data_row`, this.__getMapData(res.resource), res, i, this.getColumnsTable(), this);
              map.push(mappedObj);
          });
      }

      return map;
  }

    getModuleName = ():string => {
        return __i(this.getModuleKey() + ".module_name");
    }

}

export default IrccsCrudModule;
