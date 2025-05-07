'use client'

import { useEffect, useState } from 'react'
import { getSetting } from '@/lib/actions/setting.actions'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [site, setSite] = useState<any>(null)

  // Utilisation de useEffect pour charger les données asynchrones
  useEffect(() => {
    // Fonction pour récupérer les données asynchrones
    const fetchData = async () => {
      const data = await getSetting()
      setSite(data.site) // Mettre à jour l'état avec les données reçues
    }

    fetchData() // Appeler la fonction de récupération des données
  }, []) // Le tableau vide [] signifie que l'effet se produit une seule fois après le rendu initial

  return (
    <div className='flex flex-col items-center min-h-screen bg-gradient-to-r from-[#4492ff] via-[#5bb6eb] to-[#0676e6] animate-glow'>
      <header className='mt-8'>
        <Link href='/'>
          {/* Vous pouvez supprimer cette ligne pour éliminer l'espace */}
          {/* <p>Logo ou autre contenu ici</p> */}
        </Link>
      </header>
      <main className='mx-auto max-w-lg min-w-80 p-4'>
        {children}
      </main>

      <style jsx>{`
        @keyframes glow {
          0% {
            background-position: 0% 50%;
            box-shadow: 0 0 5px rgba(107, 66, 38, 0.5);
          }
          50% {
            background-position: 100% 50%;
            box-shadow: 0 0 20px rgba(107, 66, 38, 1);
          }
          100% {
            background-position: 0% 50%;
            box-shadow: 0 0 5px rgba(107, 66, 38, 0.5);
          }
        }

        .animate-glow {
          animation: glow 5s ease-in-out infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  )
}
