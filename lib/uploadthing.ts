 // Importation des fonctions nécessaires pour générer le bouton de téléchargement et la zone de dépôt
import {
  generateUploadButton, // Cette fonction génère un bouton pour télécharger des fichiers
  generateUploadDropzone, // Cette fonction génère une zone de dépôt pour télécharger des fichiers en glissant-déposant
} from '@uploadthing/react'

// Importation du type spécifique 'OurFileRouter' qui définit la configuration des fichiers téléchargés
import type { OurFileRouter } from '@/app/api/uploadthing/core'

// Génération du bouton de téléchargement en utilisant la configuration de 'OurFileRouter'
// Ce bouton permettra à l'utilisateur de sélectionner et télécharger des fichiers
export const UploadButton = generateUploadButton<OurFileRouter>()

// Génération de la zone de dépôt pour télécharger des fichiers par glisser-déposer
// Cette zone permet aux utilisateurs de déposer des fichiers directement
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()
