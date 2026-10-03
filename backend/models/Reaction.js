const mongoose = require('mongoose');
const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🤡', '😭', '💀', '✅', '❌', '💯'];
const schema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  emoji: { type: String, enum: EMOJIS, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientId: { type: String },
}, { timestamps: true });
schema.index({ post: 1, user: 1 }, { unique: true, partialFilterExpression: { user: { $type: 'objectId' } } });
schema.index({ post: 1, clientId: 1 }, { unique: true, partialFilterExpression: { clientId: { $type: 'string' } } });
schema.pre('validate', function () {
  if (Boolean(this.user) === Boolean(this.clientId)) this.invalidate('user', 'Provide either a user or a client ID');
});
module.exports = mongoose.model('Reaction', schema);