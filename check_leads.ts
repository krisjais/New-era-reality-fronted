import { connectMongo } from './src/lib/mongoose';

async function checkLeads() {
  const mongoose = await connectMongo();
  const dbNative = mongoose.connection.db;
  const leads = await dbNative.collection('Lead').find().toArray();
  console.log("Leads in DB:", JSON.stringify(leads, null, 2));
  process.exit(0);
}

checkLeads();
