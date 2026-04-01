import PDFDocument from "pdfkit"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

try {

const { name, hallTicket, marks, status } = await req.json()

const doc = new PDFDocument()

const chunks: Buffer[] = []

doc.on("data", (chunk: Buffer) => {
chunks.push(chunk)
})

doc.text("Student Marks Memo")
doc.moveDown()

doc.text(`Name: ${name}`)
doc.text(`Hall Ticket: ${hallTicket}`)
doc.text(`Marks: ${marks}`)
doc.text(`Status: ${status}`)

doc.end()

const pdfBuffer: Buffer = await new Promise((resolve) => {
doc.on("end", () => {
resolve(Buffer.concat(chunks))
})
})

/* convert buffer to Uint8Array for NextResponse */

const pdfData = new Uint8Array(pdfBuffer)

return new NextResponse(pdfData, {
headers: {
"Content-Type": "application/pdf",
"Content-Disposition": "attachment; filename=marks-memo.pdf"
}
})

} catch (error) {

return NextResponse.json({
error: "Failed to generate PDF"
})

}

}
