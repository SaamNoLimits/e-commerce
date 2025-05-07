 // Importation des classes nécessaires de Mongoose et des types personnalisés
import { Document, Model, model, models, Schema } from 'mongoose'  // Mongoose permet de définir des schémas et des modèles pour MongoDB
import { IProductInput } from '@/types'  // Importation du type IProductInput, qui contient les informations nécessaires pour un produit

// Définition de l'interface IProduct qui étend Document et IProductInput
// Cela permet à IProduct d'hériter des propriétés de Document et d'IProductInput
export interface IProduct extends Document, IProductInput {
  _id: string  // ID unique du produit
  createdAt: Date  // Date de création du produit
  updatedAt: Date  // Date de dernière mise à jour du produit
}

// Définition du schéma pour le produit (productSchema)
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,  // Le nom du produit est une chaîne de caractères
      required: true,  // Ce champ est obligatoire
    },
    slug: {
      type: String,  // Le slug est une chaîne de caractères, souvent utilisée dans les URL
      required: true,  // Ce champ est obligatoire
      unique: true,  // Chaque slug doit être unique
    },
    category: {
      type: String,  // Catégorie du produit
      required: true,  // Ce champ est obligatoire
    },
    images: [String],  // Liste des images du produit, chaque image est une chaîne de caractères (URL de l'image)
    brand: {
      type: String,  // Marque du produit
      required: true,  // Ce champ est obligatoire
    },
    description: {
      type: String,  // Description du produit
      trim: true,  // Supprime les espaces au début et à la fin de la description
    },
    price: {
      type: Number,  // Le prix du produit
      required: true,  // Ce champ est obligatoire
    },
    listPrice: {
      type: Number,  // Le prix d'origine avant toute remise
      required: true,  // Ce champ est obligatoire
    },
    countInStock: {
      type: Number,  // Quantité disponible en stock
      required: true,  // Ce champ est obligatoire
    },
    tags: { type: [String], default: ['new arrival'] },  // Liste de tags pour le produit (ex. "nouvelle arrivée")
    colors: { type: [String], default: ['White', 'Red', 'Black'] },  // Liste des couleurs disponibles pour ce produit
    sizes: { type: [String], default: ['S', 'M', 'L'] },  // Liste des tailles disponibles pour ce produit
    avgRating: {
      type: Number,  // Note moyenne du produit
      required: true,  // Ce champ est obligatoire
      default: 0,  // Valeur par défaut de 0 si aucune note n'est donnée
    },
    numReviews: {
      type: Number,  // Nombre de critiques du produit
      required: true,  // Ce champ est obligatoire
      default: 0,  // Valeur par défaut de 0
    },
    // Distribution des évaluations (combien de personnes ont donné une note spécifique)
    ratingDistribution: [
      {
        rating: {
          type: Number,  // La note spécifique
          required: true,  // Ce champ est obligatoire
        },
        count: {
          type: Number,  // Le nombre de personnes ayant donné cette note
          required: true,  // Ce champ est obligatoire
        },
      },
    ],
    numSales: {
      type: Number,  // Nombre total de ventes du produit
      required: true,  // Ce champ est obligatoire
      default: 0,  // Valeur par défaut de 0
    },
    // Statut de publication du produit (s'il est visible ou non sur le site)
    isPublished: {
      type: Boolean,  // Valeur booléenne indiquant si le produit est publié
      required: true,  // Ce champ est obligatoire
      default: false,  // Par défaut, le produit n'est pas publié
    },
    // Liste des références aux critiques (reviews) associées à ce produit
    reviews: [
      {
        type: Schema.Types.ObjectId,  // Chaque critique est une référence à un autre document dans MongoDB
        ref: 'Review',  // La référence pointe vers le modèle 'Review'
        default: [],  // Valeur par défaut : un tableau vide si aucune critique n'est présente
      },
    ],
  },
  {
    // Cette option permet de générer automatiquement les timestamps (dates de création et mise à jour)
    timestamps: true,
  }
)

// Définition du modèle 'Product' à partir du schéma 'productSchema'
// Vérifie si le modèle existe déjà dans la collection 'models' ou crée un nouveau modèle si ce n'est pas le cas
const Product =
  (models.Product as Model<IProduct>) ||
  model<IProduct>('Product', productSchema)

// Exportation du modèle Product pour l'utiliser ailleurs dans l'application
export default Product
