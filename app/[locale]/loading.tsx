// 📦 On importe la fonction `getTranslations` de la bibliothèque `next-intl`
// Cette fonction sert à récupérer les traductions définies dans les fichiers de langue
import { getTranslations } from 'next-intl/server'

// 🧩 Composant asynchrone appelé `LoadingPage`
export default async function LoadingPage() {
  // 🌐 On récupère la fonction de traduction `t` via `getTranslations()`
  // Elle nous permet d’accéder aux chaînes traduites selon la langue active
  const t = await getTranslations()

  // 🎨 Rendu de la page "Loading" (chargement)
  return (
    // 🧱 Un conteneur flex vertical qui centre son contenu (horizontalement et verticalement)
    <div className='flex flex-col items-center justify-center min-h-screen '>
      
      {/* 🗳️ Une boîte centrée avec padding, ombre, arrondis et largeur 1/3 de l'écran */}
      <div className='p-6 rounded-lg shadow-md w-1/3 text-center'>
        
        {/* 🌍 Texte traduit qui s’affiche durant le chargement */}
        {/* La clé 'Loading.Loading' sera remplacée par la traduction correspondante */}
        {t('Loading.Loading')}
      </div>
    </div>
  )
}
