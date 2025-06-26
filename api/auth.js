const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Route: POST /api/auth/register
router.post('/register', async (req, res) => {
    const { nom_utilisateur, mot_de_passe, email, telephone } = req.body;

    if (!nom_utilisateur || !mot_de_passe) {
        return res.status(400).json({ message: "Le nom d'utilisateur et le mot de passe sont requis." });
    }

    try {
        let user = await User.findOne({ nom_utilisateur });
        if (user) {
            return res.status(400).json({ message: "Ce nom d'utilisateur existe déjà." });
        }

        const salt = await bcrypt.genSalt(10);
        const mot_de_passe_hache = await bcrypt.hash(mot_de_passe, salt);

        user = new User({
            nom_utilisateur,
            mot_de_passe: mot_de_passe_hache,
            email,
            telephone
        });

        await user.save();
        res.status(201).json({ message: "Utilisateur enregistré avec succès." });

    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// Route: POST /api/auth/login
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ nom_utilisateur: identifier }, { email: identifier }, { telephone: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: "Identifiant ou mot de passe incorrect." });
        }

        const isMatch = await bcrypt.compare(password, user.mot_de_passe);
        if (!isMatch) {
            return res.status(400).json({ message: "Identifiant ou mot de passe incorrect." });
        }
        
        // Mettre à jour le statut en 'actif'
        user.statut = 'actif';
        await user.save();

        const payload = { userId: user.id, nom_utilisateur: user.nom_utilisateur };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user.id, nom_utilisateur: user.nom_utilisateur }
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

module.exports = router;