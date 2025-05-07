 // Importation de Link de Next.js pour permettre la navigation entre les pages sans rechargement
import Link from 'next/link'

// Importation du composant ProductForm, utilisé pour afficher le formulaire de création de produit
import ProductForm from '../product-form'

// Importation du type Metadata pour définir les métadonnées de la page (comme le titre)
import { Metadata } from 'next'

// Déclaration des métadonnées de la page, ici on définit le titre affiché dans l'onglet du navigateur
export const metadata: Metadata = {
  title: 'Create Product', // Titre qui apparaîtra dans l’onglet
}

// Déclaration du composant principal de la page "Créer un produit"
const CreateProductPage = () => {
  return (
    <main className='max-w-6xl mx-auto p-4'> {/* Conteneur principal avec un max-width et centrage */}
      
      {/* Petite barre de navigation pour montrer le chemin actuel (breadcrumb) */}
      <div className='flex mb-4'>
        <Link href='/admin/products'>Products</Link> {/* Lien vers la liste des produits */}
        <span className='mx-1'>›</span> {/* Séparateur visuel entre les liens */}
        <Link href='/admin/products/create'>Create</Link> {/* Lien vers la page actuelle de création */}
      </div>

      {/* Section contenant le formulaire de création */}
      <div className='my-8'>
        <ProductForm type='Create' /> {/* On affiche le formulaire avec le mode "Create" */}
      </div>
      
    </main>
  )
}

// Exportation du composant pour qu’il soit accessible à Next.js comme une page
export default CreateProductPage
