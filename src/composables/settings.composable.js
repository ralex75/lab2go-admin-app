import { ref,computed } from "vue"
import axios from "../services"
import { faL } from "@fortawesome/free-solid-svg-icons"

export default function useAppSettings(){

    const settings=ref({})
    const getAll=async ()=>{
        let response=await axios.get("/settings/")
        settings.value=response.data
    }

    const allowEditRequest=computed(()=>{
        if(!settings.value) return false
        return new Date()<new Date(settings.value.allow_request_school_untilAt)
    })

    return {
        settings,
        allowEditRequest,
        getAll
    }
}