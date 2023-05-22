const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
