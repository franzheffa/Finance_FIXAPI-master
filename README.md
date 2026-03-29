# Smith-Heffa-PayGate

Plateforme Next.js + API routes pour orchestration paiement (Stripe, Interac, Mobile Money, SWIFT/SEPA en mode simulation).

## 1) Préparation locale

```bash
npm install
cp .env.example .env.local
```

## 2) Variables d'environnement (local)

Commande `cat` prête à remplir:

```bash
cat > .env.local <<'EOF'
STRIPE_SECRET_KEY=sk_live_replace_me
STRIPE_WEBHOOK_SECRET=whsec_replace_me
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_replace_me
NEXT_PUBLIC_APP_URL=https://smith-heffa-paygate.vercel.app
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public
MOBILE_MONEY_API_KEY=replace_me
ORANGE_MONEY_API_BASE_URL=https://api.orange-money.example
ORANGE_MONEY_CLIENT_ID=replace_me
ORANGE_MONEY_CLIENT_SECRET=replace_me
INTERAC_API_BASE_URL=https://api.interac.example
INTERAC_API_KEY=replace_me
ORANGE_ORDERING_BASE_URL=https://api.orange.com/ordering/b2b/v3
ORANGE_OAUTH_TOKEN_URL=https://api.orange.com/oauth/v3/token
ORANGE_ORDERING_SCOPE=b2b:ordering
ORANGE_ACCEPT_LANGUAGE=fr
ORANGE_CLIENT_ID=replace_me
ORANGE_CLIENT_SECRET=replace_me
ORANGE_API_KEY=replace_me
EOF
```

## 3) Build et validation

```bash
npm run build
```

## 4) Déploiement Vercel Production

```bash
vercel whoami
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add DATABASE_URL production
vercel env add MOBILE_MONEY_API_KEY production
vercel env add ORANGE_MONEY_API_BASE_URL production
vercel env add ORANGE_MONEY_CLIENT_ID production
vercel env add ORANGE_MONEY_CLIENT_SECRET production
vercel env add INTERAC_API_BASE_URL production
vercel env add INTERAC_API_KEY production
vercel --prod --yes
```

## 5) GitHub push

```bash
git add .
git commit -m "chore: harden APIs and prepare production env/deploy"
git push origin main
```

## 6) Passage en flux réel Interac -> Orange Money (important)

Le code actuel expose des flux de simulation pour plusieurs rails. Pour envoyer de l'argent réel aujourd'hui, il faut:

1. Activer des comptes marchands Interac et Orange Money Business.
2. Obtenir les credentials API de production.
3. Implémenter les endpoints serveur signés (auth OAuth/HMAC selon fournisseur).
4. Ajouter KYC/AML, journalisation et webhooks de confirmation.
5. Exécuter des tests de bout en bout en environnement sandbox avant production.

Sans ces credentials et contrats opérateurs, l'application reste une simulation UX/API pour les rails non Stripe.

## 7) Endpoint intégré: Orange Ordering v3.1

Route serverless ajoutée: `POST /api/orange-ordering`

Actions supportées dans le body JSON:

- `status`
- `version`
- `me`
- `listRequests` (avec `query`)
- `getRequest` (avec `id`)
- `createRequest` (avec `payload`)
- `listCatalogItems` (avec `query`)
- `getCatalogItem` (avec `id`)

Exemple `cat` prêt à tester:

```bash
cat > /tmp/orange-ordering-status.json <<'EOF'
{
  "action": "status"
}
EOF

curl -sS -X POST "https://smith-heffa-paygate.vercel.app/api/orange-ordering" \
  -H "Content-Type: application/json" \
  --data-binary @/tmp/orange-ordering-status.json
```
