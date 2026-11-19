import { NextResponse } from 'next/server';
import { generateGenericExeBuffer } from '@/lib/standaloneExeBuilder';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const buffer = generateGenericExeBuffer();

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="Generic.exe"',
        'Content-Length': String(buffer.length),
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating Generic.exe:', error);
    return NextResponse.json(
      { error: 'Failed to generate Generic.exe' },
      { status: 500 }
    );
  }
}
