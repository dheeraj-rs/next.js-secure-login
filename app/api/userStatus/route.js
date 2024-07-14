import clientPromise from '@/lib/mongodb';

export async function GET(req) {
  console.log('Request received:', req.url);

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const email = searchParams.get('email');

  console.log('Extracted email:', email);

  if (!email) {
    console.error('Missing email parameter');
    return new Response(
      JSON.stringify({ message: 'Missing email parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      console.error('User not found:', email);
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('User status:', user.status);

    return new Response(JSON.stringify({ status: user.status }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching user status:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
