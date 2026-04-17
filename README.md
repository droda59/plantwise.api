# plantwise.api

Pour importer le fichier xlsx :
curl -X POST http://localhost:3000/api/plants/import

Pour un changement de schéma de BD :
npx prisma db push --force-reset && npx prisma db push
