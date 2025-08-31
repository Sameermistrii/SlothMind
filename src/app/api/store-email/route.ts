import { NextRequest, NextResponse } from 'next/server';
import { writeFile, appendFile, access } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get the project root directory
    const projectRoot = process.cwd();
    const filePath = join(projectRoot, 'Gmail.txt');

    try {
      // Check if file exists
      await access(filePath);
      
      // File exists, append the email
      await appendFile(filePath, `\n${email}`);
    } catch {
      // File doesn't exist, create it with the first email
      await writeFile(filePath, email);
    }

    return NextResponse.json(
      { message: 'Email stored successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error storing email:', error);
    return NextResponse.json(
      { error: 'Failed to store email' },
      { status: 500 }
    );
  }
}
