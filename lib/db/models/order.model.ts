// Importation des types et des modules nécessaires
import { IOrderInput } from '@/types'  // Importation du type IOrderInput pour les données de la commande
import { Document, Model, model, models, Schema } from 'mongoose'  // Importation des classes nécessaires de Mongoose pour la gestion de la base de données MongoDB

// Définition de l'interface IOrder qui étend Document et IOrderInput
// Document représente un document Mongoose, et IOrderInput représente les données de la commande
export interface IOrder extends Document, IOrderInput {
  _id: string  // ID unique de la commande
  createdAt: Date  // Date de création de la commande
  updatedAt: Date  // Date de la dernière mise à jour de la commande
}

// Définition du schéma pour la commande
const orderSchema = new Schema<IOrder>(
  {
    // Définition de l'utilisateur qui a passé la commande
    user: {
      type: Schema.Types.ObjectId as unknown as typeof String,  // L'ID de l'utilisateur, référencé par ObjectId
      ref: 'User',  // Référence au modèle User
      required: true,  // Ce champ est obligatoire
    },
    // Définition des éléments de la commande (les produits)
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,  // L'ID du produit, référencé par ObjectId
          ref: 'Product',  // Référence au modèle Product
          required: true,  // Ce champ est obligatoire
        },
        clientId: { type: String, required: true },  // ID du client pour cet article
        name: { type: String, required: true },  // Nom du produit
        slug: { type: String, required: true },  // Slug (identifiant unique pour le produit)
        image: { type: String, required: true },  // URL de l'image du produit
        category: { type: String, required: true },  // Catégorie du produit
        price: { type: Number, required: true },  // Prix du produit
        countInStock: { type: Number, required: true },  // Quantité disponible en stock
        quantity: { type: Number, required: true },  // Quantité commandée
        size: { type: String },  // Taille du produit (optionnel)
        color: { type: String },  // Couleur du produit (optionnel)
      },
    ],
    // Définition de l'adresse de livraison
    shippingAddress: {
      fullName: { type: String, required: true },  // Nom complet du destinataire
      street: { type: String, required: true },  // Rue de l'adresse
      city: { type: String, required: true },  // Ville
      postalCode: { type: String, required: true },  // Code postal
      country: { type: String, required: true },  // Pays
      province: { type: String, required: true },  // Province ou région
      phone: { type: String, required: true },  // Numéro de téléphone du destinataire
    },
    // Date de livraison estimée
    expectedDeliveryDate: { type: Date, required: true },
    // Méthode de paiement choisie
    paymentMethod: { type: String, required: true },
    // Résultat du paiement
    paymentResult: { id: String, status: String, email_address: String },
    // Prix des articles dans la commande
    itemsPrice: { type: Number, required: true },
    // Prix de l'expédition
    shippingPrice: { type: Number, required: true },
    // Prix des taxes
    taxPrice: { type: Number, required: true },
    // Prix total de la commande
    totalPrice: { type: Number, required: true },
    // Statut du paiement (si payé ou non)
    isPaid: { type: Boolean, required: true, default: false },
    // Date du paiement
    paidAt: { type: Date },
    // Statut de la livraison (si livré ou non)
    isDelivered: { type: Boolean, required: true, default: false },
    // Date de livraison
    deliveredAt: { type: Date },
    // Date de création de la commande (définie automatiquement)
    createdAt: { type: Date, default: Date.now },
  },
  {
    // Option pour activer les timestamps (dates de création et de mise à jour automatiques)
    timestamps: true,
  }
)

// Définition du modèle de la commande
const Order =
  (models.Order as Model<IOrder>) || model<IOrder>('Order', orderSchema)
// Vérifie si le modèle 'Order' existe déjà dans models, sinon crée un nouveau modèle basé sur orderSchema

// Exportation du modèle pour qu'il puisse être utilisé ailleurs dans l'application
export default Order
