import regioni from '@/assets/regioni.json' 

const statusMap={
    "PENDING":"IN ATTESA DI APPROVAZIONE",
    "SUBMITTED":"SOTTOMESSA",
    "ACCEPTED":"SOTTOMESSA",
    "REJECTED":"SOTTOMESSA",
    "ACCEPTED_COMMIT":"ACCETTATA",
    "REJECTED_COMMIT":"RIFIUTATA"
}

const parseZone=(meccode)=>{
    
    if(!meccode) return ""

    
   
    let prov=meccode.substring(0,2)
    let reg=regioni.filter(r=>r.province.indexOf(prov)>-1)[0]
    let city=reg.capoluoghi[reg.province.indexOf(prov)]
    let fn=`${city} - ${reg.nome}`
    console.log(fn)
    return fn

}

const formatDiscipline=(discipline)=>{
    return discipline?.length > 0  ? "<ul class='discipline'>"+discipline.map(d=>`<li>${d}</li>`).join("")+"</ul>" : 'Nessuna'
}


export default {
    statusMap,
    parseZone,
    formatDiscipline
}