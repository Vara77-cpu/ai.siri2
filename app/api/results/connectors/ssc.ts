import axios from "axios"
import * as cheerio from "cheerio"

export async function getSSCResult(hallTicket: string){

try{

const url = `https://bse.ap.gov.in/Results.aspx?htno=${hallTicket}`

const res = await axios.get(url)

const $ = cheerio.load(res.data)

/* selectors depend on official site structure */

const name = $("#studentName").text().trim()
const marks = $("#totalMarks").text().trim()
const status = $("#resultStatus").text().trim()

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
