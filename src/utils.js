import regioni from '@/assets/regioni.json' 

const statusMap={
    "PENDING":"IN ATTESA DI APPROVAZIONE",
    "SUBMITTED":"SOTTOMESSA",
    "ACCEPTED_COMMIT":"ACCETTATA",
    "REJECTED_COMMIT":"RIFIUTATA"
}

const parseZone=(meccode)=>{
    
   
    let prov=meccode.substring(0,2)
    let reg=regioni.filter(r=>r.province.indexOf(prov)>-1)[0]
    let city=reg.capoluoghi[reg.province.indexOf(prov)]
    return `${city} - ${reg.nome}`

}



export default {
    parseZone,
    statusMap
}