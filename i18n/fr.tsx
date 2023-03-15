import enDict from './en';

const lng: typeof enDict = {
  navbar: {
    login: "S'inscrire/Se connecter",
    logout: 'Se déconnecter',
    profile: 'Mon profil ({{username}})',
  },
  components: {
    form: {
      save: 'Envoyer',
      add: 'Ajouter',
      delete: 'Supprimer',
      cancel: 'Annuler',
      confirm: 'Confimer',
      search: 'Rechercher',
    },
    atoms: {
      alert: {
        wip: 'Cette fonctionalité est en cours de développement !',
        info: 'Info',
        error: 'Erreur',
        success: 'Succès',
        changesSaved: 'Les modifications ont été sauvegardées.',
        errorTryLater: 'Une erreur est survenue. Veuillez réessayer plus tard !',
        copied: 'Le texte a été copié !',
        close: 'Fermer',
        back: 'Retour',
        next: 'Suivant',
      },
      select: {
        noOptions: 'Aucun élement',
        loading: 'Chargement',
      },
    },
  },
  pages: {
    home: {
      hello: 'Bienvenue tout le monde !',
    },
    auth: {
      login: {
        title: 'Connexion',
        google: 'Connectez-vous avec Google',
        discord: 'Connectez-vous avec Discord',
      },
    },
    profile: {
      share: 'Partager',
      shareMessage: 'Voici ma liste de cadeau !',
    },
  },
};

export default lng;
