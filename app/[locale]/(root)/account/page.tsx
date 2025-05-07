import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { Card, CardContent } from '@/components/ui/card'
import { PackageCheckIcon, User } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

// Titre constant de la page
const PAGE_TITLE = 'Your Account'

// Métadonnées de la page (SEO)
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

// Composant principal représentant la page "Mon Compte"
export default function AccountPage() {
  return (
    <div className="min-h-screen p-8">
      {/* Titre principal de la page */}
      <h1 className="text-[40px] font-bold py-6 text-[#8B5E3C]">
        {PAGE_TITLE}
      </h1>

      {/* Grille avec deux colonnes (sur écran moyen et plus), avec espacement */}
      <div className="grid md:grid-cols-2 gap-6 items-stretch">

        {/* Première carte : Commandes */}
        <Card className="bg-gradient-to-r from-[#D2B48C] to-[#eae2df] hover:from-[#fff6eb] hover:to-[#f1ece7] transition-all duration-300">
          {/* Lien vers la page des commandes */}
          <Link href="/account/orders">
            {/* Contenu de la carte : icône + texte */}
            <CardContent className="flex items-start gap-5 p-7 text-[#000000]">
              <div>
                {/* Icône de commandes */}
                <PackageCheckIcon className="w-14 h-14" />
              </div>
              <div>
                {/* Titre de la section */}
                <h2 className="text-2xl font-bold">Orders</h2>
                {/* Description courte de ce qu’on peut faire */}
                <p className="text-[#201f1f] text-lg">
                  Track, return, cancel an order, download invoice or buy again
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Deuxième carte : Connexion et sécurité */}
        <Card className="bg-gradient-to-r from-[#D2B48C] to-[#eae2df] hover:from-[#fff6eb] hover:to-[#f1ece7] transition-all duration-300">
          {/* Lien vers la page de gestion de compte */}
          <Link href="/account/manage">
            <CardContent className="flex items-start gap-5 p-7 text-[#0c0c0c]">
              <div>
                {/* Icône de l’utilisateur */}
                <User className="w-14 h-14" />
              </div>
              <div>
                {/* Titre de la section */}
                <h2 className="text-2xl font-bold">Login & security</h2>
                {/* Description courte de cette section */}
                <p className="text-[#0b0b0b] text-lg">
                  Manage password, email and mobile number
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Historique de navigation (affiché en bas de page) */}
      <BrowsingHistoryList className="mt-16" />
    </div>
  )
}