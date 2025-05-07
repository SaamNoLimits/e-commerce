 // Importation des classes nécessaires de Mongoose et des types personnalisés
import { IReviewInput } from '@/types'  // Importation du type IReviewInput, qui contient les informations nécessaires pour une critique
import { Document, Model, model, models, Schema } from 'mongoose'  // Mongoose permet de définir des schémas et des modèles pour MongoDB

// Définition de l'interface IReview qui étend Document et IReviewInput
// Cela permet à IReview d'hériter des propriétés de Document et d'IReviewInput
export interface IReview extends Document, IReviewInput {
  _id: string  // ID unique de la revue
  createdAt: Date  // Date de création de la revue
  updatedAt: Date  // Date de dernière mise à jour de la revue
}

// Définition du schéma pour la revue (reviewSchema)
const reviewSchema = new Schema<IReview>(
  {
    // Référence à l'utilisateur ayant écrit la revue
    user: {
      type: Schema.Types.ObjectId as unknown as typeof String,  // L'ID de l'utilisateur (référence à un utilisateur dans la base de données)
      ref: 'User',  // La référence pointe vers le modèle 'User'
    },
    // Indique si la critique a été écrite après un achat vérifié
    isVerifiedPurchase: {
      type: Boolean,  // Valeur booléenne qui indique si l'achat est vérifié
      required: true,  // Ce champ est obligatoire
      default: false,  // Par défaut, il n'est pas vérifié
    },
    // Référence au produit pour lequel la critique a été laissée
    product: {
      type: Schema.Types.ObjectId as unknown as typeof String,  // L'ID du produit (référence à un produit dans la base de données)
      ref: 'Product',  // La référence pointe vers le modèle 'Product'
    },
    // Note donnée par l'utilisateur pour le produit (valeur entre 1 et 5)
    rating: {
      type: Number,  // La note est un nombre
      required: true,  // Ce champ est obligatoire
      min: 1,  // La note minimale est 1
      max: 5,  // La note maximale est 5
    },
    // Titre de la revue
    title: {
      type: String,  // Le titre est une chaîne de caractères
      required: true,  // Ce champ est obligatoire
    },
    // Commentaire détaillé de la revue
    comment: {
      type: String,  // Le commentaire est une chaîne de caractères
      required: true,  // Ce champ est obligatoire
    },
  },
  {
    // Cette option permet de générer automatiquement les timestamps (dates de création et mise à jour)
    timestamps: true,
  }
)

// Définition du modèle 'Review' à partir du schéma 'reviewSchema'
// Vérifie si le modèle existe déjà dans la collection 'models' ou crée un nouveau modèle si ce n'est pas le cas
const Review =
  (models.Review as Model<IReview>) ||
  model<IReview>('Review', reviewSchema)

// Exportation du modèle Review pour l'utiliser ailleurs dans l'application
export default Review
