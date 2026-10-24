import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gopratle';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Runtime error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected. Reconnecting...');
  });
}
