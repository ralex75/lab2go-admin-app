import axios from "../services"
import { reactive,ref,computed } from 'vue'




export default function useUtils(){
    
    const error=ref(null)

    const dumpStudents=(schoolId,disc='ALL')=>{
        return downloadFile(`/dump/students?scid=${schoolId}&disc=${disc}`)
    }
    const dumpDB=()=>{
        return downloadFile("/dump/db")
    }

    const downloadFile=async (url)=>{
        
        error.value=""
        let filename=null

        axios.get(url, {
            responseType: 'blob',
            withCredentials:true
        })
        .then(response => {
        
            const disposition = response.headers['content-disposition'];
            filename = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
            if (filename.toLowerCase().startsWith("utf-8''"))
                filename = decodeURIComponent(filename.replace("utf-8''", ''));
            else
                filename = filename.replace(/['"]/g, '');
            return response.data;

        })
        .then(blob => {
        
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

        })
        .catch(err => {
            error.value=err
            console.log(err)
        });

    }

    
    
    return {
        error,
        dumpDB,
        dumpStudents
        
    }
}
