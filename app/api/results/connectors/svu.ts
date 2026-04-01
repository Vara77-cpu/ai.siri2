import axios from "axios"
import * as cheerio from "cheerio"

export async function getSVUResult(hallTicket:string){

try{

const url = `https://svuniversity.edu.in/results?htno=${hallTicket}`

const res = await axios.get(url)

const $ = cheerio.load(res.data)

const name = $("#studentName").text()
const marks = $("#totalMarks").text()
const status = $("#resultStatus").text()

return {
name,
hallTicket,
marks,
status
}

}catch{
return null
}

}