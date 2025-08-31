export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 });
    }
    
    console.log('Email received:', email);
    
    return Response.json({ 
      success: true, 
      message: 'Email stored successfully',
      email: email 
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ message: 'Email API is working' });
}
