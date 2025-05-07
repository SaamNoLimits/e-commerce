 'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { updateUserName } from '@/lib/actions/user.actions'
import { UserNameSchema } from '@/lib/validator'

export const ProfileForm = () => {
  const router = useRouter() // Permet la navigation après soumission du formulaire
  const { data: session, update } = useSession() // Récupère la session actuelle et la fonction de mise à jour

  // Initialisation du formulaire avec validation et valeurs par défaut
  const form = useForm<z.infer<typeof UserNameSchema>>({
    resolver: zodResolver(UserNameSchema), // Utilise le schéma Zod pour valider les données du formulaire
    defaultValues: {
      name: session?.user?.name ?? '', // Valeur par défaut : le nom de l'utilisateur ou une chaîne vide
    },
  })

  const { toast } = useToast() // Hook pour afficher des notifications

  // Fonction exécutée lors de la soumission du formulaire
  async function onSubmit(values: z.infer<typeof UserNameSchema>) {
    const res = await updateUserName(values) // Envoie les nouvelles données au serveur

    if (!res.success) // Si la mise à jour échoue
      return toast({
        variant: 'destructive', // Affiche une notification d'erreur
        description: res.message,
      })

    const { data, message } = res // Récupère les nouvelles données et le message de réponse

    // Met à jour la session utilisateur avec le nouveau nom
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data.name,
      },
    }
    await update(newSession) // Met à jour la session côté client

    toast({
      description: message, // Affiche un message de succès
    })

    router.push('/account/manage') // Redirige l'utilisateur vers la page de gestion du compte
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)} // Gère la soumission du formulaire
        className="flex flex-col gap-6 p-8 rounded-xl bg-gradient-to-r from-[#f5f5f5] to-[#e8e3e1] shadow-lg"
      >
        <div className="flex flex-col gap-6">
          {/* Champ du nouveau nom */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold text-xl text-black">
                  Nouveau Nom
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez votre nouveau nom"
                    {...field} // Associe le champ à React Hook Form
                    className="input-field p-5 text-lg border-2 border-gray-300 focus:ring-2 focus:ring-[#A0522D] focus:outline-none transition-all duration-300 rounded-md"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-2" /> {/* Affiche un message d'erreur si nécessaire */}
              </FormItem>
            )}
          />
        </div>

        {/* Bouton de soumission */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting} // Désactive le bouton pendant l'envoi des données
          className="bg-gradient-to-r from-[#ae926f] to-[#8B5E3C] text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-md hover:from-[#C19A6B] hover:to-[#7E4C2A] transition-all duration-300 w-full"
        >
          {form.formState.isSubmitting ? 'Envoi en cours...' : 'Enregistrer les modifications'}
        </Button>
      </form>
    </Form>
  )
}