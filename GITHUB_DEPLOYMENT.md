# 📚 Guide: Push sur GitHub & Déploiement Vercel

## Étape 1: Créer un Dépôt GitHub

### 1.1 Créer un compte GitHub
Si vous n'avez pas de compte:
1. Allez à **https://github.com**
2. Cliquez **"Sign up"**
3. Suivez les étapes
4. Vérifiez votre email

### 1.2 Créer un nouveau dépôt
1. Connectez-vous à GitHub
2. Cliquez l'icône **"+"** (coin haut droit)
3. Cliquez **"New repository"**
4. Remplissez:
   - **Repository name:** `mood-signal`
   - **Description:** `Long distance couple mood sharing app`
   - **Public/Private:** Public (nécessaire pour Vercel gratuit)
   - ✓ Ne cochez PAS "Add README.md"
5. Cliquez **"Create repository"**

---

## Étape 2: Préparer vos Fichiers Localement

### 2.1 Télécharger/Copier vos fichiers
Vous devez avoir tous les fichiers du projet:
```
mood-signal/
├── app/
├── components/
├── lib/
├── public/
├── scripts/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── vercel.json
└── [tous les fichiers...]
```

### 2.2 Configurer Git localement
Ouvrez un terminal dans le dossier `mood-signal`:

```bash
# Initialiser Git (si pas encore fait)
git init

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial Mood Signal commit"

# Ajouter le remote GitHub
git remote add origin https://github.com/[YOUR_USERNAME]/mood-signal.git

# Renommer la branche main (si nécessaire)
git branch -M main

# Pousser sur GitHub
git push -u origin main
```

Si vous avez une erreur d'authentification:
- Créez un **Personal Access Token** sur GitHub
- Utilisez-le au lieu du mot de passe

---

## Étape 3: Connecter Vercel

### 3.1 Créer un compte Vercel
1. Allez à **https://vercel.com**
2. Cliquez **"Sign Up"**
3. Cliquez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repos

### 3.2 Importer le dépôt
1. Une fois connecté à Vercel, cliquez **"New Project"**
2. Sélectionnez le repo **`mood-signal`** de GitHub
3. Cliquez **"Import"**

### 3.3 Configurer le projet
La plupart des paramètres sont détectés automatiquement:
- **Framework:** Next.js ✓ (auto-détecté)
- **Build Command:** `npm run build` ✓
- **Output Directory:** `.next` ✓
- **Environment Variables:** À remplir à l'étape suivante

---

## Étape 4: Ajouter les Variables d'Environnement

### 4.1 Dans Vercel
Avant de cliquer "Deploy":
1. Cliquez sur **"Environment Variables"**
2. Ajoutez ces 3 variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Pour chaque variable:
1. Entrez le nom exact (sans les tirets)
2. Copiez la valeur depuis Supabase
3. Cliquez **"Add"**

### 4.2 Valeurs à copier depuis Supabase
- **NEXT_PUBLIC_SUPABASE_URL:** Settings → API → Project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY:** Settings → API → anon key
- **SUPABASE_SERVICE_ROLE_KEY:** Settings → API → service_role key

**Copie/Colle directe, pas de modifications!**

---

## Étape 5: Déployer

### 5.1 Cliquer Deploy
1. Une fois les 3 variables ajoutées
2. Cliquez **"Deploy"**
3. **Attendez 3-5 minutes**

### 5.2 Vérifier le déploiement
Vous verrez:
```
✓ Deployed successfully!
```

L'URL sera du type:
```
https://mood-signal-[random].vercel.app
```

Cliquez **"Visit"** pour ouvrir votre app!

---

## Étape 6: Initialiser la Base de Données

Une fois l'app déployée:

### 6.1 Accéder à la page setup
1. Allez à: `https://mood-signal-[random].vercel.app/setup`
2. Cliquez **"Initialize Database"**
3. Attendez le message ✓

### 6.2 Vérifier dans Supabase
1. Allez à Supabase Dashboard
2. **Table Editor**
3. Vous devez voir les 5 tables remplies

---

## Étape 7: Déploiements Futurs

Chaque fois que vous modifiez le code:

### 7.1 Sur votre ordinateur:
```bash
git add .
git commit -m "Your change description"
git push origin main
```

### 7.2 Vercel redéploie automatiquement! 🎉
- Aucune action nécessaire
- Le déploiement prend 1-2 minutes
- Vous recevez une notification email

---

## ✅ Checklist Complet

- [ ] Dépôt GitHub créé
- [ ] Fichiers poussés sur GitHub
- [ ] Compte Vercel créé
- [ ] Projet importé dans Vercel
- [ ] 3 variables d'environnement ajoutées
- [ ] App déployée (voir URL)
- [ ] Page `/setup` initialisée
- [ ] 5 tables visibles dans Supabase
- [ ] Signup fonctionne sur Vercel
- [ ] Mood envoyé et enregistré

---

## 🌍 Domaine Personnalisé (Optionnel)

Pour avoir une URL plus belle:
1. Allez dans Vercel → **Settings** → **Domains**
2. Cliquez **"Add Domain"**
3. Entrez votre domaine (ex: mood-signal.com)
4. Suivez les instructions DNS

---

## 📱 Partager l'URL

Votre app est maintenant live! 🚀

Donnez à votre partenaire:
```
https://mood-signal-[random].vercel.app
```

Ou si vous avez un domaine personnalisé:
```
https://mood-signal.com
```

---

## 🆘 Troubleshooting

### Erreur: "Build failed"
→ Vérifiez que toutes les variables d'environnement sont correctes
→ Allez à **Logs** dans Vercel pour voir l'erreur
→ Réessayez le déploiement

### Variables non trouvées
→ Vérifiez qu'elles sont dans le **bon environnement** (Production)
→ Redéployez: **Deployments** → Menu → **Redeploy**

### App reste en "Building"
→ C'est normal, attendez 5 minutes
→ Si ça reste plus de 10 min, vérifiez les Logs

### API ne fonctionne pas
→ Vérifiez les variables Supabase dans Vercel
→ Allez à `/api/validate-config` pour tester

---

## 🎯 Prochaine Étape

L'app est déployée! Allez à [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md) section **"Étape 4: Tester l'Application"** pour les tests finaux.

---

**Vous avez déployé votre app! 🚀🎉**
Allez maintenant tester et partager avec votre partenaire!
