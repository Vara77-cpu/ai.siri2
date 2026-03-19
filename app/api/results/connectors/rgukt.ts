import axios from "axios"
import * as cheerio from "cheerio"

export async function getRGUKTResult(hallTicket:string){

try{

const url = `https://results.andhrauniversity.edu.in/?htno=${hallTicket}`

const res = await axios.get(url)

const html = res.data
const $ = cheerio.load(html)

const name = $("#studentName").text()
const marks = $("#totalMarks").text()
const status = $("#resultStatus").text()

return{
name,
hallTicket,
marks,
status
}

}catch{
return null
}

}
