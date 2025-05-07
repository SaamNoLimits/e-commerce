 // On importe la bibliothèque mongoose qui permet de gérer MongoDB plus facilement
import mongoose from 'mongoose'

// On utilise une variable globale pour ne pas créer plusieurs connexions à MongoDB
// Cette ligne vérifie si une connexion mongoose existe déjà dans la mémoire globale
// Si ce n’est pas le cas, on initialise un objet avec deux propriétés : conn et promise
// conn : contiendra la connexion active
// promise : contiendra la promesse de connexion (en attente d’achèvement)
const cached = (global as any).mongoose || { conn: null, promise: null }

// On exporte une fonction asynchrone qui s’occupe de la connexion à la base de données
export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI // On récupère l’URL MongoDB depuis les variables d’environnement
) => {
  // Si une connexion existe déjà (cached.conn), on la retourne directement sans créer une nouvelle
  if (cached.conn) return cached.conn

  // Si l’URL de connexion est absente, on lance une erreur pour prévenir le développeur
  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

  // Si aucune promesse de connexion n’existe encore, on crée une nouvelle avec mongoose.connect
  // Cela évite de lancer plusieurs connexions en même temps
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI)

  // On attend que la promesse soit terminée et qu’on ait une connexion valide
  cached.conn = await cached.promise

  // On retourne la connexion à MongoDB pour l’utiliser dans les autres parties de l’application
  return cached.conn
}
