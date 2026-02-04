# 🚀 Mood Signal - Guide Complet de Déploiement

## ✅ Étape 1: Configuration Supabase (5 minutes)

### 1.1 Créer un projet Supabase
1. Allez à [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Créez un compte (email/GitHub)
4. Créez un nouveau projet:
   - **Name:** `mood-signal`
   - **Database Password:** Créez un mot de passe fort
   - **Region:** Choisissez la région la plus proche

### 1.2 Récupérer les clés API
Une fois le projet créé:
1. Allez dans **Settings** → **API**
2. Copiez ces 3 clés:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://[votre-project-id].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [anon key visible publiquement]
   SUPABASE_SERVICE_ROLE_KEY = [service_role key - gardez secret]
   ```

### 1.3 Activer l'authentification
1. Allez à **Authentication** → **Providers**
2. Activez **Email** (déjà activé par défaut)
3. Allez à **Settings** → **SMTP** et configurez si nécessaire

---

## ✅ Étape 2: Configuration Vercel (5 minutes)

### 2.1 Créer un dépôt GitHub
1. Créez un compte GitHub (si pas déjà)
2. Créez un nouveau dépôt: `mood-signal`
3. Clonez le dépôt localement
4. Copiez tous les fichiers du projet dedans
5. Committez et poussez:
```bash
git add .
git commit -m "Initial Mood Signal setup"
git push origin main
```

### 2.2 Connecter Vercel
1. Allez à [vercel.com](https://vercel.com)
2. Cliquez "New Project"
3. Importez le dépôt GitHub `mood-signal`
4. Cliquez "Deploy"

### 2.3 Ajouter les variables d'environnement
1. Dans Vercel, allez à **Settings** → **Environment Variables**
2. Ajoutez ces 3 variables:

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[your-project-id].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | [Votre clé anon] |
| `SUPABASE_SERVICE_ROLE_KEY` | [Votre clé service role] |

3. Cliquez "Save"
4. Allez à **Deployments** et cliquez "Redeploy" sur le dernier déploiement

---

## ✅ Étape 3: Initialiser la Base de Données (2 minutes)

Une fois déployé:

### 3.1 Accéder à la page de setup
1. Allez à: `https://[votre-url-vercel].vercel.app/setup`
2. Cliquez sur "Initialize Database"
3. Attendez le message de succès ✓

### 3.2 Vérifier la base de données
1. Allez à Supabase Dashboard
2. Cliquez sur **Table Editor**
3. Vérifiez que ces tables existent:
   - `user_profiles`
   - `couples`
   - `mood_events`
   - `suggested_replies`
   - `mood_statistics`

---

## ✅ Étape 4: Tester l'Application (5 minutes)

### 4.1 Tester le Signup
1. Allez à `https://[votre-url-vercel].vercel.app`
2. Cliquez "Create Account"
3. Créez un compte avec:
   - Email: votre email
   - Username: un nom d'utilisateur
   - Display Name: votre nom
   - Password: un mot de passe sûr
4. Cliquez "Create Account"

### 4.2 Tester les moods
1. Allez au dashboard
2. Cliquez "Send my mood"
3. Sélectionnez un emoji mood
4. Réglez l'intensité
5. Cliquez "Send my mood"
6. Vérifiez le message de succès ✓

### 4.3 Tester sur mobile
1. Ouvrez l'URL sur votre téléphone
2. Cliquez sur l'adresse → "Ajouter à l'écran d'accueil"
3. L'app s'installe comme une PWA native

---

## ✅ Étape 5: Partager avec votre Partenaire (Immédiat)

### 5.1 Créer un couple
1. Partenaire crée un compte avec **email différent**
2. Une fois dans l'app, cherchez "Add Partner" (à implémenter si nécessaire)
3. Entrez l'email de votre partenaire

### 5.2 Partager l'URL
Donnez à votre partenaire:
```
https://[votre-url-vercel].vercel.app
```

---

## 🧪 Vérification Complète

### Frontend ✓
- [ ] Login/Signup fonctionne
- [ ] Dashboard affiche les moods
- [ ] Peut envoyer des moods
- [ ] Peut voir l'historique
- [ ] Responsive sur mobile

### Backend ✓
- [ ] API signup retourne JWT
- [ ] API submit mood enregistre en BD
- [ ] API history récupère les moods
- [ ] JWT validation fonctionne

### Base de Données ✓
- [ ] 5 tables existent
- [ ] RLS policies actives
- [ ] Indexes créés
- [ ] Données se synchronisent

### Déploiement ✓
- [ ] Vercel montre "Production" ✓
- [ ] Variables d'environnement visibles
- [ ] HTTPS fonctionne
- [ ] Pas d'erreurs 500

---

## 🎯 Vous Avez Terminé!

**L'application est maintenant:**
- ✅ En production
- ✅ Accessible publiquement
- ✅ Sécurisée (JWT, RLS, HTTPS)
- ✅ Optimisée pour mobile
- ✅ Prête pour 2 personnes

### Prochaines étapes optionnelles:
1. Domaine personnalisé (Vercel Settings)
2. Analytics (Vercel Analytics)
3. Monitoring d'erreurs (Sentry)
4. Notifications en temps réel (Supabase Realtime)

---

## 📱 Utilisation sur Mobile

### iOS (Safari)
1. Ouvrez l'URL
2. Cliquez partage → "Sur l'écran d'accueil"
3. Nommez "Mood Signal"
4. App installée! Fonctionne offline

### Android (Chrome)
1. Ouvrez l'URL
2. Menu (3 points) → "Installer l'app"
3. Nommez "Mood Signal"
4. App installée! Fonctionne offline

---

## ❓ Troubleshooting

### Erreur: "Invalid API Key"
→ Vérifiez que vous avez copié les bonnes clés depuis Supabase

### Erreur: "Database not initialized"
→ Cliquez sur `/setup` pour initialiser

### Signup ne fonctionne pas
→ Vérifiez que Email est activé dans Supabase Auth

### L'app plante sur mobile
→ Testez dans Chrome DevTools (F12) mode mobile
→ Vérifiez la console pour les erreurs

---

## 🎉 C'est Tout!

Votre application Mood Signal est maintenant:
- **Live** sur le web
- **Installable** sur mobile
- **Sécurisée** avec Supabase
- **Prête** pour vous et votre partenaire

**Bon partage des moods! 💕**
