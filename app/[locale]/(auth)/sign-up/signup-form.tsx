'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import useSettingStore from '@/hooks/use-setting-store'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { IUserSignUp } from '@/types'
import { registerUser, signInWithCredentials } from '@/lib/actions/user.actions'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignUpSchema } from '@/lib/validator'
import { Separator } from '@/components/ui/separator'
import { useSearchParams } from 'next/navigation'

const signUpDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'Zineb Echchayeb',
        email: 'Zineb@me.com',
        password: '123456',
        confirmPassword: '123456',
      }
    : {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }

export default function CredentialsSignInForm() {
  const {
    setting: { site },
  } = useSettingStore()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  })

  const { control, handleSubmit } = form

// Fonction de gestion de la soumission du formulaire
const onSubmit = async (data: IUserSignUp) => {
  try {
    // Appel à la fonction registerUser pour enregistrer l'utilisateur avec les données fournies
    const res = await registerUser(data)
    
    // Si l'enregistrement échoue, on affiche un message d'erreur
    if (!res.success) {
      toast({
        title: 'Error', // Titre du toast
        description: res.error, // Message d'erreur
        variant: 'destructive', // Style du toast (destructif pour une erreur)
      })
      return
    }
    
    // Si l'enregistrement est réussi, on connecte l'utilisateur avec les informations d'identification
    await signInWithCredentials({
      email: data.email,
      password: data.password,
    })
    
    // Redirige l'utilisateur vers l'URL de callback ou la page d'accueil
    redirect(callbackUrl)
  } catch (error) {
    // Si une erreur se produit, on affiche un message d'erreur générique
    toast({
      title: 'Error',
      description: 'User Created.',
      variant: 'destructive',
    })
  }
}

// Le rendu du formulaire d'inscription
return (
  <Form {...form}> {/* Formulaire qui utilise les contrôles de formulaire (form validation) */}
    <form onSubmit={handleSubmit(onSubmit)} className="bg-transparent">
      {/* Champ caché contenant l'URL de callback pour rediriger l'utilisateur après l'inscription */}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-6">
        {/* Champ pour le nom de l'utilisateur */}
        <FormField
          control={control} // Contrôle du champ du formulaire
          name="name" // Nom du champ
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black font-bold text-xl">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter name" // Placeholder du champ
                  {...field} // Les propriétés du champ (liées au contrôle)
                  className="w-full h-14 text-black text-lg bg-transparent border-[#f9f9f8] focus:border-[#D2B49F] focus:ring-2 focus:ring-[#D2B49F] shadow-lg transition-all duration-300"
                />
              </FormControl>
              <FormMessage /> {/* Affichage des messages d'erreur ou de validation */}
            </FormItem>
          )}
        />

        {/* Champ pour l'email de l'utilisateur */}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black font-bold text-xl">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email"
                  {...field}
                  className="w-full h-14 text-black text-lg bg-transparent border-[#ffffff] focus:border-[#D2B49F] focus:ring-2 focus:ring-[#D2B49F] shadow-lg transition-all duration-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ pour le mot de passe de l'utilisateur */}
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black font-bold text-xl">Password</FormLabel>
              <FormControl>
                <Input
                  type="password" // Type "password" pour cacher le texte saisi
                  placeholder="Enter password"
                  {...field}
                  className="w-full h-14 text-black text-lg bg-transparent border-[#fefefe] focus:border-[#D2B49F] focus:ring-2 focus:ring-[#D2B49F] shadow-lg transition-all duration-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ pour la confirmation du mot de passe */}
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black font-bold text-xl">Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password" // Type "password" pour cacher le texte saisi
                  placeholder="Confirm Password"
                  {...field}
                  className="w-full h-14 text-black text-lg bg-transparent border-[#fefefe] focus:border-[#D2B49F] focus:ring-2 focus:ring-[#D2B49F] shadow-lg transition-all duration-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bouton de soumission pour le formulaire */}
        <Button
          type="submit"
          className="w-3/4 h-14 mt-4 text-lg bg-gradient-to-r from-[#1d4f6e] to-[#9cdded] text-white hover:bg-gradient-to-l transition-all duration-300 mx-auto block"
        >
          Sign Up
        </Button>

        {/* Texte pour informer l'utilisateur des conditions d'utilisation et politique de confidentialité */}
        <div className="text-lg">
          By creating an account, you agree to {site.name}&apos;s{' '}
          <Link href="/page/conditions-of-use" className="font-bold">Conditions of Use</Link> and{' '}
          <Link href="/page/privacy-policy" className="font-bold">Privacy Notice.</Link>
        </div>

        {/* Séparateur pour séparer les sections */}
        <Separator className="mb-4" />

        {/* Lien vers la page de connexion si l'utilisateur a déjà un compte */}
        <div className="text-lg">
          Already have an account?{' '}
          <Link className="link font-bold" href={`/sign-in?callbackUrl=${callbackUrl}`}>
            Sign In
          </Link>
        </div>
      </div>
    </form>
  </Form>
)
