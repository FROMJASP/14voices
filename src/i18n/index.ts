import nlTranslations from '../translations/nl.json';
import enTranslations from '../translations/en.json';

export const i18n = {
  supportedLanguages: {
    nl: {
      label: 'Nederlands',
      translations: {
        ...nlTranslations,
        'authentication:account': 'Account',
        'authentication:accountOfCurrentUser': 'Account van huidige gebruiker',
        'authentication:alreadyActivated': 'Al geactiveerd',
        'authentication:alreadyLoggedIn': 'Al ingelogd',
        'authentication:apiKey': 'API Sleutel',
        'authentication:areYouSure': 'Weet u het zeker?',
        'authentication:backToLogin': 'Terug naar inloggen',
        'authentication:beginCreateFirstUser': 'Om te beginnen, maak uw eerste gebruiker aan.',
        'authentication:changePassword': 'Wachtwoord wijzigen',
        'authentication:checkYourEmailForPasswordReset':
          'Controleer uw e-mail voor een link om uw wachtwoord te resetten.',
        'authentication:confirmGeneration': 'Bevestig generatie',
        'authentication:confirmPassword': 'Bevestig wachtwoord',
        'authentication:createFirstUser': 'Eerste gebruiker aanmaken',
        'authentication:emailNotValid': 'Het opgegeven e-mailadres is niet geldig.',
        'authentication:emailSent': 'E-mail verzonden',
        'authentication:emailSentWithRecoveryLink': 'E-mail verzonden met herstelkoppeling',
        'authentication:enableAPIKey': 'API Sleutel inschakelen',
        'authentication:failedToUnlock': 'Ontgrendelen mislukt',
        'authentication:forceUnlock': 'Forceer ontgrendeling',
        'authentication:forgotPassword': 'Wachtwoord vergeten',
        'authentication:forgotPasswordEmailInstructions':
          'Voer uw e-mailadres hieronder in en wij sturen u instructies om uw wachtwoord te resetten.',
        'authentication:forgotPasswordQuestion': 'Wachtwoord vergeten?',
        'authentication:generate': 'Genereren',
        'authentication:generateNewAPIKey': 'Nieuwe API sleutel genereren',
        'authentication:generatingNewAPIKeyWillInvalidate':
          'Het genereren van een nieuwe API sleutel zal alle bestaande API sleutels <1>ongeldig maken</1>. Weet u het zeker?',
        'authentication:lockUntil': 'Vergrendelen tot',
        'authentication:loggedIn': 'U bent nu ingelogd.',
        'authentication:loggedInChangePassword':
          'U bent nu ingelogd. Om uw wachtwoord te wijzigen, ga naar uw <0>Account</0> en bewerk uw wachtwoord daar.',
        'authentication:loggedOut': 'U bent nu uitgelogd.',
        'authentication:login': 'Inloggen',
        'authentication:loginAttempts': 'Inlogpogingen',
        'authentication:loginUser': 'Gebruiker inloggen',
        'authentication:loginWithAnotherUser':
          'Om als andere gebruiker in te loggen, moet u eerst <0>uitloggen</0>.',
        'authentication:logout': 'Uitloggen',
        'authentication:logoutUser': 'Gebruiker uitloggen',
        'authentication:manage': 'Beheren',
        'authentication:newAccountCreated': 'Nieuw account aangemaakt voor <1>{{userEmail}}</1>',
        'authentication:newAPIKeyGenerated': 'Nieuwe API sleutel gegenereerd.',
        'authentication:newPassword': 'Nieuw wachtwoord',
        'authentication:otherSettings': 'CMS Instellingen',
        'authentication:password': 'Wachtwoord',
        'authentication:resetPassword': 'Wachtwoord resetten',
        'authentication:resetPasswordExpired': 'Wachtwoord reset verlopen',
        'authentication:resetPasswordToken': 'Wachtwoord reset token',
        'authentication:resetYourPassword': 'Reset uw wachtwoord',
        'authentication:stayLoggedIn': 'Ingelogd blijven',
        'authentication:successfullyUnlocked': 'Succesvol ontgrendeld',
        'authentication:unableToVerify': 'Kan niet verifiëren',
        'authentication:username': 'Gebruikersnaam',
        'authentication:usernameNotValid': 'De opgegeven gebruikersnaam is niet geldig.',
        'authentication:verified': 'Geverifieerd',
        'authentication:verify': 'Verifiëren',
        'authentication:verifyUser': 'Gebruiker verifiëren',
        'authentication:youAreInactive': 'U bent inactief en wordt binnenkort uitgelogd.',
        'authentication:youAreReceivingResetPassword':
          'U ontvangt dit omdat u (of iemand anders) een reset van het wachtwoord voor uw account heeft aangevraagd. Klik op de onderstaande link, of plak deze in uw browser om het proces te voltooien:',
        'authentication:youDidNotRequestPassword':
          'Als u dit niet heeft aangevraagd, negeer dan deze e-mail en uw wachtwoord blijft ongewijzigd.',
        'fields:addLabel': 'Label toevoegen',
        'fields:block': 'Blok',
        'fields:blocks': 'Blokken',
        'fields:blockType': 'Blok Type',
        'fields:language': 'Taal',
        'general:account': 'Account',
        'general:logout': 'Uitloggen',
        'general:payloadSettings': 'CMS Instellingen',
        'general:cmsSettings': 'CMS Instellingen',
        'collections:groups:noResults':
          'Geen groepen gevonden of er bestaat geen groep met de hierboven gespecificeerde filters.',
        'general:createNew': 'Nieuwe {{label}} aanmaken',
        // Admin group translations
        'admin.group:beheerStemmen': 'Beheer Stemmen',
        'admin.group:accountManagement': 'Accountbeheer',
        'admin.group:opslag': 'Opslag',
        'admin.group:siteBuilder': 'Site Builder',
        'admin.group:orders': 'Bestellingen',
        'admin.group:editForms': 'Formulieren Bewerken',
        'admin.group:emailSystem': 'Email Systeem',
        'admin.group:system': 'Systeem',
      },
    },
    en: {
      label: 'English',
      translations: {
        ...enTranslations,
        'authentication:otherSettings': 'CMS Settings',
        'general:payloadSettings': 'CMS Settings',
        'general:cmsSettings': 'CMS Settings',
        'collections:groups:noResults':
          'No groups found or there does not exist a group based on the filters specified above.',
        'general:createNew': 'Create new {{label}}',
        // Admin group translations
        'admin.group:beheerStemmen': 'Manage Voices',
        'admin.group:accountManagement': 'Account Management',
        'admin.group:opslag': 'Storage',
        'admin.group:siteBuilder': 'Site Builder',
        'admin.group:orders': 'Orders',
        'admin.group:editForms': 'Edit Forms',
        'admin.group:emailSystem': 'Email System',
        'admin.group:system': 'System',
      },
    },
  },
  defaultLanguage: 'nl',
};

