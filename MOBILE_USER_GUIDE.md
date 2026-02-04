# 📱 Guide Utilisateur Mobile - Mood Signal

## Installation sur Mobile

### iPhone (iOS)

#### Option 1: App Web Progressive (Recommandé)
1. Ouvrez Safari
2. Allez à `https://mood-signal-[random].vercel.app`
3. Cliquez le bouton **Partage** (carré avec flèche)
4. Cliquez **"Sur l'écran d'accueil"**
5. Nommez: `Mood Signal`
6. Cliquez **"Ajouter"**
7. L'app s'installe! 🎉

#### Option 2: Chrome
1. Ouvrez Chrome
2. Allez à `https://mood-signal-[random].vercel.app`
3. Cliquez le menu ⋮ (3 points)
4. Cliquez **"Installer l'app"**
5. L'app s'installe! 🎉

---

### Android (Chrome)

1. Ouvrez Chrome
2. Allez à `https://mood-signal-[random].vercel.app`
3. Attendez le popup "Installer l'app" (barre en bas)
4. Cliquez **"Installer"**
5. Confirmez
6. L'app s'installe! 🎉

**Alternative manuelle:**
1. Cliquez le menu ⋮ (3 points)
2. Cliquez **"Installer l'app"**
3. Confirmez

---

## Première Utilisation

### 1️⃣ Créer un Compte

1. Ouvrez l'app
2. Cliquez **"Create Account"**
3. Remplissez:
   - **Email:** Votre email réel
   - **Username:** Un surnom unique (ex: `alex_pink`)
   - **Display Name:** Votre vrai nom (ex: `Alex`)
   - **Password:** Mot de passe sûr (8+ caractères)
4. Cliquez **"Create Account"**
5. ✓ Connecté!

### 2️⃣ Envoyer votre Première Humeur

1. Vous êtes au **Dashboard**
2. Cliquez le gros bouton **"Send my mood"**
3. Sélectionnez un emoji:
   - 😄 Happy
   - 😊 Good
   - 😐 Neutral
   - 😔 Sad
   - 😡 Angry
   - 😰 Stressed
   - 🥱 Tired
   - ❤️ Love
4. Réglez l'**intensité** (1-5):
   - 1 = Léger
   - 5 = Très intense
5. **(Optionnel)** Ajoutez une **note personnelle**
6. **(Optionnel)** Cochez si:
   - ✓ "I need a call"
   - ✓ "I need space"
7. Cliquez **"Send my mood"**
8. ✓ Envoyé!

---

## Utilisation Quotidienne

### 📊 Dashboard
**Montre l'humeur actuelle de votre partenaire:**
- Grand emoji de son mood
- Intensité (1-5)
- Ses notes (si écrites)
- Ses besoins (appel/espace)
- Réponses empathiques suggérées

**Actions:**
- 💬 Copier une réponse suggérée
- 📞 Appeler (si "needs call")
- 🤝 Donner de l'espace (si "needs space")

### 📱 Send Mood
**Partager votre humeur actuelle:**
- Sélectionnez l'emoji
- Réglez l'intensité
- Ajoutez une note (optionnel)
- Cliquez Send!

