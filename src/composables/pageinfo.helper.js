import { reactive } from 'vue'

let info=reactive({"title":"","description":"","subtitle":""})

export default function pageInfoHelper(){
   
    const setInfo=({title,subtitle,description}={"title":"","subtitle":"","description":""})=>
    {
        
        info.title=title
        info.subtitle=subtitle
        info.description=description

        console.log(info)
    }

    return {
       setInfo,
       info
    }
}