// Helper function to get translated labels for collections
export function getCollectionLabels(collection: string) {
  return {
    singular: {
      nl:
        nlTranslations.collections[collection as keyof typeof nlTranslations.collections]
          ?.singular || collection,
      en:
        enTranslations.collections[collection as keyof typeof enTranslations.collections]
          ?.singular || collection,
    },
    plural: {
      nl:
        nlTranslations.collections[collection as keyof typeof nlTranslations.collections]?.plural ||
        collection,
      en:
        enTranslations.collections[collection as keyof typeof enTranslations.collections]?.plural ||
        collection,
    },
  };
}

// Helper function to get translated field labels
export function getFieldLabel(field: string) {
  return {
    nl: nlTranslations.fields[field as keyof typeof nlTranslations.fields] || field,
    en: enTranslations.fields[field as keyof typeof enTranslations.fields] || field,
  };
}

// Helper function to get translated group labels
export function getGroupLabel(group: string) {
  return {
    nl: nlTranslations.groups[group as keyof typeof nlTranslations.groups] || group,
    en: enTranslations.groups[group as keyof typeof enTranslations.groups] || group,
  };
}

// Helper function to get FAQ-specific field labels
export function getFAQFieldLabel(field: string) {
  return {
    nl: nlTranslations.faq?.fields?.[field as keyof typeof nlTranslations.faq.fields] || field,
    en: enTranslations.faq?.fields?.[field as keyof typeof enTranslations.faq.fields] || field,
  };
}

// Helper function to get FAQ-specific field descriptions
export function getFAQFieldDescription(field: string) {
  return {
    nl:
      nlTranslations.faq?.descriptions?.[field as keyof typeof nlTranslations.faq.descriptions] ||
      '',
    en:
      enTranslations.faq?.descriptions?.[field as keyof typeof enTranslations.faq.descriptions] ||
      '',
  };
}

// Helper function to get FAQ category labels
export function getFAQCategoryLabel(category: string) {
  return {
    nl:
      nlTranslations.faq?.categories?.[category as keyof typeof nlTranslations.faq.categories] ||
      category,
    en:
      enTranslations.faq?.categories?.[category as keyof typeof enTranslations.faq.categories] ||
      category,
  };
}
