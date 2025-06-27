const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const authMiddleware = require('./middleware/auth'); // Middleware pour vérifier le token

const router = express.Router();

// Route: GET /api/contacts
// Récupère la liste de contacts pour l'utilisateur authentifié
router.get('/', authMiddleware, async (req, res) => {
    try {
        // req.userId est ajouté par le middleware d'authentification
        const user = await User.findById(req.userId).populate({
            path: 'contacts.userId',
            select: 'nom_utilisateur statut email telephone' // Champs à récupérer pour chaque contact
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const contacts = user.contacts.map(contact => ({
            _id: contact.userId._id,
            nom_utilisateur: contact.userId.nom_utilisateur,
            statut: contact.userId.statut,
            email: contact.userId.email,
            telephone: contact.userId.telephone,
            nom_personnalise: contact.nom_personnalise
        }));

        res.json(contacts);

    } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

module.exports = router;
