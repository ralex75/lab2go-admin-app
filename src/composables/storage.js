
export default {
    get:(key)=>{
        let d=localStorage.getItem(key)
        return d ? JSON.parse(d) : null
    },
    set:(key,value)=>{
        localStorage.setItem(key,JSON.stringify(value))
    },
    unset:(key)=>{
        localStorage.removeItem(key)
    }
}