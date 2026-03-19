import { NextResponse } from "next/server"
import axios from "axios"
import * as cheerio from "cheerio"

export async function GET(){

try{

const url = "https://www.manabadi.co.in/"

const res = await axios.get(url)

const html = res.data

const $ = cheerio.load(html)

const results:any = []

$("a").each((i,el)=>{

const text = $(el).text()

if(
text.toLowerCase().includes("result") ||
text.toLowerCase().includes("rank")
){

results.push({
title:text.trim(),
date:"Just Now"
})

}

})

return NextResponse.json(results.slice(0,10))

}catch{

return NextResponse.json([])

}

}
