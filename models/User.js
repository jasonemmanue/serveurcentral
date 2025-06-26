const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nom_personnalise: { type: String, default: '' }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  nom_utilisateur: { type: String, required: true, unique: true, trim: true },
  mot_de_passe: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, trim: true },
  telephone: { type: String, unique: true, sparse: true, trim: true },
  statut: { type: String, default: 'hors-ligne' },
  derniere_deconnexion_timestamp: { type: Date },
  last_known_ip: { type: String },
  last_known_port: { type: Number },
  profile_picture: { type: Buffer },
  contacts: [ContactSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);