const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    tags: [{ type: String }],
    json_file_url: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

sessionSchema.index({ status: 1, created_at: -1 });

module.exports = mongoose.model('Session', sessionSchema);
