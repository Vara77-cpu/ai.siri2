import { NextResponse } from "next/server"

import { getSSCResult } from "./connectors/ssc"
import { getInterResult } from "./connectors/inter"

import { getJNTUKResult } from "./connectors/jntuk"
import { getJNTUAResult } from "./connectors/jntua"
import { getANUResult } from "./connectors/anu"

import { getAUResult } from "./connectors/au"
import { getSVUResult } from "./connectors/svu"
import { getSKUResult } from "./connectors/sku"

import { getRGUKTResult } from "./connectors/rgukt"

import { getPGECETResult } from "./connectors/pgecet"
import { getECETResult } from "./connectors/ecet"
import { getEAMCETResult } from "./connectors/eamcet"

import { getNEETResult } from "./connectors/neet"
import { getJEEResult } from "./connectors/jee"

export async function POST(req: Request){

const { exam, hallTicket } = await req.json()

let result = null

switch(exam){

case "ssc":
result = await getSSCResult(hallTicket)
break

case "inter":
result = await getInterResult(hallTicket)
break

case "jntuk":
result = await getJNTUKResult(hallTicket)
break

case "jntua":
result = await getJNTUAResult(hallTicket)
break

case "anu":
result = await getANUResult(hallTicket)
break

case "au":
result = await getAUResult(hallTicket)
break

case "svu":
result = await getSVUResult(hallTicket)
break

case "sku":
result = await getSKUResult(hallTicket)
break

case "rgukt":
result = await getRGUKTResult(hallTicket)
break

case "pgecet":
result = await getPGECETResult(hallTicket)
break

case "ecet":
result = await getECETResult(hallTicket)
break

case "eamcet":
result = await getEAMCETResult(hallTicket)
break

case "neet":
result = await getNEETResult(hallTicket)
break

case "jee":
result = await getJEEResult(hallTicket)
break

default:
return NextResponse.json({ success:false })

}

if(!result){
return NextResponse.json({ success:false })
}

return NextResponse.json({
success:true,
result
})

}
