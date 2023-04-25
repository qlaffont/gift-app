import { GiftListAccess } from '../services/types/prisma.type';
import enDict from './en';

const lng: typeof enDict = {
  navbar: {
    login: "S'inscrire/Se connecter",
    logout: 'Se déconnecter',
    profile: 'Mon profil ({{username}})',
    sourceCode: 'Code Source par Quentin Laffont',
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
    modules: {
      delete: {
        title: 'Delete',
        description: 'Are your sure your want to delete this item ?',
      },
      gift: {
        add: 'Créer un cadeau',
        edit: 'Modifier un cadeau',
        editBtn: 'Modifier',
        delete: 'Supprimer un cadeau',
        deleteDescription: 'Êtes-vous sûr que vous souhaitez supprimer ce cadeau ?',
        deleteBtn: 'Supprimer',
        takenTitle: 'Cadeau acheté',
        takenDescription: 'Êtes-vous sûr que vous avez acheté ce cadeau ?',
        takenAction: "Oui je l'ai acheté !",
        takenError: 'Ce cadeau est déjà acheté !',
        fields: {
          name: 'Nom',
          description: 'Description',
          link: 'Lien',
          coverUrl: 'Image de couverture',
          priority: 'Priorité',
        },
        priority: {
          high: 'Priorité haute',
          middle: 'Priorité moyenne',
          low: 'Priorité basse',
          nc: 'Aucune Priorité',
        },
        buyIt: 'Acheter',
        compare: 'Comparer',
        taken: "Je l'ai acheté !",
      },
      giftListAccess: {
        email: 'Adresse email',
      },
    },
  },
  enums: {
    GiftListAccess: {
      PASSWORD_PROTECTED: 'Liste protégée par mot de passe',
      EMAIL: 'Liste restreinte par e-mail',
      PUBLIC: 'Liste disponible publiquement',
    } as Record<GiftListAccess, string>,
  },
  pages: {
    home: {
      title: 'Créez votre liste de cadeaux facilement et partagez-la !',
      step1: {
        title: 'Créez votre compte',
        description: 'Créez votre compte pour pouvoir gérer votre liste de cadeaux',
      },
      step2: {
        title: 'Saisissez vos cadeaux',
        description:
          'Vous pouvez saisir des informations sur vos cadeaux. Vous pouvez également insérer un lien pour votre cadeau et nous remplissons automatiquement les informations.',
      },
      step3: {
        title: 'Partagez votre liste de cadeaux !',
        description:
          "Vous pouvez partager votre liste de cadeaux avec d'autres utilisateurs ! Ces utilisateurs pourront informer les autres qu'ils ont pris vos cadeaux.",
      },
    },
    termsAndConditions: {
      title: 'Termes et conditions',
      data: {
        title: 'Vos données',
        description:
          "Vos données ne seront pas vendues à d'autres plates-formes ou logiciels. Vos données vous appartiennent. Si vous devez fermer votre compte et supprimer vos données, vous pouvez contacter par email contact@qlaffont.com concernant https://gift.qlaffont.com",
      },
      google: {
        title: 'Compte Google',
        description: "Votre compte Google n'est utilisé que pour l'authentification.",
      },
      discord: {
        title: 'Compte Discord',
        description: "Votre compte Discord est uniquement utilisé pour l'authentification.",
      },
      privacyPolicy: 'Politique de Confidentialité',
    },
    auth: {
      login: {
        title: 'Connexion',
        google: 'Connectez-vous avec Google',
        discord: 'Connectez-vous avec Discord',
      },
    },
    profile: {
      seo: 'Liste de cadeau de {{username}}',
      share: 'Partager',
      info: 'Informations',
      shareMessage: 'Voici ma liste de cadeau !',
      edit: {
        editAction: 'Modifier',
        editTitle: 'Modifier le profil',
        name: 'Nom du profil',
        description: 'Description',
      },
      giftList: {
        add: 'Créer une liste de cadeaux',
        edit: 'Modifier une liste de cadeaux',
        editBtn: 'Modifier',
        delete: 'Supprimer une liste de cadeaux',
        deleteDescription: 'Êtes-vous sûr que vous souhaitez supprimer cette liste de cadeaux ?',
        deleteBtn: 'Supprimer',
        accessBtn: 'Accès',
        cleanTaken: 'Supprimer les cadeaux achetés',
        cleanTakenDescription: 'Êtes-vous sûr que vous souhaitez nettoyer les cadeaux achetés ?',
        fields: {
          name: 'Nom',
          description: 'Description',
          resetTakenWhen: 'Réinitialiser les cadeaux pris',
          access: 'Mode de publication',
          password: 'Mot de passe',
        },
        passwordInvalid: 'Ce mot de passe est invalid.',
        accessOrEmpty: 'Cette liste ne contient aucun cadeau ou ne vous est pas accessible.',
      },
      instructions: {
        title: 'Instructions',
        isConnected: 'Vous devez être connecté pour indiquer aux autres utilisateurs que vous avez pris vos cadeaux.',
        priority: "Chaque cadeau est classé par priorité ! Assurez-vous de le vérifier avant de l'acheter.",
        compare:
          'En cliquant sur un cadeau, vous pourrez accéder aux informations des cadeaux et vous serez en mesure de comparer le prix entre de nombreux vendeurs.',
        taken:
          'Lorsque vous avez acheté un cadeau, il vous suffit de retourner sur ce site Web pour indiquer que vous avez pris le cadeau !',
        understand: "J'ai compris !",
      },
    },
  },
  yup: {
    mixed: {
      default: 'Ce champ est invalid.',
      required: 'Ce champ doit être rempli',
      oneOf: 'Ce champ doit contenir une de ces valeurs {{values}}.',
      notOneOf: 'Ce champ ne doit pas contenir une de ces valeurs {{values}}.',
      defined: 'Ce champ doit être défini.',
    },
    string: {
      default: 'Ce champ est invalid.',
      required: 'Ce champ doit être rempli',
      length: 'Ce champ doit faire {{length}} caractères.',
      min: 'Ce champ doit faire au minimum {{min}} caractères.',
      max: 'Ce champ doit faire au maximum {{max}} caractères.',
      matches: 'Ce champ doit respecter la regex ({{regex}}).',
      email: "L'adresse email renseignée n'est pas valide.",
      url: 'Ce champ doit contenir une url valide. (Commençant par http:// ou https://).',
      uuid: 'Ce champ doit être un UUID valid.',
      trim: "Ce champ doit être trimmé (pas d'espace avant ou après).",
      lowercase: 'Ce champ doit être en minuscule.',
      uppercase: 'Ce champ doit être en majuscule.',
    },
    number: {
      min: 'Ce champ doit être plus grand ou égal à {{min}}.',
      max: 'Ce champ doit être plus petit ou égal à {{max}}.',
      lessThan: 'Ce champ doit être plus petit que {{less}}.',
      moreThan: 'Ce champ doit être plus petit que {{more}}.',
      positive: 'Ce champ doit être un nombre positif.',
      negative: 'Ce champ doit être un nombre négatif.',
      integer: 'Ce champ doit être un nombre entier.',
    },
    date: {
      min: 'Ce champ doit contenir une date après le {{min}}.',
      max: 'Ce champ doit contenir une date avant le {{max}}.',
      dateAfterPreviousValue: 'Ce champ doit contenir une date qui se passe après la date précédente.',
    },
    boolean: {
      isValue: 'Ce champ doit avoir la valeur {{value}}.',
    },
    object: {
      noUnkown: 'Ce champ contient des clés inconnus.',
    },
    array: {
      min: 'Ce champ doit contenir au minimum {{min}} élément(s).',
      max: 'Ce champ doit contenir au maximum {{max}} élément(s).',
      length: 'Ce champ doit contenir {{length}} élément(s).',
    },
  },
};

export default lng;
