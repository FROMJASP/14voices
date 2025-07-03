import nlTranslations from '../translations/nl.json' with { type: 'json' };
import enTranslations from '../translations/en.json' with { type: 'json' };

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
        'authentication:otherSettings': 'Andere instellingen',
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
        'general:payloadSettings': 'Andere instellingen',
      },
    },
    en: {
      label: 'English',
      translations: {
        ...enTranslations,
        'authentication:otherSettings': 'Other Settings',
        'general:payloadSettings': 'Other Settings',
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
