 // Importation des classes nécessaires de Mongoose et des types personnalisés
import { IUserInput } from '@/types'  // Importation du type IUserInput, qui contient les informations nécessaires pour un utilisateur
import { Document, Model, model, models, Schema } from 'mongoose'  // Mongoose permet de définir des schémas et des modèles pour MongoDB

// Définition de l'interface IUser qui étend Document et IUserInput
// Cela permet à IUser d'hériter des propriétés de Document et d'IUserInput
export interface IUser extends Document, IUserInput {
  _id: string  // ID unique de l'utilisateur
  createdAt: Date  // Date de création de l'utilisateur
  updatedAt: Date  // Date de dernière mise à jour de l'utilisateur
}

// Définition du schéma pour l'utilisateur (userSchema)
const userSchema = new Schema<IUser>(
  {
    // L'email de l'utilisateur, qui est requis et unique
    email: { type: String, required: true, unique: true },
    // Le nom de l'utilisateur, qui est requis
    name: { type: String, required: true },
    // Le rôle de l'utilisateur, qui est requis et par défaut "User"
    role: { type: String, required: true, default: 'User' },
    // Le mot de passe de l'utilisateur
    password: { type: String },
    // L'image de l'utilisateur
    image: { type: String },
    // Indicateur si l'email de l'utilisateur est vérifié
    emailVerified: { type: Boolean, default: false },
  },
  {
    // Cette option permet de générer automatiquement les timestamps (dates de création et mise à jour)
    timestamps: true,
  }
)

// Définition du modèle 'User' à partir du schéma 'userSchema'
// Vérifie si le modèle existe déjà dans la collection 'models' ou crée un nouveau modèle si ce n'est pas le cas
const User = (models.User as Model<IUser>) || model<IUser>('User', userSchema)

// Exportation du modèle User pour l'utiliser ailleurs dans l'application
export default User
