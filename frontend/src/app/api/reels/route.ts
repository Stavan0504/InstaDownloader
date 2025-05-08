import { NextResponse } from "next/server";
import YTDlpWrap from 'yt-dlp-wrap';

const ytDlpWrap = new YTDlpWrap();

interface RequestBody {
    url: string;
}

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const body: RequestBody = await req.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        console.log("Running yt-dlp for:", url);

        // Use yt-dlp to get the direct video URL
        const output = await ytDlpWrap.execPromise(["-g", url]);

        const videoUrl = output.trim();
        console.log("Extracted video URL:", videoUrl);

        return NextResponse.json({ videoUrl }, { status: 200 });

    } catch (error) {
        console.error("yt-dlp error:", error);
        return NextResponse.json({ error: "Failed to fetch video URL" }, { status: 500 });
    }
}
