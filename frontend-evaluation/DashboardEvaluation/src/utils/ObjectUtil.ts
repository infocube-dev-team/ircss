import {split} from "lodash";

class ObjectUtils {
    static filterIfValueIsEmpty = (obj: any) => {
        if (obj) {
            return Object.fromEntries(Object.entries(obj).filter(([_, v]) => (v != null && v)));
        }

        return {}
    }

    static isObject = (obj: any) => {
        return (
            typeof obj === 'object' &&
            !Array.isArray(obj) &&
            obj !== null
        )
    }

    static assignDeep = (target: any, ...sources: any): any => {
        if (!sources.length) return target;
        const source = sources.shift();

        if (ObjectUtils.isObject(target) && ObjectUtils.isObject(source)) {
            for (const key in source) {
                if (ObjectUtils.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, {[key]: {}});
                    ObjectUtils.assignDeep(target[key], source[key]);
                } else {
                    Object.assign(target, {[key]: source[key]});
                }
            }
        }

        return ObjectUtils.assignDeep(target, ...sources);
    }

    static stringIncludes = ( array: any, key: string ) => {
        let filtered = array.filter ( ( res: any ) => res.toUpperCase().includes ( key.toUpperCase() ) );

        return filtered.map ( ( res: any ) => ( {
            label: res,
            value: res
        } ) )
    }

    static stringIncludesWithOutLabel = ( array: any, key: string ) => {
        let filtered = array.filter ( ( res: any ) => res.toUpperCase().includes ( key.toUpperCase() ) );

        return filtered.map ( ( res: any ) => ( {
            label: res,
            value: split(res,'-')[0]
        } ) )
    }

    static stringIncludesDescription = ( array: any, key: string ) => {
        let filtered = array.filter ( ( res: any ) => res.description.toUpperCase().includes ( key.toUpperCase() ) );

        return filtered.map ( ( res: any ) => ( {
            label: res.description,
            value: res.id
        } ) )
    }
}

export default ObjectUtils;
