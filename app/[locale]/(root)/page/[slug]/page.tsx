 // Importation des bibliothèques nécessaires
import ReactMarkdown from 'react-markdown'  // Permet de convertir du texte en Markdown en HTML
import { notFound } from 'next/navigation'  // Fonction pour afficher une page 404 si la page demandée n'existe pas
import { getWebPageBySlug } from '@/lib/actions/web-page.actions'  // Fonction pour récupérer les données d'une page web via son slug

/**
 * Fonction `generateMetadata` : génère les métadonnées de la page (titre)
 * Cette fonction est appelée avant le rendu de la page pour définir dynamiquement son titre.
 */
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  // Attente de la résolution de la promesse `params`
  const params = await props.params

  // Extraction du `slug` (identifiant de la page dans l'URL)
  const { slug } = params

  // Recherche des données de la page web associée à ce `slug`
  const webPage = await getWebPageBySlug(slug)

  // Si aucune page n'est trouvée, on retourne un titre par défaut
  if (!webPage) {
    return { title: 'Web page not found' }  // Titre affiché si la page est introuvable
  }

  // Sinon, on retourne le titre de la page web récupérée
  return {
    title: webPage.title,  // Titre défini dynamiquement selon la base de données
  }
}

/**
 * Composant `ProductDetailsPage` : affiche le contenu d'une page web en fonction de son slug
 */
export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>  // Contient le slug de la page demandée
  searchParams: Promise<{ page: string; color: string; size: string }>  // Paramètres de recherche optionnels
}) {
  // Attente de la résolution de la promesse `params`
  const params = await props.params

  // Extraction du `slug` de l'URL
  const { slug } = params

  // Recherche de la page web en fonction de son slug
  const webPage = await getWebPageBySlug(slug)

  // Si aucune page n'est trouvée, on affiche la page 404
  if (!webPage) notFound()

  // Retourne le contenu de la page si elle existe
  return (
    <div className='p-4 max-w-3xl mx-auto'>  {/* Conteneur principal centré */}
      
      {/* Affichage du titre de la page avec un effet de gradient */}
      <h1 className='h1-bold py-4 text-transparent bg-clip-text bg-gradient-to-r from-[#070707] to-[#684f2f]'>
        {webPage.title}
      </h1>

      {/* Affichage du contenu de la page en utilisant ReactMarkdown pour interpréter le Markdown */}
      <section className='text-justify text-xl mb-20 web-page-content text-transparent bg-clip-text bg-gradient-to-r from-[#050404] to-[#755e3f]'>
        <ReactMarkdown>{webPage.content}</ReactMarkdown>
      </section>

    </div>
  )
}

