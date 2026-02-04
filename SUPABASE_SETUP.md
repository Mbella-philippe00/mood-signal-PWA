# 🔧 Guide Détaillé: Configuration Supabase pour Mood Signal

## Étape 1: Créer un Compte Supabase

1. Allez à **https://supabase.com**
2. Cliquez sur **"Start your project"** (coin haut droit)
3. Connectez-vous avec:
   - GitHub (recommandé)
   - Email + Mot de passe
4. Confirmez votre email

---

## Étape 2: Créer un Nouveau Projet

1. Une fois connecté, cliquez **"New Project"**
2. Remplissez les informations:

| Champ | Valeur |
|-------|--------|
| **Name** | `mood-signal` |
| **Database Password** | Créez un mot de passe fort (20+ caractères) |
| **Region** | Choisissez la région la plus proche |
| **Pricing Plan** | `Free` (suffisant pour débuter) |

3. Cliquez **"Create new project"**
4. **Attendez 2-3 minutes** pendant la création

---

## Étape 3: Récupérer vos Clés API

Une fois le projet créé:

### 3.1 Aller aux paramètres API
1. Dans le panneau gauche, allez à **Settings** (⚙️ coin bas gauche)
2. Cliquez sur **API** dans le menu
3. Vous voyez 3 informations importantes:

```
Project URL: https://[xxxxxxxxxxxxx].supabase.co
Anon (public): eyJhbGc...
Service_role (secret): eyJhbGc...
```

### 3.2 Copier les 3 clés

**Clé 1: NEXT_PUBLIC_SUPABASE_URL**
- Copiez la ligne "Project URL"
- Exemple: `https://abcdefgh12345.supabase.co`

**Clé 2: NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Allez à l'onglet "API Keys"
- Copiez la clé "anon public"
- C'est celle qui commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Clé 3: SUPABASE_SERVICE_ROLE_KEY**
- Dans le même onglet "API Keys"
- Copiez la clé "service_role (secret)"
- ⚠️ **GARDEZ CETTE CLÉ SECRÈTE** - Ne la partagez jamais

---

## Étape 4: Initialiser la Base de Données

### 4.1 Ouvrir SQL Editor
1. Dans le panneau gauche, cliquez **"SQL Editor"**
2. Cliquez **"New Query"**

### 4.2 Copier le script SQL
1. Ouvrez le fichier `/scripts/supabase-init.sql`
2. Copiez **TOUT** le contenu
3. Collez-le dans l'éditeur SQL Supabase

### 4.3 Exécuter le script
1. Cliquez le bouton **"Run"** (ou Ctrl+Enter)
2. Attendez que la requête se termine
3. Vous devriez voir:
   ```
   ✓ Query completed successfully
   ```

### 4.4 Vérifier les tables
1. Allez à **"Table Editor"** (panneau gauche)
2. Vous devriez voir ces 5 tables:
   - ✓ `user_profiles`
   - ✓ `couples`
   - ✓ `mood_events`
   - ✓ `suggested_replies`
   - ✓ (autres tables système)

---

## Étape 5: Activer l'Authentification

### 5.1 Configurer Email/Mot de passe
1. Allez à **"Authentication"** (panneau gauche)
2. Cliquez sur **"Providers"**
3. Email doit être **déjà activé** ✓
4. Allez à **"Email Templates"**
5. Vérifiez que les templates existent

### 5.2 Configuration SMTP (Optionnel)
Pour envoyer des emails de confirmation:
1. Allez à **"Settings"** → **"Email"**
2. Si vous voulez des emails personnalisés, configurez SMTP
3. Sinon, laissez les defaults (les emails Supabase fonctionnent)

---

## Étape 6: Activer Row Level Security (RLS)

✓ C'est déjà fait par le script SQL!

Les politiques RLS assurent que:
- Chaque utilisateur peut **seulement voir ses propres données**
- Les mots de passe sont **jamais exposés**
- Les couples sont **isolés les uns des autres**

Pour vérifier:
1. Allez à **"Authentication"** → **"Policies"**
2. Vous devriez voir les politiques créées

---

## Étape 7: Sauvegarder vos Clés

**Créez un fichier `.env.local` dans votre projet:**

```bash
# Copie vos 3 clés ici (NE PAS committer ce fichier!)
NEXT_PUBLIC_SUPABASE_URL=https://[votre-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**⚠️ Important:**
- Ce fichier est déjà dans `.gitignore`
- NE LE COMMITEZ JAMAIS
- La clé `SUPABASE_SERVICE_ROLE_KEY` est secrète!

---

## Étape 8: Tester la Connexion

### Via l'app Mood Signal:
1. Allez à `http://localhost:3000`
2. Créez un compte
3. Si ça fonctionne, Supabase est bien configuré ✓

### Via Supabase Dashboard:
1. Allez à **"Authentication"** → **"Users"**
2. Vous devriez voir votre nouvel utilisateur
3. L'email affiché devrait correspondre

---

## ✅ Checklist Supabase Complète

- [ ] Compte Supabase créé
- [ ] Projet "mood-signal" créé
- [ ] 3 clés API copiées
- [ ] Script SQL exécuté
- [ ] 5 tables visibles dans Table Editor
- [ ] Email/Mot de passe activé
- [ ] Fichier `.env.local` créé
- [ ] Signup fonctionne localement
- [ ] Utilisateur visible dans "Users"

---

## 🆘 Troubleshooting Supabase

### Erreur: "Invalid API key"
→ Assurez-vous d'avoir copié exactement les bonnes clés (pas de espace)

### Erreur: "RLS violation"
→ Normal au démarrage, les policies se mettent en place
→ Rechargez la page et réessayez

### Les tables ne s'affichent pas
→ Allez à **Table Editor** et actualisez (F5)
→ Les tables créées par le script peuvent être masquées - cochez "Show hidden tables"

### "Signup fails with 'User already exists'"
→ Allez à **Authentication** → **Users**
→ Supprimez l'utilisateur test
→ Réessayez

### "Connection refused"
→ Vérifiez que vous avez les bonnes clés
→ Vérifiez que le projet Supabase est actif (pas en pause)

---

## 📱 Prochaine Étape

Une fois Supabase configuré:
1. Allez à [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md)
2. Continuez avec **Étape 2: Configuration Vercel**

---

## 💾 Sauvegarde de Vos Données

Vos données Supabase sont **toujours sauvegardées**:
- Supabase effectue des sauvegardes automatiques tous les jours
- Les données sont répliquées en temps réel
- Plan Free: 500 MB de stockage gratuit

**Bonus:** Vous pouvez exporter vos données à tout moment depuis **Settings** → **Export**.

---

**Vous avez fini avec Supabase! 🎉**
Allez maintenant à [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md) pour le déploiement Vercel.
