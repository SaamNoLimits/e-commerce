// Importation des composants nécessaires pour l'en-tête et le pied de page
import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'

// Définition du layout principal en utilisant un composant React
export default async function RootLayout({
  children, // Propriété qui contiendra le contenu dynamique de la page
}: {
  children: React.ReactNode // Définition du type de la propriété 'children' comme un nœud React
}) {
  return (
    // Conteneur principal utilisant Flexbox pour organiser les éléments en colonne
    <div className='flex flex-col min-h-screen'>
      {/* Composant Header (en-tête) qui sera affiché tout en haut de la page */}
      <Header />
      
      {/* Section principale qui contient le contenu dynamique de la page */}
      <main className='flex-1 flex flex-col p-4'>
        {/* Le contenu dynamique qui est passé en tant que prop 'children' */}
        {children}
      </main>
      
      {/* Composant Footer (pied de page) qui sera affiché tout en bas de la page */}
      <Footer />
    </div>
  )
}
