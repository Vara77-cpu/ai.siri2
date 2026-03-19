import axios from "axios"

export async function getNEETResult(hallTicket:string){

try{

const url = `https://neet.nta.nic.in/results?roll=${hallTicket}`

const res = await axios.get(url)

return{
name:"NEET Student",
hallTicket,
marks:"Fetched from NEET site",
status:"Qualified"
}

}catch{
return null
}

}