/**
 * Class util per stringhe
 */
class StingUtils {

    /**
     * Elimina slash finale se presente da stringa in input
     * @param str
     */
    static removeRightSlash(str: string) {
        return str.replace(/\/+$/, '');
    }

    /**
     * Elimina slash iniziae se presente da stringa in input
     * @param str
     */
    static removeLeftSlash(str: string) {
        return str.replace(/^\/|\/$/g, '');
    }

    /**
     * Capitalize each word in a string
     * @param str 
     * @returns 
     */
    static capitalizeEachWord(str: string) {
        return str.toLowerCase().replace(/\b\w/g, function(char) {
            return char.toUpperCase();
        });
    }
    

}


export default StingUtils;