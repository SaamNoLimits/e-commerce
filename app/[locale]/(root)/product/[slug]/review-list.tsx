'use client' // Indique que ce fichier est un composant client dans Next.js, utilisant des hooks React.

import { zodResolver } from '@hookform/resolvers/zod' // Importation de zodResolver pour valider les formulaires avec Zod.
import { StarIcon as Star } from 'lucide-react' // Importation de l'icône étoile.
import { Calendar, Check, StarIcon, User } from 'lucide-react' // Importation d'autres icônes nécessaires.
import Link from 'next/link' // Importation du composant Link de Next.js pour la navigation.
import { useEffect, useState } from 'react' // Importation de hooks React.
import { SubmitHandler, useForm } from 'react-hook-form' // Importation de react-hook-form pour la gestion des formulaires.
import { useInView } from 'react-intersection-observer' // Hook permettant de détecter si un élément est visible dans la fenêtre.
import { z } from 'zod' // Importation de Zod pour la validation de données.
import { useTranslations } from 'next-intl' // Utilisation de la bibliothèque de traduction pour Next.js.

import Rating from '@/components/shared/product/rating' // Importation du composant Rating personnalisé.
import { Button } from '@/components/ui/button' // Importation du composant Button personnalisé.
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card' // Importation des composants liés aux cartes.
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog' // Importation des composants de dialog.
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form' // Importation des composants de formulaire.
import { Input } from '@/components/ui/input' // Importation du composant Input personnalisé.
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select' // Importation des composants Select pour les listes déroulantes.
import { Textarea } from '@/components/ui/textarea' // Importation du composant Textarea.
import { useToast } from '@/hooks/use-toast' // Hook personnalisé pour afficher des notifications Toast.
import {
  createUpdateReview,
  getReviewByProductId,
  getReviews,
} from '@/lib/actions/review.actions' // Fonctions pour la gestion des avis.
import { ReviewInputSchema } from '@/lib/validator' // Importation du schéma de validation Zod pour les avis.
import RatingSummary from '@/components/shared/product/rating-summary' // Importation d'un résumé d'évaluation.
import { IProduct } from '@/lib/db/models/product.model' // Définition du modèle de produit.
import { Separator } from '@/components/ui/separator' // Importation du composant séparateur.
import { IReviewDetails } from '@/types' // Définition des types d'avis.

const reviewFormDefaultValues = { // Définition des valeurs par défaut pour le formulaire d'avis.
  title: '',
  comment: '',
  rating: 0,
}

