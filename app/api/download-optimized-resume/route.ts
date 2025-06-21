import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun } from "docx";

export async function POST(req: NextRequest) {
    try {
        const { optimizedResume } = await req.json();
        if (!optimizedResume) {
            return NextResponse.json({ error: "No resume content provided" }, { status: 400 });
        }

        const doc: Document = new Document({
            sections: [
                {
                    properties: {},
                    children: (optimizedResume as string).split("\n").map((line: string): Paragraph =>
                        new Paragraph({
                            children: [new TextRun(line)],
                        })
                    ),
                },
            ],
        });

        const buffer = await Packer.toBuffer(doc);

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": "attachment; filename=Optimized_Resume.docx",
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate DOCX" }, { status: 500 });
    }
}