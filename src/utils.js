import regioni from '@/assets/regioni.json' 

const parseZone=(meccode)=>{
    
   
    let prov=meccode.substring(0,2)
    let reg=regioni.filter(r=>r.province.indexOf(prov)>-1)[0]
    let city=reg.capoluoghi[reg.province.indexOf(prov)]
    return `${city} - ${reg.nome}`

}

export default {
    parseZone
}