export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }
      
      console.log('Email received:', email);
      
      res.status(200).json({ 
        success: true, 
        message: 'Email stored successfully',
        email: email 
      });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'GET') {
    res.status(200).json({ message: 'Email API is working' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
