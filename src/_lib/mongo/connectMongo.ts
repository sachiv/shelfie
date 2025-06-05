import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var mongoose: { conn: any; promise: any } | undefined;
}

const DATABASE_URL = process.env.MONGO_URL;

async function connectDB() {
  let cached = global.mongoose;
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    if (!DATABASE_URL) {
      throw new Error(
        "Please define the MONGO_URL environment variable inside .env.local"
      );
    }

    cached.promise = mongoose.connect(DATABASE_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
