// Définir l'URL de base de l'API PayPal. Si l'URL est définie dans l'environnement (par exemple, pour la production), elle sera utilisée. Sinon, on utilise l'URL de sandbox (environnement de test).
const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com'

// Définir un objet `paypal` qui contient des méthodes permettant d'interagir avec l'API PayPal pour gérer les paiements.
export const paypal = {
  // Méthode pour créer une commande sur PayPal (ordre de paiement)
  createOrder: async function createOrder(price: number) {
    // 1. Appeler la fonction pour obtenir un token d'accès (qui permet d'authentifier les requêtes vers l'API PayPal)
    const accessToken = await generateAccessToken()

    // 2. Construire l'URL complète de l'API PayPal pour créer une commande.
    const url = `${base}/v2/checkout/orders`

    // 3. Envoyer une requête HTTP POST à PayPal pour créer une commande avec les informations nécessaires.
    const response = await fetch(url, {
      method: 'post', // Spécifier que la méthode est POST (création de données).
      headers: {
        'Content-Type': 'application/json', // Indiquer que les données envoyées sont au format JSON.
        Authorization: `Bearer ${accessToken}`, // Ajouter le token d'accès dans l'en-tête pour l'authentification.
      },
      body: JSON.stringify({
        intent: 'CAPTURE', // Intention de la commande, ici nous voulons capturer le paiement une fois qu'il est effectué.
        purchase_units: [
          {
            amount: {
              currency_code: 'USD', // La devise utilisée pour le paiement.
              value: price, // Le montant total du paiement.
            },
          },
        ],
      }),
    })

    // 4. Traiter la réponse de PayPal et la retourner.
    return handleResponse(response)
  },

  // Méthode pour capturer un paiement après qu'une commande a été créée
  capturePayment: async function capturePayment(orderId: string) {
    // 1. Appeler la fonction pour obtenir un token d'accès.
    const accessToken = await generateAccessToken()

    // 2. Construire l'URL complète pour capturer le paiement de la commande spécifiée par son `orderId`.
    const url = `${base}/v2/checkout/orders/${orderId}/capture`

    // 3. Envoyer une requête POST pour capturer le paiement de la commande.
    const response = await fetch(url, {
      method: 'post', // Méthode POST pour capturer le paiement.
      headers: {
        'Content-Type': 'application/json', // Indiquer que les données envoyées sont au format JSON.
        Authorization: `Bearer ${accessToken}`, // Ajouter le token d'accès dans l'en-tête pour l'authentification.
      },
    })

    // 4. Traiter la réponse de PayPal et la retourner.
    return handleResponse(response)
  },
}

// Fonction pour générer un token d'accès. Ce token est nécessaire pour authentifier les requêtes vers l'API PayPal.
async function generateAccessToken() {
  // 1. Récupérer les identifiants nécessaires pour l'authentification (Client ID et Secret) depuis les variables d'environnement.
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env

  // 2. Créer une chaîne encodée en base64 à partir du Client ID et du Secret pour l'authentification HTTP de base.
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_APP_SECRET).toString('base64')

  // 3. Effectuer une requête HTTP POST pour obtenir un token d'accès. On envoie les identifiants dans l'en-tête pour l'authentification.
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'post', // La méthode POST pour envoyer la demande d'obtention du token.
    body: 'grant_type=client_credentials', // Le type de demande : obtenir des credentials pour l'accès aux API.
    headers: {
      Authorization: `Basic ${auth}`, // Authentification de type Basic avec le Client ID et le Secret encodés en base64.
    },
  })

  // 4. Traiter la réponse pour obtenir le token d'accès et le retourner.
  const jsonData = await handleResponse(response)
  return jsonData.access_token
}

// Fonction pour traiter la réponse de l'API PayPal.
// Si la requête a réussi (statut 200 ou 201), la réponse est retournée en format JSON.
// Si la requête a échoué, un message d'erreur est levé.
async function handleResponse(response: any) {
  if (response.status === 200 || response.status === 201) {
    return response.json() // Si la réponse est réussie, retourner les données en format JSON.
  }

  // Si la requête échoue, on récupère le message d'erreur et on lance une exception.
  const errorMessage = await response.text() // Lire le message d'erreur renvoyé par PayPal.
  throw new Error(errorMessage) // Lever une exception avec le message d'erreur.
}