### 📈 History
**Voir les 30 derniers moods:**
- Chronologique (aujourd'hui → plus ancien)
- Intensité visualisée en barres
- Temps exact affiché

---

## Partager avec votre Partenaire

### Étape 1: Vous créez un compte
- Email: `you@email.com`
- Username: `alex_pink`

### Étape 2: Votre partenaire crée un compte
- Email: `partner@email.com`
- Username: `jordan_blue`

### Étape 3: Se connecter ensemble
**Option A: Via le Dashboard (À implémenter)**
- Cliquez "Add Partner"
- Entrez l'email de votre partenaire
- Attendez confirmation

**Option B: Lien d'invitation (À implémenter)**
- Cliquez "Invite Partner"
- Partagez le lien
- Partenaire accepte

*Pour l'instant, ces features doivent être implémentées. Attendez la prochaine version!*

---

## Fonctionnalités

### 😊 8 Émojis de Mood
```
😊 Happy     😔 Sad       😡 Angry     ❤️ Love
😐 Neutral   😰 Stressed  🥱 Tired     😴 Sleeping
```

### 📊 Intensité 1-5
- **1** = Très léger
- **2** = Léger
- **3** = Moyen
- **4** = Forte
- **5** = Très forte

### 💭 Notes Personnelles
Écrivez ce que vous ressentez:
- "Had an amazing day at work!"
- "Feeling overwhelmed with the project"
- "Missing you so much"

### 🚩 Flags Spéciaux
- **"I need a call"** = Appelle-moi! ☎️
- **"I need space"** = Laisse-moi un peu seul 🌙

### 💌 Réponses Empathiques
Suggestions de réponses pour chaque mood:
- Adaptées à l'émotion
- Empathiques et bienveillantes
- Faciles à copier et partager

---

## Conseils d'Utilisation

### ✅ Bonnes Pratiques
1. **Partagez régulièrement** - 1-3 fois par jour c'est parfait
2. **Soyez honnête** - Pas besoin de prétendre
3. **Utilisez les notes** - Donnez du contexte
4. **Répondez avec empathie** - Les réponses suggérées aident
5. **Respectez les flags** - Si besoin d'espace, respectez

### ❌ À Éviter
1. **Ne jugez pas** - Toutes les émotions sont valides
2. **Ne forcez pas** - Si partenaire a besoin d'espace, respectez
3. **Ne spammez pas** - L'app est pour se partager, pas jouer
4. **Ne supprimez l'app** - Vos données s'effaceront!

---

## Fonctionne Offline?

✅ **Partiellement:**
- L'interface charge offline
- Les données passées s'affichent
- **MAIS:** Vous ne pouvez pas envoyer de nouvelles humeurs offline
- Une fois en ligne, les moods s'envoient automatiquement

---

## Données & Confidentialité

### Vos données:
- ✓ Stockées sécurisément chez Supabase
- ✓ Chiffrées en transit (HTTPS)
- ✓ **Jamais vendues** ou partagées
- ✓ **Seul votre partenaire** peut les voir

### Suppression:
- Les moods peuvent être supprimés du compte Supabase
- Pour supprimer un compte: Settings → Delete Account
- Toutes vos données s'effaceront

---

## Troubleshooting

### L'app ne charge pas
→ Vérifiez votre connexion internet
→ Fermez et rouvrez l'app
→ Videz le cache (Settings du téléphone)

### Signup ne fonctionne pas
→ Vérifiez que l'email est valide
→ Le mot de passe doit faire 8+ caractères
→ Réessayez dans 30 secondes

### Mood ne s'envoie pas
→ Vérifiez la connexion internet
→ L'app devrait réessayer automatiquement
→ Si ça persiste, rechargez l'app

### Je ne vois pas le mood de mon partenaire
→ Partenaire doit avoir envoyé un mood
→ Rafraîchissez (appuyez vers le bas)
→ Attendez quelques secondes

### L'app est lente
→ C'est normal la première charge
→ Les chargements suivants sont plus rapides
→ Vérifiez votre connexion

---

## Raccourcis Clavier (Navigateur)

Si vous utilisez sur ordinateur:

| Raccourci | Action |
|-----------|--------|
| `Tab` | Naviguer entre les champs |
| `Enter` | Soumettre les moods |
| `Escape` | Fermer les modales |

---

## Notifications (À venir)

Bientôt: Vous recevrez une notification quand votre partenaire:
- Envoie une nouvelle humeur
- Demande un appel
- Envoie un message

Pour l'instant, actualisez manuellement! 📱

---

## Partager des Captures d'Écran

Pour montrer votre mood à votre partenaire:
1. Ouvrez votre mood dans l'app
2. Appuyez sur **Partage** (iOS) ou **Menu** (Android)
3. Envoyez par WhatsApp/Telegram/Email/etc

---

## Support & Aide

Si l'app ne fonctionne pas:
1. Vérifie ta connexion internet
2. Essaie de fermer/rouvrir l'app
3. Vide le cache de l'app (Settings du téléphone)
4. Essaie sur un autre navigateur/appareil

Si le problème persiste:
- Visitez l'URL directement: `https://mood-signal-[random].vercel.app`
- Ouvrez les Developer Tools (F12) pour les erreurs

---

## À Propos

**Mood Signal** est une app créée pour les couples en longue distance.

C'est un moyen simple et intime de partager comment vous vous sentez,
même quand vous n'êtes pas ensemble.

**Version:** 1.0
**Créé avec:** Next.js, React, Supabase, Tailwind CSS
**Optimisé pour:** Tous les appareils mobiles

---

## 🎉 Profitez!

Allez-y, installez l'app et commencez à partager vos moods avec votre partenaire!

**💕 Connectez-vous à travers la distance!**
