 'use client'
// ✅ Indique que ce composant fonctionne côté client (React) — requis pour les hooks comme useForm ou useState

// 📦 Importations nécessaires
import { redirect, useSearchParams } from 'next/navigation'
// 🔁 redirect : permet de rediriger l'utilisateur après connexion
// 🔍 useSearchParams : permet de lire les paramètres de l'URL (ex: ?callbackUrl=/dashboard)

import { Button } from '@/components/ui/button'
// 🔘 Composant personnalisé de bouton (designé via Tailwind ou Shadcn)

import { Input } from '@/components/ui/input'
// 🔲 Composant personnalisé de champ de saisie

import Link from 'next/link'
// 🔗 Permet de faire des liens internes entre les pages Next.js (sans rechargement)

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
// 📋 Composants de formulaire personnalisés pour afficher les champs, labels et erreurs

import { useForm } from 'react-hook-form'
// 🧠 Hook principal pour gérer l'état du formulaire (valeurs, validation, soumission)

import { IUserSignIn } from '@/types'
// 🧾 Interface TypeScript qui définit les champs requis : email, mot de passe

import { signInWithCredentials } from '@/lib/actions/user.actions'
// 🔐 Fonction pour connecter l'utilisateur en vérifiant ses identifiants

import { toast } from '@/hooks/use-toast'
// 🔔 Pour afficher des messages (succès, erreur, etc.)

import { zodResolver } from '@hookform/resolvers/zod'
// ✅ Adaptateur entre Zod (pour la validation) et React Hook Form

import { UserSignInSchema } from '@/lib/validator'
// ✅ Schéma Zod qui valide l’email et le mot de passe (format, champ requis…)

import { isRedirectError } from 'next/dist/client/components/redirect-error'
// 🛑 Pour vérifier si une erreur est liée à une redirection

import useSettingStore from '@/hooks/use-setting-store'
// 🛠️ Hook personnalisé qui récupère les paramètres de configuration du site

// 🎯 Valeurs par défaut pour le formulaire (en mode développement on préremplit)
const signInDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        email: 'admin@example.com',
        password: '123456',
      }
    : {
        email: '',
        password: '',
      }

// 🔑 Composant principal : formulaire de connexion
export default function SignInForm() {
  const {
    setting: { site },
  } = useSettingStore()
  // 📥 Récupère les paramètres de configuration du site

  const searchParams = useSearchParams()
  // 🔎 Permet d’accéder aux paramètres d’URL

  const callbackUrl = searchParams.get('callbackUrl') || '/'
  // 📍 URL de redirection après connexion (par défaut vers la page d'accueil)

  // 📋 Initialisation du formulaire avec useForm + validation Zod
  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  })

  const { control, handleSubmit } = form
  // 🧠 control : pour connecter les champs au formulaire
  // 📤 handleSubmit : fonction qui déclenche la validation + appel de onSubmit

  // 🛠️ Fonction appelée lors de la soumission du formulaire
  const onSubmit = async (data: IUserSignIn) => {
    try {
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      })
      // ✅ Connexion réussie → redirection
      redirect(callbackUrl)
    } catch (error) {
      // ❌ Gestion des erreurs
      if (isRedirectError(error)) {
        throw error
      }
      toast({
        title: 'Error',
        description: 'Invalid email or password',
        variant: 'destructive',
      })
    }
  }

  // 🎨 Rendu JSX → ce qui s'affiche à l'écran
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      {/* 💠 Conteneur du formulaire */}
      <div className="w-[800px] py-20 px-12 bg-transparent rounded-lg shadow-2xl shadow-[#ffffff] border-2 border-white flex flex-col items-center">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
            {/* 🔒 Champ caché pour transmettre l'URL de redirection */}
            <input type='hidden' name='callbackUrl' value={callbackUrl} />

            {/* 🧭 Titre du formulaire */}
            <h1 className="text-6xl font-semibold text-center glowing-title mb-6">Sign In</h1>

            {/* 📥 Champs du formulaire */}
            <div className="w-full flex flex-col space-y-8">
              {/* 📧 Champ Email */}
              <FormField
                control={control}
                name='email'
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-black font-bold text-2xl">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter email address'
                        {...field}
                        className="w-full h-16 text-white bg-transparent border-white focus:border-[#36d7ff] focus:ring-2 focus:ring-[#382eff] shadow-lg transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                    {/* 🔴 Message d’erreur s’il y a un problème avec l’email */}
                  </FormItem>
                )}
              />

              {/* 🔐 Champ Mot de passe */}
              <FormField
                control={control}
                name='password'
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-black font-bold text-2xl">Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Enter password'
                        {...field}
                        className="w-full h-16 text-white bg-transparent border-white focus:border-[#30f1ff] focus:ring-2 focus:ring-[#D2B49F] shadow-lg transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                    {/* 🔴 Message d’erreur pour le mot de passe */}
                  </FormItem>
                )}
              />
            </div>

            {/* ✅ Bouton de connexion */}
            <Button
              type='submit'
              className="w-80 h-16 mt-8 bg-gradient-to-r from-[#1d4f6e] to-[#9cdded] text-white text-xl hover:bg-gradient-to-l transition-all duration-300"
            >
              Sign In
            </Button>
          </form>
        </Form>

        {/* ➕ Lien vers la page de création de compte */}
        <div className="mt-6 w-full flex justify-center">
          <Link href={`/sign-up?callbackUrl=${callbackUrl}`}>
            <Button
              className="w-80 h-16 bg-white text-black text-xl border border-white hover:bg-[#b5f0ff] transition-all duration-300"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// 🎨 Style personnalisé pour le titre "glow"
const style = `
  .glowing-title {
    color: #ffffff;
    text-shadow: 0 0 10px #D2B49F, 0 0 20px #D2B49F, 0 0 30px #D2B49F, 0 0 40px #ffffff;
  }
`

// 📄 On injecte le style directement dans la balise <head>
const styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = style
document.head.appendChild(styleSheet)
