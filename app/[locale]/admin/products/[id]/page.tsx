 // Importation de la fonction notFound de Next.js pour gérer le cas où un produit n'est pas trouvé
import { notFound } from 'next/navigation'

// Fonction personnalisée pour récupérer un produit par son ID depuis la base de données
import { getProductById } from '@/lib/actions/product.actions'

// Importation de Link pour naviguer entre les pages sans recharger
import Link from 'next/link'

// Composant de formulaire utilisé pour modifier ou ajouter un produit
import ProductForm from '../product-form'

// Importation du type Metadata pour définir les métadonnées de la page (comme le titre)
import { Metadata } from 'next'

// Définition des métadonnées de la page, ici le titre de l’onglet dans le navigateur
export const metadata: Metadata = {
  title: 'Edit Product', // Titre qui s'affiche dans l'onglet du navigateur
}

// Définition des types des props reçues par le composant UpdateProduct
type UpdateProductProps = {
  params: Promise<{
    id: string // L’ID du produit à modifier
  }>
}

// Déclaration du composant principal de la page, en mode asynchrone car on attend des données du serveur
const UpdateProduct = async (props: UpdateProductProps) => {
  // On récupère les paramètres passés à la page (dans ce cas, l'ID du produit)
  const params = await props.params

  const { id } = params // Destructuration pour extraire l'ID

  // Appel de la fonction pour récupérer les détails du produit depuis la base de données
  const product = await getProductById(id)

  // Si le produit n'existe pas, on affiche une page 404
  if (!product) notFound()

  // Rendu du composant JSX si le produit existe
  return (
    <main className='max-w-6xl mx-auto p-4'> {/* Conteneur principal centré avec padding */}
      <div className='flex mb-4'> {/* Barre de navigation en haut de la page */}
        <Link href='/admin/products'>Products</Link> {/* Lien vers la liste des produits */}
        <span className='mx-1'>›</span> {/* Séparateur */}
        <Link href={`/admin/products/${product._id}`}>{product._id}</Link> {/* Lien vers le produit spécifique */}
      </div>

      <div className='my-8'> {/* Section contenant le formulaire de modification */}
        <ProductForm 
          type='Update' // On indique qu'on est en mode modification
          product={product} // On passe les données du produit à modifier
          productId={product._id} // On passe aussi l’ID du produit
        />
      </div>
    </main>
  )
}

// Exportation du composant pour que Next.js puisse l'utiliser comme page
export default UpdateProduct
