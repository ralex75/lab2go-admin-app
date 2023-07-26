
import { ref } from "vue"
export default function useHeaderImages(imageList=[]){
    const images=ref([])

    const loadImages=()=>{
        for(let img of imageList){
            images.value.push(new URL(`../assets/images/${img}`, import.meta.url).href)
        }
       
    }

    return {
        images,
        loadImages
    }

   

}