import regioni from '@/assets/regioni.json' 

const statusMap={
    "PENDING":"IN ATTESA DI APPROVAZIONE", //stato di richiesta che deve essere valutata
    "SUBMITTED":"SOTTOMESSA", // stato di richiesta valutata positivamente
    "ACCEPTED_INFN":"SOTTOMESSA", // finchè non si finalizza il docente vedrà sempre sottomessa per stato accepted
    "ACCEPTED_USAP":"SOTTOMESSA", // finchè non si finalizza il docente vedrà sempre sottomessa per stato accepted
    "REJECTED":"SOTTOMESSA", // finchè non si finalizza il docente vedrà sempre sottomessa per stato rejected
    "ACCEPTED_INFN_COMMIT":"ACCETTATA", // stato finalizzato,
    "ACCEPTED_USAP_COMMIT":"ACCETTATA",
    "REJECTED_COMMIT":"RIFIUTATA",  // stato finalizzato
}

const parseZone=(meccode)=>{
    
    if(!meccode) return ""

    try{
        let prov=meccode.substring(0,2)
        let reg=regioni.filter(r=>r.province.indexOf(prov)>-1)[0]
        let city=reg.capoluoghi[reg.province.indexOf(prov)]
        let fn=`${city} - ${reg.nome}`
        
        return fn
    }
    catch(exc)
    {
        console.log("error:",meccode)
    }

}

const formatDiscipline=(discipline)=>{
    return discipline?.length > 0  ? "<ul class='discipline'>"+discipline.map(d=>`<li>${d}</li>`).join("")+"</ul>" : 'Nessuna'
}


export default {
    statusMap,
    parseZone,
    formatDiscipline
}