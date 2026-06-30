import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sharp = require('sharp');
    return NextResponse.json({ 
      success: true, 
      versions: sharp.versions,
      env: {
        platform: process.platform,
        arch: process.arch,
        node: process.version
      }
    });
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: err.message, 
      stack: err.stack,
      env: {
        platform: process.platform,
        arch: process.arch,
        node: process.version
      }
    }, { status: 500 });
  }
}
