// ✅ On importe la fonction `create` de la bibliothèque Zustand
// Elle permet de créer un "store" (état global) que l'on peut utiliser partout dans notre application
import { create } from 'zustand'

// ✅ On importe `persist`, un middleware fourni par Zustand
// Il sert à sauvegarder automatiquement l’état dans le localStorage du navigateur
import { persist } from 'zustand/middleware'

// ✅ On définit un type TypeScript pour représenter l’état de notre historique de navigation
// Il contient une liste de produits (chaque produit ayant un id et une catégorie)
type BrowsingHistory = {
  products: { id: string; category: string }[]
}

// ✅ L’état initial est défini ici : au début, aucun produit n’est visité
const initialState: BrowsingHistory = {
  products: [],
}

// ✅ On crée un store Zustand appelé `browsingHistoryStore`
// Ce store va être sauvegardé dans le localStorage grâce au middleware `persist`
export const browsingHistoryStore = create<BrowsingHistory>()(
  persist(
    // Cette fonction retourne l’état initial
    () => initialState,
    {
      // Ce nom sera utilisé comme clé dans le localStorage
      name: 'browsingHistoryStore',
    }
  )
)

// ✅ Hook personnalisé qui simplifie l’utilisation du store Zustand
// Il expose les produits et deux fonctions : `addItem` pour ajouter, et `clear` pour vider l'historique
export default function useBrowsingHistory() {
  // On extrait les produits directement depuis le store
  const { products } = browsingHistoryStore()

  return {
    // 🔄 Liste actuelle des produits dans l’historique (à afficher dans l’interface utilisateur)
    products,

    // ➕ Fonction pour ajouter un produit à l’historique
    addItem: (product: { id: string; category: string }) => {
      // 🔍 On cherche si le produit existe déjà dans l’historique (pour éviter les doublons)
      const index = products.findIndex((p) => p.id === product.id)

      // ❌ S’il existe déjà, on le retire de la liste
      if (index !== -1) products.splice(index, 1)

      // 🆕 On ajoute le nouveau produit au début du tableau (pour que les plus récents soient en haut)
      products.unshift(product)

      // 🚫 Si on dépasse 10 produits, on retire le dernier (le plus ancien)
      if (products.length > 10) products.pop()

      // ✅ On met à jour le store avec la nouvelle liste des produits
      browsingHistoryStore.setState({
        products,
      })
    },

    // 🗑 Fonction pour supprimer tous les produits de l’historique
    clear: () => {
      // Mise à jour de l'état : on vide complètement la liste
      browsingHistoryStore.setState({
        products: [],
      })
    },
  }
}
