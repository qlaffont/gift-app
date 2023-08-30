import { GiftListAccess } from '../services/types/prisma.type';

const lng = {
  navbar: {
    login: 'Signup/Login',
    logout: 'Logout',
    profile: 'My Profile ({{username}})',
    sourceCode: 'Source Code by Quentin Laffont',
  },
  components: {
    form: {
      save: 'Send',
      add: 'Add',
      delete: 'Delete',
      cancel: 'Cancel',
      confirm: 'Confirm',
      search: 'Search',
    },
    atoms: {
      alert: {
        wip: 'This feature is under development !',
        info: 'Info',
        error: 'Error',
        success: 'Success',
        changesSaved: 'Changes have been saved.',
        errorTryLater: 'An error has occurred. Please try again later !',
        copied: 'The text has been copied !',
        close: 'Close',
        back: 'Back',
        next: 'Next',
      },
      select: {
        noOptions: 'No element',
        loading: 'Loading',
      },
    },
    modules: {
      delete: {
        title: 'Delete',
        description: 'Are you sure your want to delete this item ?',
      },
      gift: {
        add: 'Create a gift',
        edit: 'Edit a gift',
        editBtn: 'Edit',
        delete: 'Delete a gift',
        deleteDescription: 'Are you sure your want to delete this gift ?',
        deleteBtn: 'Delete',
        takenTitle: 'Gift purchased',
        takenDescription: 'Are you sure you bought this gift ?',
        takenAction: 'Yes I bought it !',
        takenError: 'This gift is already bought !',
        fields: {
          name: 'Name',
          description: 'Description',
          link: 'Link',
          coverUrl: 'Cover Url',
          priority: 'Priority',
        },
        priority: {
          high: 'High priority',
          middle: 'Middle priority',
          low: 'Low priority',
          nc: 'No priority ',
        },
        buyIt: 'Buy',
        compare: 'Compare',
        taken: 'I bought it !',
      },
      giftListAccess: {
        email: 'Email Address',
      },
    },
  },
  enums: {
    GiftListAccess: {
      PASSWORD_PROTECTED: 'List protected by password',
      EMAIL: 'List restricted by email',
      PUBLIC: 'List available in public',
    } as Record<GiftListAccess, string>,
  },
  pages: {
    auth: {
      login: {
        title: 'Login',
        google: 'Login with Google',
        discord: 'Login with Discord',
      },
    },
    termsAndConditions: {
      title: 'Privacy policy / Legal notices / CGU ',
      data: {
        title: 'Your Data',
        description:
          'Your data will not be sell to others platforms or softwares. Your data still belong to you. If you need to close your account and remove your data you can contact by mail at contact@qlaffont.com regarding https://gift.qlaffont.com',
      },
      google: {
        title: 'Google account',
        description:
          'Your Google account is only use for authentication. Your FirstName / LastName is used to pre-fill your username. These informations are crypted to respect RGPD law.',
      },
      discord: {
        title: 'Discord account',
        description:
          'Your Discord account is only use for authentication. Your username is used to pre-fill your username. These informations are crypted to respect RGPD law.',
      },
      privacyPolicy: 'Privacy Policy',
    },
    home: {
      title: 'Create your gift list easely and share it !',
      step1: {
        title: 'Create your account',
        description: 'Create your account to be able to manage your gift list',
      },
      step2: {
        title: 'Insert yours gifts',
        description:
          'You can enter informations about your gifts. You can also insert a link for your gift and automatically we fill informations.',
      },
      step3: {
        title: 'Share your gift list !',
        description:
          'You can share your gift list with others users ! These users will be able to inform others that they have taken your gifts.',
      },
    },
    profile: {
      seo: 'Gift list of {{username}}',
      share: 'Share',
      info: 'Informations',
      shareMessage: 'This is my gift list !',
      giftList: {
        add: 'Create a gift list',
        edit: 'Edit a gift list',
        editBtn: 'Edit',
        delete: 'Delete a gift list',
        deleteDescription: 'Are you sure your want to delete this gift list ?',
        deleteBtn: 'Delete',
        accessBtn: 'Access',
        cleanTaken: 'Remove taken gifts',
        seeMore: 'See more',
        cleanTakenDescription: 'Are you sure your want to clean already boughts gifts ?',
        fields: {
          name: 'Name',
          description: 'Description',
          resetTakenWhen: 'Reset gifts taken',
          access: 'Publication Mode',
          password: 'Password',
        },
        passwordInvalid: 'Ce mot de passe est invalid.',
        accessOrEmpty: "This list doesn't contain any gift or you don't have an access on it.",
      },
      edit: {
        editAction: 'Edit',
        editTitle: 'Edit profile',
        name: 'Profile name',
        description: 'Description',
      },
      instructions: {
        title: 'Instructions',
        isConnected: 'You need to be connected to indicate to others users that you have taken your gift(s).',
        priority: 'Each gift is ranked by prority ! Be sure to check it before you buy it.',
        compare:
          'By clicking on a gift, you will be able to access gift informations and able to compare price between many sellers.',
        taken:
          'When you have bought a gift, you just need to go back to this website to indicate that you have taken the gift !',
        understand: 'I understand !',
      },
    },
  },
  yup: {
    mixed: {
      default: 'This field is not valid.',
      required: 'This field is required.',
      oneOf: 'This field need to be one of {{values}}.',
      notOneOf: 'This field need to not be one of {{values}}.',
      defined: 'This field need to be defined.',
    },
    string: {
      default: 'This field is not valid.',
      required: 'This field is required.',
      length: 'This field need to have a length of {{length}}.',
      min: 'This field need to have a minimum length of {{min}}.',
      max: 'This field need to have a maximum length of {{max}}.',
      matches: 'This field need to respect regex ({{regex}}).',
      email: 'This field need to be a valid email address.',
      url: 'This field need to be a valid URL. (Starting with http:// or https://).',
      uuid: 'This field need to be a valid UUID.',
      trim: 'This field need to be trimmed (no space before or after content).',
      lowercase: 'This field need to be in lowercase.',
      uppercase: 'This field need to be in uppercase.',
    },
    number: {
      min: 'This field need to have a minimum value of {{min}}.',
      max: 'This field need to have a maximum value of {{max}}.',
      lessThan: 'This field need to be less or equal to {{less}}.',
      moreThan: 'This field need to be greater or equal to {{more}}.',
      positive: 'This field need to be a positive number.',
      negative: 'This field need to be a negative number.',
      integer: 'This field need to be an integer.',
    },
    date: {
      min: 'This field need to contain a date before {{min}}.',
      max: 'This field need to contain a date after {{max}}.',
      dateAfterPreviousValue: 'This field need to contain a date before the previous value.',
    },
    boolean: {
      isValue: 'This field need to have the value of {{value}}.',
    },
    object: {
      noUnkown: 'This field contain some unkown keys.',
    },
    array: {
      min: 'This field need to contain at least {{min}} item(s).',
      max: 'This field need to contain at most {{max}} item(s).',
      length: 'This field need to contain {{length}} item(s).',
    },
  },
};

export default lng;