export default function ReviewList({ // Fonction principale pour afficher la liste des avis et gérer les formulaires.
  userId,
  product,
}: {
  userId: string | undefined
  product: IProduct
}) {
  const t = useTranslations('Product') // Initialisation du hook de traduction pour le produit.
  const [page, setPage] = useState(2) // État pour la pagination des avis (page actuelle).
  const [totalPages, setTotalPages] = useState(0) // État pour le nombre total de pages d'avis.
  const [reviews, setReviews] = useState<IReviewDetails[]>([]) // État pour stocker les avis du produit.
  const { ref, inView } = useInView({ triggerOnce: true }) // Hook pour détecter si l'élément de la liste des avis est visible.
  
  const reload = async () => { // Fonction pour recharger les avis du produit à la première page.
    try {
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data]) // Mettez à jour les avis affichés.
      setTotalPages(res.totalPages) // Mettez à jour le nombre total de pages d'avis.
    } catch (err) {
      toast({
        variant: 'destructive', // Affiche un message d'erreur en cas de problème lors de la récupération des avis.
        description: t('Error in fetching reviews'),
      })
    }
  }

  const loadMoreReviews = async () => { // Fonction pour charger plus d'avis lorsqu'on atteint la fin de la page.
    if (totalPages !== 0 && page > totalPages) return // Empêche le chargement si on a déjà chargé toutes les pages.
    setLoadingReviews(true) // Indiquer que le chargement est en cours.
    const res = await getReviews({ productId: product._id, page })
    setLoadingReviews(false) // Indiquer que le chargement est terminé.
    setReviews([...reviews, ...res.data]) // Ajouter les nouveaux avis à la liste existante.
    setTotalPages(res.totalPages) // Mettre à jour le nombre total de pages d'avis.
    setPage(page + 1) // Incrémenter la page pour charger les prochaines données.
  }

  const [loadingReviews, setLoadingReviews] = useState(false) // État pour suivre si les avis sont en cours de chargement.

  useEffect(() => { // Effet qui se déclenche lorsque l'élément devient visible (utilise le hook useInView).
    const loadReviews = async () => { // Fonction pour charger les avis à partir de la première page.
      setLoadingReviews(true) // Mettre l'état de chargement à true.
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data]) // Mettez à jour la liste des avis.
      setTotalPages(res.totalPages) // Mettez à jour le nombre total de pages.
      setLoadingReviews(false) // Mettre l'état de chargement à false.
    }

    if (inView) { // Si l'élément est visible dans la fenêtre.
      loadReviews() // Charger les avis.
    }
  }, [inView]) // Le tableau de dépendances s'assure que le hook se déclenche à chaque fois que inView change.

  type CustomerReview = z.infer<typeof ReviewInputSchema> // Définition du type des données du formulaire d'avis en fonction du schéma Zod.
  
  const form = useForm<CustomerReview>({ // Initialisation du formulaire avec les valeurs par défaut et la validation Zod.
    resolver: zodResolver(ReviewInputSchema), // Utilisation du schéma de validation Zod.
    defaultValues: reviewFormDefaultValues, // Initialisation avec les valeurs par défaut.
  })
  
  const [open, setOpen] = useState(false) // État pour gérer l'ouverture du formulaire d'avis.
  const { toast } = useToast() // Initialisation du hook Toast pour afficher des notifications.
  
  const onSubmit: SubmitHandler<CustomerReview> = async (values) => { // Fonction appelée lors de la soumission du formulaire.
    const res = await createUpdateReview({
      data: { ...values, product: product._id }, // Envoi des données du formulaire pour créer ou mettre à jour un avis.
      path: `/product/${product.slug}`, // Chemin pour rediriger après la soumission.
    })
    if (!res.success) // Si la soumission échoue, afficher un message d'erreur.
      return toast({
        variant: 'destructive', // Notification d'erreur.
        description: res.message,
      })
    setOpen(false) // Fermer le formulaire après soumission.
    reload() // Recharger les avis pour afficher la nouvelle soumission.
    toast({ // Afficher un message de succès.
      description: res.message,
    })
  }

  const handleOpenForm = async () => { // Fonction pour ouvrir le formulaire de révision et préremplir les valeurs si une révision existe déjà.
    form.setValue('product', product._id) // Définir l'ID du produit.
    form.setValue('user', userId!) // Définir l'ID de l'utilisateur.
    form.setValue('isVerifiedPurchase', true) // Indiquer que l'achat est vérifié.
    const review = await getReviewByProductId({ productId: product._id }) // Vérifier si un avis existe déjà pour ce produit.
    if (review) { // Si un avis existe, préremplir le formulaire avec les données de l'avis existant.
      form.setValue('title', review.title)
      form.setValue('comment', review.comment)
      form.setValue('rating', review.rating)
    }
    setOpen(true) // Ouvrir le formulaire.
  }

  return (
    <div className='space-y-2'> 
      {reviews.length === 0 && <div>{t('No reviews yet')}</div>}  

      <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
        <div className='flex flex-col gap-2'>
          {reviews.length !== 0 && (
            <div className="flex items-center gap-2">
              <Rating rating={product.avgRating} /> {/* Afficher la note moyenne du produit */}
              <span>{product.numReviews} {t('reviews')}</span> {/* Afficher le nombre d'avis */}
            </div>
          )}

          <Separator className='my-3' />
          <div className='space-y-3'>
            <h3 className='font-bold text-lg lg:text-xl'>
              {t('Review this product')} {/* Titre pour écrire un avis */}
            </h3>
            <p className='text-sm'>
              {t('Share your thoughts with other customers')} {/* Sous-titre pour inciter les utilisateurs à partager un avis */}
            </p>
            {userId ? (
              <Dialog open={open} onOpenChange={setOpen}> {/* Boîte de dialogue pour soumettre un avis */}
                <Button
                  onClick={handleOpenForm}
                  variant='outline'
                  className='rounded-full w-full bg-gradient-to-r from-[#87613f] to-[#b27a5c] text-white shadow-lg hover:shadow-xl transition-shadow duration-300'
                >
                  {t('Write a customer review')}
                </Button>

                <DialogContent className='sm:max-w-[425px] shadow-2xl shadow-brown-200'>
                  <Form {...form}>
                    <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
                      <DialogHeader>
                        <DialogTitle>{t('Write a customer review')}</DialogTitle>
                        <DialogDescription>
                          {t('Share your thoughts with other customers')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className='grid gap-4 py-4'>
                        <div className='flex flex-col gap-5'>
                          <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>{t('Title')}</FormLabel>
                                <FormControl>
                                  <Input placeholder={t('Enter title')} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='comment'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>{t('Comment')}</FormLabel>
                                <FormControl>
                                  <Textarea placeholder={t('Enter comment')} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name='rating'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('Rating')}</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('Select a rating')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                      <SelectItem key={index} value={(index + 1).toString()}>
                                        <div className='flex items-center gap-1'>
                                          {index + 1}{' '}
                                          <StarIcon className='h-6 w-6 bg-gradient-to-r from-[#87613f] to-[#ab795d] text-transparent bg-clip-text shadow-lg shadow-brown-200' />
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type='submit'
                          disabled={loadingReviews}
                          className='w-full bg-gradient-to-r from-[#87613f] to-[#b27a5c] text-white'
                        >
                          {loadingReviews ? t('Submitting...') : t('Submit')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            ) : (
              <Link href='/login' className='underline text-sm'>
                {t('Login to write a review')}
              </Link>
            )}
          </div>
        </div>
        <div className='space-y-6 md:col-span-3'>
          {reviews?.map((review) => (
            <Card key={review._id}>
              <CardHeader className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  <div>
                    <div className='font-medium'>{review.user.name}</div>
                    <div className='text-sm'>{review.createdAt}</div>
                  </div>
                </div>
                <Rating rating={review.rating} />
              </CardHeader>
              <CardContent>
                <CardTitle>{review.title}</CardTitle>
                <CardDescription>{review.comment}</CardDescription>
              </CardContent>
            </Card>
          ))}
          <div ref={ref}>
            {loadingReviews && <div>{t('Loading reviews...')}</div>}
            {reviews.length === 0 && !loadingReviews && (
              <div>{t('No reviews yet')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}   