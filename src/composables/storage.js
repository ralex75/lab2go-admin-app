
export default {
    get:(key)=>{
        let d=localStorage.getItem(key)
        if(d) return JSON.parse(d)
        return null
    },
    set:(key,value)=>{
        localStorage.setItem(key,JSON.stringify(value))
    },
    unset:(key)=>{
        localStorage.removeItem(key)
    }
}