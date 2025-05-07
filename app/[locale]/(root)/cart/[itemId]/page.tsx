 // 📌 Importation du composant CartAddItem qui va gérer l'ajout de l'article au panier
import CartAddItem from './cart-add-item'

// 📌 Définition de la fonction asynchrone qui représente la page d'ajout au panier
export default async function CartAddItemPage(props: {
  params: Promise<{ itemId: string }> // `params` est une promesse qui contient l'identifiant de l'article (`itemId`)
}) {
  // 📌 Extraction de `itemId` depuis `props.params` (en attente de la promesse)
  const { itemId } = await props.params

  // 📌 On retourne le composant `CartAddItem` en lui passant `itemId`
  return <CartAddItem itemId={itemId} />
}
