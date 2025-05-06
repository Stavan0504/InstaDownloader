import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";

const execAsync = promisify(exec);

interface RequestBody {
    url: string;
}

interface ExecResult {
    stdout: string;
    stderr: string;
}

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const body: RequestBody = await req.json();
        const { url } = body;
        console.log("URL:", url);
        
        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }
        
        const ytDlpPath = `"C:\\Users\\Stavan\\AppData\\Local\\Packages\\PythonSoftwareFoundation.Python.3.11_qbz5n2kfra8p0\\LocalCache\\local-packages\\Python311\\Scripts\\yt-dlp.exe"`;
        
        
        const { stdout, stderr }: ExecResult = await execAsync(`${ytDlpPath} -g "${url}"`);
        
        if (stderr  && !stderr.includes("WARNING:")) {
            console.error(`Error: ${stderr}`);
            return NextResponse.json({ error: 'Failed to get video URL' }, { status: 500 });
        }

        const videoUrl = stdout.trim();
        console.log(`Video URL: ${videoUrl}`);
        
        return NextResponse.json({ videoUrl: videoUrl }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing the request' }, { status: 500 });
    }
}