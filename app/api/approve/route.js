import clientPromise from '@/lib/mongodb';

export async function GET(req) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const email = searchParams.get('email');
  const action = searchParams.get('action');

  if (!email || !action) {
    return new Response(JSON.stringify({ message: 'Missing parameters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    switch (action) {
      case 'approve':
        await db
          .collection('users')
          .updateOne({ email }, { $set: { status: 'approved' } });
        return new Response(JSON.stringify({ message: 'User approved' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      case 'reject':
        await db
          .collection('users')
          .updateOne({ email }, { $set: { status: 'rejected' } });
        return new Response(JSON.stringify({ message: 'User rejected' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      default:
        return new Response(JSON.stringify({ message: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error approving/rejecting user:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
