

export const setObject:(key: string, value: object)=>void = function(key, value){
    localStorage.setItem(key, JSON.stringify(value))
}
export function getObject<T extends {} = {}>(key:string):T | {}{
    const val = localStorage.getItem(key) || "{}"
    try { 
        return JSON.parse(val)
    } catch (objError) {
        if (objError instanceof SyntaxError) {
            console.error(objError.name);
            return {}
        } 

        console.error(objError.message);
        throw objError
        
    }
}
