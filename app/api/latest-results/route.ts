import { NextResponse } from "next/server"

export async function GET(){

const results = [

{
title:"AP SSC Results Released",
date:"Today",
exam:"ssc"
},

{
title:"AP Intermediate Results",
date:"Today",
exam:"inter"
},

{
title:"JNTUK B.Tech Results",
date:"Yesterday",
exam:"jntuk"
},

{
title:"AP EAMCET Rank List",
date:"Yesterday",
exam:"eamcet"
},

{
title:"Andhra University Degree Results",
date:"2 days ago",
exam:"au"
}

]

return NextResponse.json(results)

}
