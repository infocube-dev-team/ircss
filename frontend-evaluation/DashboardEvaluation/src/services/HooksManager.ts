/**
 * Hooks Manager
 */
class HooksManager {

  /**
   * Dictionary di hooks
   * Ogni hooks è un dictionary per priority
   * Ogni priority è un array di callbacks
   */
  hooks: {
      [key: string]: {
          [key: string]: {
              [key: number]: {
                  callback: Function,
                  context: any
              }[]
          }
      }
  };

  constructor() {
      this.hooks = {
          filters: {},
          actions: {}
      };
  }

  log() {
      console.log('Lista Filters', this.hooks);
  }

  /**
   * Registra hook action
   * @param hookName
   * @param callback
   * @param priority
   * @param args
   */
  addAction(hookName: string, callback: Function, priority: number = 10, context: any = null) {
      this._addHook('actions', hookName, callback, priority, context);
  }

  /**
   * Registra hook filter
   * @param hookName
   * @param callback
   * @param priority
   * @param args
   */
  addFilter(hookName: string, callback: Function, priority: number = 10, context: any = null) {
      this._addHook('filters', hookName, callback, priority, context);
  }

  /**
   * Registra hook
   * @param hookName
   * @param callback
   * @param priority
   * @param args
   */
  _addHook(type: string, hookName: string, callback: Function, priority: number = 10, context: any = null) {
      if (this.hooks[type][hookName] === undefined) {
          this.hooks[type][hookName] = [];
      }

      if (this.hooks[type][hookName][priority] === undefined) {
          this.hooks[type][hookName][priority] = [];
      }

      this.hooks[type][hookName][priority].push({
          callback: callback,
          context: context
      });
      return true;
  }

  /**
   * Rimuove hook action
   * @param hookName
   * @param callback
   * @param priority
   * @param args
   */
  removeAction(hookName: string, callback: Function, priority: number = 10, context: any = null) {
      this._removeHook('actions', hookName, callback, priority, context);
  }

  /**
   * Rimuove hook filter
   * @param hookName
   * @param callback
   * @param priority
   * @param args
   */
  removeFilter(hookName: string, callback: Function, priority: number = 10, context: any = null) {
      this._removeHook('filters', hookName, callback, priority, context);
  }

  /**
   * Rimuove hook
   * @param hookName
   * @param callback
   * @param priority
   * @param args
   */
  _removeHook(type: string, hookName: string, callback: Function, priority: number = 10, context: any = null) {
      if (this.hooks[type][hookName] === undefined) {
          return true;
      }

      if (this.hooks[type][hookName][priority] === undefined) {
          return true;
      }

      // Ciclo in base a priority
      for (const priority in this.hooks[type][hookName]) {

          // Ciclo su callbacks
          const count = this.hooks[type][hookName][priority].length;

          for (let i = 0; i < count; i++) {
              const filter = this.hooks[type][hookName][priority][i];

              // Trovato
              if (filter.context === context && filter.callback === callback) {

                  // Elimino
                  console.log("FOUND!!!!");
                  let hooks = this.hooks[type][hookName][priority];
                  console.log("HOOKS", hooks);
                  hooks.splice(i, 1);
                  console.log("HOOKS", hooks);
                  this.hooks[type][hookName][priority] = hooks;
                  return true;
              }
          }
      }

      console.log("NOT FOUND!!!!");
      return true;
  }

  /**
   * Esegue hook. Non ritorna valori
   * @param hookName
   * @param value
   * @param args
   */
  applyActions(hookName: string, ...args: any[]) {
      this._applyHooks('actions', hookName, ...args);
  }

  /**
   * Esegue hook filter. Ritorna value eventualmente modificato
   * @param hookName
   * @param value
   * @param args
   */
  applyFilters(hookName: string, value: any, ...args: any[]) {
      let hookArgs = Array.prototype.slice.call(args);
      hookArgs.unshift(value);
      value = this._applyHooks('filters', hookName, ...hookArgs);
      return value;
  }

  /**
   * Esegue hook
   * @param hookName
   * @param args
   */
  _applyHooks(type: string, hookName: string, ...args: any[]) {
      const isFilter = type === 'filters';

      if (this.hooks[type][hookName] === undefined) {
          return (isFilter) ? args[0] : false;
      }

      // Ciclo in base a priority
      for (const priority in this.hooks[type][hookName]) {

          // Ciclo su callbacks
          const count = this.hooks[type][hookName][priority].length;

          for (let i = 0; i < count; i++) {
              const filter = this.hooks[type][hookName][priority][i];

              if (isFilter) {
                  args[0] = filter.callback.apply(filter.context, args);
              } else {
                  filter.callback.apply(filter.context, args);
              }
          }

      }

      return (isFilter) ? args[0] : true;
  }
}

const hooksManager = new HooksManager();
export default hooksManager;

export const addFilter = (hookName: string, callback: Function, priority: number = 10, context: any = null) => {
  hooksManager.addFilter(hookName, callback, priority, context);
}

export const addAction = (hookName: string, callback: Function, priority: number = 10, context: any = null) => {
  hooksManager.addAction(hookName, callback, priority, context);
}

export const removeFilter = (hookName: string, callback: Function, priority: number = 10, context: any = null) => {
  hooksManager.removeFilter(hookName, callback, priority, context);
}

export const removeAction = (hookName: string, callback: Function, priority: number = 10, context: any = null) => {
  hooksManager.removeAction(hookName, callback, priority, context);
}

export const applyFilters = (hookName: string, value: any, ...args: any[]) => {
  return hooksManager.applyFilters(hookName, value, ...args);
}

export const applyActions = (hookName: string, ...args: any[]) => {
  hooksManager.applyActions(hookName, ...args);
}
