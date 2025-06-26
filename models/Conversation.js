const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  nom_fichier: String,
  type_fichier: String,
  taille_fichier: Number,
}, { _id: false });

const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contenu: { type: String, required: true },
  statut_lecture: { type: Number, default: 0 }, // 0: Envoyé, 1: Reçu, 2: Lu
  piece_jointe: AttachmentSchema
}, { timestamps: { createdAt: 'date_envoi' } });

const ConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [MessageSchema]
});

module.exports = mongoose.model('Conversation', ConversationSchema);