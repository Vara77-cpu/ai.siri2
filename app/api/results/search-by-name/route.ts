import { NextResponse } from "next/server"

type Student = {
name: string
hallTicket: string
exam: string
marks: string
status: string
}

const students: Student[] = [
{
name:"Ravi Kumar",
hallTicket:"SSC123",
exam:"ssc",
marks:"580",
status:"PASS"
},
{
name:"Suresh Kumar",
hallTicket:"SSC124",
exam:"ssc",
marks:"560",
status:"PASS"
},
{
name:"Anitha Reddy",
hallTicket:"INTER221",
exam:"inter",
marks:"950",
status:"PASS"
}
]

export async function POST(req: Request){

try{

const body = await req.json()
const name = body?.name?.toLowerCase() || ""

if(!name){
return NextResponse.json({
success:false,
results:[]
})
}

const results = students.filter((s)=>
s.name.toLowerCase().includes(name)
)

return NextResponse.json({
success:true,
results
})

}catch{

return NextResponse.json({
success:false,
results:[]
})

}

}
