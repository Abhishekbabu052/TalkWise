const mongoose = require('mongoose');
const Reaction = require('../models/Reaction');
const migrateLegacyReactions = async () => {
  await Reaction.init();
  const posts = mongoose.connection.collection('posts');
  const cursor = posts.find({ 'reactions.0': { $exists: true } });
  for await (const post of cursor) {
    const latestByClient = new Map();
    for (const reaction of post.reactions || []) {
      if (reaction.clientId && reaction.emoji) latestByClient.set(reaction.clientId, reaction.emoji);
    }
    for (const [clientId, emoji] of latestByClient) {
      await Reaction.updateOne(
        { post: post._id, clientId },
        { $setOnInsert: { post: post._id, clientId, emoji } },
        { upsert: true },
      );
    }
    await posts.updateOne({ _id: post._id }, { $unset: { reactions: '' } });
  }
};
module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await migrateLegacyReactions();
    console.log('MongoDB connected');
  } catch (e) { console.error('MongoDB error:', e.message); process.exit(1); }
};
