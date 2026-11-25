export type Language = 'fr' | 'en' | 'ar';

export type PlanInquiryId =
  | 'trial-7d'
  | 'standard'
  | 'pro'
  | 'entreprise'
  | 'soko-mungu'
  | 'mungu-ai'
  | 'engineering'
  | 'other';

export interface TranslationContent {
  meta: {
    pageTitle: string;
    pageDescription: string;
  };
  a11y: {
    skipToContent: string;
    primaryNav: string;
    mobileNav: string;
    languageSelector: string;
    footerNav: string;
  };
  nav: {
    accueil: string;
    piecesPro: string;
    sokoMungu: string;
    munguAi: string;
    operations: string;
    solutions: string;
    tarifs: string;
    contact: string;
    menuOpen: string;
    menuClose: string;
  };
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    ctaTrial: string;
    ctaContact: string;
    ctaWhatsapp: string;
    whatsappGreeting: string;
    imageAlt: string;
    pillars: {
      title: string;
      description: string;
      href: string;
    }[];
  };
  piecesPro: {
    kicker: string;
    title: string;
    subtitle: string;
    description: string;
    trialHighlightTitle: string;
    trialHighlightBody: string;
    ctaStartTrial: string;
    ctaSubscribe: string;
    ctaWhatsappTrial: string;
    whatsappTrialMessage: string;
    features: {
      title: string;
      detail: string;
    }[];
    preview: {
      appTitle: string;
      subtitleLabel: string;
      tabs: {
        dashboard: string;
        inventory: string;
        pos: string;
        installments: string;
      };
      collectedLabel: string;
      overdueLabel: string;
      unitsLabel: string;
      receivablesLabel: string;
      searchPlaceholder: string;
      costLabel: string;
      cashLabel: string;
      creditLabel: string;
      qtyLabel: string;
      dueDateLabel: string;
      paidLabel: string;
      remainingLabel: string;
      recordPaymentBtn: string;
      settledLabel: string;
      posSelectPrompt: string;
      posRecordSaleBtn: string;
      posSaleConfirmed: string;
      statusOnTime: string;
      statusLatePrefix: string;
      statusDaysUnit: string;
      statusRisk: string;
      addItemBtn: string;
      cancelBtn: string;
      saveItemBtn: string;
      itemNamePlaceholder: string;
      emptyInventory: string;
      footerNote: string;
    };
  };
  sokoMungu: {
    kicker: string;
    title: string;
    subtitle: string;
    description: string;
    noticeTitle: string;
    noticeBody: string;
    imageAlt: string;
    roadmapTitle: string;
    roadmapItems: {
      number: string;
      title: string;
      detail: string;
    }[];
    ctaInterest: string;
  };
  munguAi: {
    kicker: string;
    title: string;
    subtitle: string;
    description: string;
    disclaimerTitle: string;
    disclaimerBody: string;
    imageAlt: string;
    capabilities: {
      number: string;
      title: string;
      detail: string;
    }[];
    ctaOpenAssistant: string;
    ctaAskWhatsapp: string;
  };
  agentCalculator: {
    kicker: string;
    title: string;
    subtitle: string;
    tasksLabel: string;
    tasksUnit: string;
    timeLabel: string;
    timeUnit: string;
    rateLabel: string;
    rateUnit: string;
    calculateBtn: string;
    resetBtn: string;
    resultsTitle: string;
    weeklyHoursLabel: string;
    hoursShortUnit: string;
    monthlySavingsLabel: string;
    efficiencyBoostLabel: string;
    annualRoiLabel: string;
    assumptionNote: string;
    deployCta: string;
    askTeamCta: string;
  };
  operations: {
    kicker: string;
    title: string;
    subtitle: string;
    adminToggleBtn: string;
    auth: {
      signInBtn: string;
      signingInBtn: string;
      signOutBtn: string;
      signedInAsLabel: string;
      adminVerifiedLabel: string;
      signInRequiredTitle: string;
      signInRequiredBody: string;
      unverifiedEmailError: string;
      authErrorGeneric: string;
    };
    adminPanel: {
      title: string;
      subtitle: string;
      restrictedTitle: string;
      restrictedBody: string;
      totalOrdersLabel: string;
      activeDriversLabel: string;
      estimatedRevenueLabel: string;
      commissionNote: string;
      tableCustomer: string;
      tableDetails: string;
      tableStatus: string;
      tableDate: string;
      tableActions: string;
      emptyTable: string;
      completeAction: string;
      cancelAction: string;
    };
    orders: {
      title: string;
      subtitle: string;
      customerPlaceholder: string;
      detailsPlaceholder: string;
      publishBtn: string;
      publishingBtn: string;
      validationError: string;
      createdFeedback: string;
      acceptBtn: string;
      completeBtn: string;
      cancelBtn: string;
      emptyQueue: string;
      statusPending: string;
      statusAccepted: string;
      statusCompleted: string;
      statusCancelled: string;
      assignedToLabel: string;
      createdByLabel: string;
    };
    chat: {
      title: string;
      subtitle: string;
      roleLabel: string;
      roles: {
        driver: string;
        merchant: string;
        employee: string;
        admin: string;
      };
      messagePlaceholder: string;
      sendBtn: string;
      sendingBtn: string;
      emptyMessages: string;
      validationError: string;
      adminRoleLockedNote: string;
    };
    errorBoundary: {
      fallbackTitle: string;
      fallbackMessage: string;
      retryLabel: string;
    };
  };
  engineering: {
    kicker: string;
    title: string;
    subtitle: string;
    selectAction: string;
    services: {
      number: string;
      id: 'web_mobile' | 'erp_crm' | 'digital_growth';
      title: string;
      summary: string;
      deliverables: string[];
    }[];
  };
  tarifs: {
    kicker: string;
    title: string;
    subtitle: string;
    currencyNoteTitle: string;
    currencyNoteBody: string;
    paymentMethodsBadge: string;
    selectPlanBtn: string;
    recommendedTag: string;
    plans: {
      id: PlanInquiryId;
      name: string;
      usdPrice: string;
      period: string;
      summary: string;
      features: string[];
      highlighted?: boolean;
    }[];
    paymentStepsTitle: string;
    paymentSteps: {
      step: string;
      title: string;
      detail: string;
    }[];
  };
  trust: {
    kicker: string;
    title: string;
    subtitle: string;
    pillars: {
      index: string;
      iconKey: 'shield' | 'cpu' | 'receipt' | 'headphones';
      title: string;
      description: string;
    }[];
    assuranceStripTitle: string;
    assuranceItems: string[];
    ctaLabel: string;
  };
  contact: {
    kicker: string;
    title: string;
    subtitle: string;
    channels: {
      whatsappTitle: string;
      whatsappValue: string;
      whatsappNote: string;
      whatsappAction: string;
      emailTitle: string;
      emailValue: string;
      emailCopy: string;
      emailCopied: string;
      locationTitle: string;
      locationValue: string;
      locationDetail: string;
    };
    map: {
      title: string;
      subtitle: string;
      hqLabel: string;
      searchPlaceholder: string;
      searchBtn: string;
      searchingLabel: string;
      roadmapLabel: string;
      satelliteLabel: string;
      recenterBtn: string;
      openExternalBtn: string;
      loadingLabel: string;
      noResultsLabel: string;
      unavailableLabel: string;
      missingKeyNote: string;
      onlineStatusLabel: string;
      offlineStatusLabel: string;
      addPartnerBtn: string;
      addingPartnerLabel: string;
      partnerAddedFeedback: string;
      saveOfflineBtn: string;
      offlineSavedFeedback: string;
      savedLocationsTitle: string;
      clearCacheBtn: string;
    };
    form: {
      title: string;
      subtitle: string;
      whatsappHeader: string;
      planLabel: string;
      planOptions: {
        id: PlanInquiryId;
        label: string;
      }[];
      nameLabel: string;
      namePlaceholder: string;
      companyLabel: string;
      companyPlaceholder: string;
      contactLabel: string;
      contactPlaceholder: string;
      briefLabel: string;
      briefPlaceholder: string;
      submitBtn: string;
      submittingBtn: string;
      directWhatsappBtn: string;
      validationEmptyError: string;
      validationContactError: string;
      validationBriefError: string;
      successTitle: string;
      successReferenceLabel: string;
      successMessage: string;
      summaryHeading: string;
      sendSummaryWhatsappBtn: string;
      resetBtn: string;
    };
  };
  footer: {
    tagline: string;
    location: string;
    rights: string;
  };
  assistant: {
    launcherLabel: string;
    panelTitle: string;
    panelSubtitle: string;
    welcomeMessage: string;
    quickPrompts: string[];
    inputPlaceholder: string;
    sendLabel: string;
    closeLabel: string;
    thinkingLabel: string;
    whatsappHandoffLabel: string;
    whatsappHandoffMessage: string;
    errorMessage: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationContent> = {
  fr: {
    meta: {
      pageTitle: 'MUNGU ANA WEZA — Infrastructure Intelligente & Solutions SaaS',
      pageDescription:
        'MUNGU ANA WEZA (munguanaweza.com) : infrastructure cloud, PIECES PRO / NOVA OS, SOKO MUNGU, MUNGU AI et ingénierie logicielle d’entreprise.',
    },
    a11y: {
      skipToContent: 'Aller au contenu principal',
      primaryNav: 'Navigation principale',
      mobileNav: 'Navigation mobile',
      languageSelector: 'Sélecteur de langue',
      footerNav: 'Navigation pied de page',
    },
    nav: {
      accueil: 'Accueil',
      piecesPro: 'PIECES PRO',
      sokoMungu: 'SOKO MUNGU',
      munguAi: 'MUNGU AI',
      operations: 'MUANS Ops',
      solutions: 'Ingénierie',
      tarifs: 'Tarifs',
      contact: 'Contact',
      menuOpen: 'Ouvrir le menu',
      menuClose: 'Fermer le menu',
    },
    hero: {
      kicker: 'Global SaaS & Tech Enterprise · munguanaweza.com',
      headline: 'Infrastructure Intelligente d’Entreprise et de Commerce',
      subheadline:
        'MUNGU ANA WEZA développe des systèmes cloud et IA de nouvelle génération pour piloter les opérations commerciales, unifier les stocks multi-devises, structurer les paiements et concevoir des plateformes logicielles sur mesure.',
      ctaTrial: 'Essai gratuit 7 jours',
      ctaContact: 'Contactez-nous',
      ctaWhatsapp: 'WhatsApp Direct (+243 891 733 969)',
      whatsappGreeting:
        'Bonjour MUNGU ANA WEZA, je souhaite découvrir vos solutions SaaS et démarrer l’essai gratuit de 7 jours.',
      imageAlt: 'Architecture cloud et intelligence artificielle MUNGU ANA WEZA',
      pillars: [
        {
          title: 'PIECES PRO / NOVA OS',
          description: 'Système cloud unifié : stock, point de vente (POS), ventes et échéances multi-devises.',
          href: '#pieces-pro',
        },
        {
          title: 'SOKO MUNGU',
          description: 'Vision d’une plateforme de commerce intelligent et de mise en relation B2B/B2C à venir.',
          href: '#soko-mungu',
        },
        {
          title: 'MUNGU AI',
          description: 'Moteur d’analyses prédictives et d’aide à la décision sous gouvernance humaine.',
          href: '#mungu-ai',
        },
        {
          title: 'Ingénierie Digitale',
          description: 'Plateformes Web & Mobile, ERP/CRM sur mesure et stratégies de croissance digitale.',
          href: '#solutions',
        },
      ],
    },
    piecesPro: {
      kicker: '01 · Produit Cloud Phare',
      title: 'PIECES PRO / NOVA OS',
      subtitle: 'Pilotage cloud des stocks, points de vente (POS), ventes et recouvrements multi-devises',
      description:
        'Conçu comme un système opérationnel complet pour entreprises, distributeurs et réseaux commerciaux, PIECES PRO / NOVA OS centralise les mouvements de stock, la facturation au comptoir (POS) et la gestion structurée des ventes à tempérament en USD, FC et EUR.',
      trialHighlightTitle: 'Essai gratuit complet de 7 jours',
      trialHighlightBody:
        'Déployez PIECES PRO / NOVA OS dans vos opérations réelles pendant 7 jours sans engagement, avec accompagnement à la configuration de votre catalogue et de vos devises.',
      ctaStartTrial: 'Démarrer l’essai gratuit (7 jours)',
      ctaSubscribe: 'Voir les tarifs SaaS',
      ctaWhatsappTrial: 'Activer via WhatsApp',
      whatsappTrialMessage:
        'Bonjour MUNGU ANA WEZA, je souhaite activer l’essai gratuit de 7 jours de PIECES PRO / NOVA OS.',
      features: [
        {
          title: 'Inventaire temps réel & multi-devises',
          detail: 'Gestion par SKU, coût unitaire, prix comptant et grille de crédit en USD, FC ou EUR.',
        },
        {
          title: 'Terminal Point de Vente (POS) intégré',
          detail: 'Encaissement instantané au comptoir avec déduction automatique des quantités.',
        },
        {
          title: 'Suivi intelligent des échéances',
          detail: 'Calcul automatique des balances restantes et classification des retards de paiement.',
        },
      ],
      preview: {
        appTitle: 'PIECES PRO / NOVA OS',
        subtitleLabel: 'Cloud Commerce & POS Workspace',
        tabs: {
          dashboard: 'Tableau',
          inventory: 'Stock',
          pos: 'POS',
          installments: 'Échéances',
        },
        collectedLabel: 'Encaissé',
        overdueLabel: 'Dossiers en retard',
        unitsLabel: 'Unités en stock',
        receivablesLabel: 'Créances actives',
        searchPlaceholder: 'Rechercher une référence ou un article...',
        costLabel: 'Coût',
        cashLabel: 'Comptant',
        creditLabel: 'À crédit',
        qtyLabel: 'Qté',
        dueDateLabel: 'Échéance',
        paidLabel: 'Payé',
        remainingLabel: 'Reste',
        recordPaymentBtn: 'Encaisser 25 $',
        settledLabel: 'Soldé',
        posSelectPrompt: 'Sélectionnez un article pour enregistrer une vente POS :',
        posRecordSaleBtn: 'Valider la vente POS',
        posSaleConfirmed: 'Vente POS enregistrée et stock mis à jour.',
        statusOnTime: 'À jour',
        statusLatePrefix: 'Retard',
        statusDaysUnit: 'j',
        statusRisk: 'Relance +30j',
        addItemBtn: 'Ajouter',
        cancelBtn: 'Annuler',
        saveItemBtn: 'Enregistrer',
        itemNamePlaceholder: 'Désignation de l’article',
        emptyInventory: 'Aucun article ne correspond à cette recherche.',
        footerNote: 'Démonstration interactive · Architecture cloud multi-devises',
      },
    },
    sokoMungu: {
      kicker: '02 · Écosystème Commercial à Venir',
      title: 'SOKO MUNGU',
      subtitle: 'La vision d’une plateforme de commerce et de connexion B2B/B2C intelligente',
      description:
        'SOKO MUNGU incarne la prochaine brique de l’écosystème MUNGU ANA WEZA : un réseau commercial intelligent reliant les entreprises équipées de PIECES PRO / NOVA OS aux acheteurs et partenaires professionnels.',
      noticeTitle: 'Plateforme en préparation au sein de l’écosystème',
      noticeBody:
        'SOKO MUNGU est présenté ici pour sa vision et son architecture à venir. Aucune boutique publique ni paiement automatisé en ligne n’est encore ouvert sur cette interface.',
      imageAlt: 'Architecture commerciale digitale SOKO MUNGU',
      roadmapTitle: 'Piliers architecturaux prévus',
      roadmapItems: [
        {
          number: '01.',
          title: 'Catalogue B2B / B2C vérifié',
          detail: 'Mise en avant structurée des inventaires professionnels avec fiabilité des disponibilités.',
        },
        {
          number: '02.',
          title: 'Synchronisation PIECES PRO / NOVA OS',
          detail: 'Passerelle native prévue entre les stocks gérés en cloud et la visibilité marchande.',
        },
        {
          number: '03.',
          title: 'Routage intelligent des demandes',
          detail: 'Qualification rapide des commandes et mise en relation directe avec validation humaine.',
        },
      ],
      ctaInterest: 'Rejoindre la liste d’intérêt',
    },
    munguAi: {
      kicker: '03 · Intelligence Décisionnelle',
      title: 'MUNGU AI',
      subtitle: 'Moteur d’analyses intelligentes et d’aide à la décision pour dirigeants et marchands',
      description:
        'MUNGU AI transforme vos données opérationnelles en indicateurs actionnables : lecture des vélocités de vente, anticipation des réapprovisionnements et assistance conversationnelle multilingue.',
      disclaimerTitle: 'Aide à la décision sous contrôle humain',
      disclaimerBody:
        'MUNGU AI fournit des analyses et recommandations décisionnelles pour éclairer les équipes. Aucune décision financière ou d’octroi de crédit n’est exécutée automatiquement sans validation humaine.',
      imageAlt: 'Moteur analytique MUNGU AI sur fond sombre et or',
      capabilities: [
        {
          number: '01.',
          title: 'Vélocité & alertes de rupture',
          detail: 'Détection des produits à forte rotation et priorisation des commandes fournisseurs.',
        },
        {
          number: '02.',
          title: 'Synthèse des recouvrements',
          detail: 'Classement clair des échéances clients pour optimiser le suivi commercial manuel.',
        },
        {
          number: '03.',
          title: 'Concierge IA multilingue',
          detail: 'Qualification des prospects et orientation commerciale fluide en FR, EN et AR.',
        },
      ],
      ctaOpenAssistant: 'Tester le Concierge IA',
      ctaAskWhatsapp: 'Échanger avec un conseiller',
    },
    agentCalculator: {
      kicker: '03B · Simulateur ROI d’Automatisation',
      title: 'Calculateur d’efficacité de votre équipe d’agents IA',
      subtitle:
        'Estimez le temps hebdomadaire récupéré, les économies mensuelles et le retour sur investissement annuel selon le volume de tâches automatisées.',
      tasksLabel: 'Tâches automatisées par semaine',
      tasksUnit: 'Tâches',
      timeLabel: 'Temps manuel par tâche (min)',
      timeUnit: 'Min',
      rateLabel: 'Taux horaire opérationnel ($)',
      rateUnit: '$/h',
      calculateBtn: 'Estimer les économies',
      resetBtn: 'Réinitialiser',
      resultsTitle: 'Potentiel d’orchestration de vos agents IA',
      weeklyHoursLabel: 'Heures récupérées / semaine',
      hoursShortUnit: 'h',
      monthlySavingsLabel: 'Économies mensuelles estimées',
      efficiencyBoostLabel: 'Gain de productivité d’équipe',
      annualRoiLabel: 'ROI annuel estimé',
      assumptionNote:
        'Hypothèses de simulation : 4 semaines/mois, base de 40 h/semaine pour le gain d’efficacité, et coût mensuel indicatif d’agent IA de 50 $ (hébergement / API).',
      deployCta: 'Déployer mes agents IA',
      askTeamCta: 'Consulter le Concierge IA',
    },
    operations: {
      kicker: '03C · MUANS GO & MUANS Admin',
      title: 'Centre Opérationnel · Livraisons, Messagerie & Contrôle Admin',
      subtitle:
        'Publiez et acceptez des courses de livraison en temps réel, coordonnez vos équipes sur le canal interne et supervisez l’activité depuis le Panneau Admin.',
      adminToggleBtn: 'Admin',
      auth: {
        signInBtn: 'Se connecter avec Google',
        signingInBtn: 'Connexion...',
        signOutBtn: 'Déconnexion',
        signedInAsLabel: 'Connecté :',
        adminVerifiedLabel: 'Admin vérifié',
        signInRequiredTitle: 'Authentification requise pour les opérations temps réel',
        signInRequiredBody:
          'Connectez-vous avec votre compte Google pour publier ou accepter des commandes MUANS GO, accéder à la messagerie interne et gérer le panneau administrateur.',
        unverifiedEmailError: 'Votre adresse e-mail Google doit être vérifiée pour accéder aux opérations.',
        authErrorGeneric: 'Impossible de finaliser la connexion Google. Veuillez réessayer.',
      },
      adminPanel: {
        title: 'Panneau de Contrôle Suprême (Admin)',
        subtitle: 'Supervision temps réel des commandes, chauffeurs actifs et commissions estimées ($1.50 / course acceptée).',
        restrictedTitle: 'Accès Administrateur Protégé',
        restrictedBody:
          'Connectez-vous avec le compte administrateur autorisé (munguanawaza@gmail.com) pour consulter les revenus et piloter toutes les commandes.',
        totalOrdersLabel: 'Total Commandes',
        activeDriversLabel: 'Chauffeurs Actifs',
        estimatedRevenueLabel: 'Revenu Estimé (Commissions)',
        commissionNote: 'Base $1.50 par commande acceptée ou finalisée.',
        tableCustomer: 'Client / Destination',
        tableDetails: 'Détails',
        tableStatus: 'Statut',
        tableDate: 'Date',
        tableActions: 'Actions',
        emptyTable: 'Aucune commande enregistrée pour le moment.',
        completeAction: 'Finaliser',
        cancelAction: 'Annuler',
      },
      orders: {
        title: 'Commandes de Livraison',
        subtitle: 'File active des courses MUANS GO · Synchronisation Firestore en direct',
        customerPlaceholder: 'Nom du client ou adresse (ex. Quartier Dilala)...',
        detailsPlaceholder: 'Détails du colis ou instructions de livraison...',
        publishBtn: 'Publier la commande',
        publishingBtn: 'Publication...',
        validationError: 'Veuillez saisir la destination et les détails (min. 2 caractères chacun).',
        createdFeedback: 'Commande ajoutée à la file active.',
        acceptBtn: 'Accepter',
        completeBtn: 'Terminer',
        cancelBtn: 'Annuler',
        emptyQueue: 'Aucune commande active dans la file pour le moment.',
        statusPending: 'En attente',
        statusAccepted: 'Acceptée',
        statusCompleted: 'Livrée',
        statusCancelled: 'Annulée',
        assignedToLabel: 'Chauffeur :',
        createdByLabel: 'Émise par :',
      },
      chat: {
        title: 'Messagerie Interne',
        subtitle: 'Canal opérationnel Kolwezi · Chauffeurs, Commerçants & Équipe',
        roleLabel: 'Rôle opérationnel',
        roles: {
          driver: 'Chauffeur',
          merchant: 'Commerçant',
          employee: 'Employé',
          admin: 'Admin',
        },
        messagePlaceholder: 'Écrivez un message à l’équipe...',
        sendBtn: 'Envoyer',
        sendingBtn: 'Envoi...',
        emptyMessages: 'Aucun message sur le canal pour le moment.',
        validationError: 'Veuillez saisir un message (max. 1000 caractères).',
        adminRoleLockedNote: 'Le badge Admin est réservé au compte administrateur vérifié.',
      },
      errorBoundary: {
        fallbackTitle: 'Espace Opérationnel Temporairement Indisponible',
        fallbackMessage:
          'Une restriction d’autorisation ou une erreur de synchronisation est survenue.',
        retryLabel: 'Réessayer',
      },
    },
    engineering: {
      kicker: '04 · Ingénierie & Transformation Digitale',
      title: 'Solutions logicielles d’entreprise sur mesure',
      subtitle:
        'Au-delà de nos produits SaaS, nos équipes d’ingénierie conçoivent des architectures digitales robustes adaptées aux exigences opérationnelles des organisations.',
      selectAction: 'Demander un devis technique',
      services: [
        {
          number: '01.',
          id: 'web_mobile',
          title: 'Plateformes Web & Mobile',
          summary:
            'Applications web haute performance et apps mobiles natives/hybrides iOS & Android pensées pour la fiabilité et l’expérience utilisateur.',
          deliverables: ['Portails Cloud', 'Apps iOS & Android', 'APIs Sécurisées'],
        },
        {
          number: '02.',
          id: 'erp_crm',
          title: 'ERP & CRM sur mesure',
          summary:
            'Systèmes d’entreprise adaptés à vos flux métier : consolidation multi-agences, traçabilité comptable, gestion RH et portails clients.',
          deliverables: ['Workflows Métier', 'Multi-Succursales', 'Contrôle d’Accès'],
        },
        {
          number: '03.',
          id: 'digital_growth',
          title: 'Croissance Digitale',
          summary:
            'Déploiement de stratégies d’acquisition, gestion de présence sociale et tunnels de conversion mesurables pour accélérer vos revenus.',
          deliverables: ['Acquisition Ciblée', 'Social Systems', 'Analytics Conversion'],
        },
      ],
    },
    tarifs: {
      kicker: '05 · Tarification SaaS Mondiale',
      title: 'Des formules évolutives pour chaque stade de croissance',
      subtitle:
        'Commencez par un essai gratuit de 7 jours sur PIECES PRO / NOVA OS, puis évoluez selon votre volume d’opérations et vos besoins d’équipe.',
      currencyNoteTitle: 'Paiements Internationaux & Locaux avec confirmation flexible',
      currencyNoteBody:
        'Les tarifs ci-dessous sont exprimés en USD. Le règlement est flexible : Mobile Money (M-Pesa, Airtel Money, Orange Money) et Virement Bancaire (local ou international) avec facturation pro-forma et confirmation adaptée.',
      paymentMethodsBadge: 'M-Pesa · Airtel Money · Orange Money · Virement Bancaire',
      selectPlanBtn: 'Choisir cette formule',
      recommendedTag: 'Recommandé',
      plans: [
        {
          id: 'trial-7d',
          name: 'Free Trial',
          usdPrice: '0 $',
          period: '7 jours',
          summary: 'Découvrez l’ensemble des modules PIECES PRO / NOVA OS sans engagement.',
          features: [
            'Inventaire & catalogue multi-devises',
            'Terminal POS & facturation rapide',
            'Suivi des échéances pendant 7 jours',
            'Accompagnement de prise en main',
          ],
        },
        {
          id: 'standard',
          name: 'Standard',
          usdPrice: '15 $',
          period: '/ mois',
          summary: 'L’essentiel pour digitaliser un point de vente ou une structure commerciale.',
          features: [
            'Gestion complète du stock & POS',
            'Suivi des ventes USD / FC / EUR',
            '1 point de vente actif',
            'Support par WhatsApp & e-mail',
          ],
        },
        {
          id: 'pro',
          name: 'Pro',
          usdPrice: '35 $',
          period: '/ mois',
          summary: 'Pensé pour les entreprises gérant des ventes à crédit et plusieurs collaborateurs.',
          highlighted: true,
          features: [
            'Toutes les fonctionnalités Standard',
            'Recouvrement & analyse d’âge des créances',
            'Multi-utilisateurs avec rôles dédiés',
            'Tableaux décisionnels MUNGU AI',
          ],
        },
        {
          id: 'entreprise',
          name: 'Enterprise',
          usdPrice: '150 $+',
          period: '/ mois',
          summary: 'Architecture multi-agences, intégrations API et accompagnement dédié.',
          features: [
            'Consolidation multi-filiales & dépôts',
            'Modules ERP/CRM personnalisés',
            'Formation équipes & déploiement sur mesure',
            'Support prioritaire SLA & conseiller dédié',
          ],
        },
      ],
      paymentStepsTitle: 'Processus de souscription simple et flexible',
      paymentSteps: [
        {
          step: '01.',
          title: 'Sélection & qualification',
          detail: 'Choisissez votre formule ou demandez un essai de 7 jours via le formulaire ou WhatsApp.',
        },
        {
          step: '02.',
          title: 'Règlement Mobile Money ou Bancaire',
          detail: 'Payez via M-Pesa, Airtel Money, Orange Money ou virement bancaire selon votre devise.',
        },
        {
          step: '03.',
          title: 'Activation & onboarding',
          detail: 'Après confirmation rapide de votre preuve ou virement, votre espace cloud est activé.',
        },
      ],
    },
    trust: {
      kicker: '06 · Confiance & Gouvernance',
      title: 'Un socle technologique conçu pour la transparence et la fiabilité',
      subtitle:
        'Chaque déploiement MUNGU ANA WEZA repose sur des engagements vérifiables : sécurité applicative, contrôle humain permanent et facturation officielle claire.',
      pillars: [
        {
          index: '01.',
          iconKey: 'shield',
          title: 'Sécurité Cloud & Contrôle d’Accès',
          description:
            'Gestion stricte des rôles utilisateurs, chiffrement TLS des échanges, sauvegardes régulières et cloisonnement des données par entreprise.',
        },
        {
          index: '02.',
          iconKey: 'cpu',
          title: 'IA Gouvernée par l’Humain',
          description:
            'Nos modules d’intelligence artificielle recommandent et synthétisent les données sans jamais exécuter de validation financière autonome.',
        },
        {
          index: '03.',
          iconKey: 'receipt',
          title: 'Facturation & Paiements Vérifiables',
          description:
            'Tarifs transparents en USD avec factures pro-forma officielles et confirmation traçable par Mobile Money ou virement bancaire.',
        },
        {
          index: '04.',
          iconKey: 'headphones',
          title: 'Essai Gratuit 7 Jours & Support Direct',
          description:
            'Évaluez PIECES PRO / NOVA OS avec votre propre catalogue avant tout engagement, avec accompagnement direct sur WhatsApp et par e-mail.',
        },
      ],
      assuranceStripTitle: 'Engagements vérifiés · munguanaweza.com',
      assuranceItems: [
        'Identité officielle MUNGU ANA WEZA',
        'Essai complet 7 jours à 0 $',
        'Support multi-devises USD / FC / EUR',
        'Canal direct : +243 891 733 969',
      ],
      ctaLabel: 'Activer l’essai 7 jours',
    },
    contact: {
      kicker: '07 · Contact & Déploiement',
      title: 'Lancez votre essai ou planifiez votre projet logiciel',
      subtitle:
        'Notre équipe répond rapidement pour activer votre essai de 7 jours, établir un devis sur mesure ou organiser une démonstration.',
      channels: {
        whatsappTitle: 'WhatsApp International',
        whatsappValue: '+243 891 733 969',
        whatsappNote: 'Canal prioritaire pour essais 7 jours, abonnements et confirmation de paiement.',
        whatsappAction: 'Écrire sur WhatsApp',
        emailTitle: 'E-mail Officiel',
        emailValue: 'munguanawaza@gmail.com',
        emailCopy: 'Copier l’adresse',
        emailCopied: 'Adresse copiée',
        locationTitle: 'Siège Social',
        locationValue: 'Kolwezi, RDC',
        locationDetail: 'munguanaweza.com · Déploiement cloud sans frontières',
      },
      map: {
        title: 'MUANS GO — Navigation & Siège Social Kolwezi',
        subtitle:
          'Localisez le siège MUNGU ANA WEZA, épinglez des partenaires commerciaux à Kolwezi ou sauvegardez vos repères pour consultation hors-ligne.',
        hqLabel: 'MUNGU ANA WEZA — Siège Social',
        searchPlaceholder: 'Rechercher un quartier ou partenaire (ex. Dilala, Kolwezi)...',
        searchBtn: 'Rechercher',
        searchingLabel: 'Recherche...',
        roadmapLabel: 'Plan',
        satelliteLabel: 'Satellite',
        recenterBtn: 'Recentrer sur le siège',
        openExternalBtn: 'Ouvrir dans Google Maps',
        loadingLabel: 'Chargement de Google Maps...',
        noResultsLabel: 'Aucun lieu trouvé pour cette recherche.',
        unavailableLabel: 'La carte interactive est temporairement indisponible.',
        missingKeyNote:
          'Vous pouvez ouvrir directement la localisation officielle sur Google Maps.',
        onlineStatusLabel: 'Mode En Ligne',
        offlineStatusLabel: 'Mode Hors-Ligne (Cache local)',
        addPartnerBtn: 'Ajouter un Partenaire (Dilala)',
        addingPartnerLabel: 'Localisation...',
        partnerAddedFeedback: 'Partenaire ajouté sur la carte MUANS GO.',
        saveOfflineBtn: 'Sauvegarder Hors-Ligne',
        offlineSavedFeedback: 'Repères sauvegardés localement (cache 30 jours).',
        savedLocationsTitle: 'Repères enregistrés hors-ligne',
        clearCacheBtn: 'Effacer le cache',
      },
      form: {
        title: 'Demande de devis ou d’essai gratuit (7 jours)',
        subtitle: 'Enregistrez votre demande et recevez un récapitulatif prêt pour WhatsApp.',
        whatsappHeader: 'Demande Entreprise — munguanaweza.com (MUNGU ANA WEZA)',
        planLabel: 'Produit ou formule souhaitée',
        planOptions: [
          { id: 'trial-7d', label: 'PIECES PRO / NOVA OS — Essai gratuit 7 jours (0 $)' },
          { id: 'standard', label: 'PIECES PRO / NOVA OS — Standard (15 $/mois)' },
          { id: 'pro', label: 'PIECES PRO / NOVA OS — Pro (35 $/mois)' },
          { id: 'entreprise', label: 'Enterprise — Multi-agences & Sur mesure (150 $+/mois)' },
          { id: 'engineering', label: 'Ingénierie — Plateforme Web/Mobile ou ERP/CRM' },
          { id: 'soko-mungu', label: 'SOKO MUNGU — Partenariat & Accès anticipé' },
          { id: 'mungu-ai', label: 'MUNGU AI — Analytics & Aide à la décision' },
        ],
        nameLabel: 'Nom complet *',
        namePlaceholder: 'Votre nom complet',
        companyLabel: 'Organisation / Entreprise',
        companyPlaceholder: 'Nom de votre société (optionnel)',
        contactLabel: 'Téléphone WhatsApp ou E-mail *',
        contactPlaceholder: '+243 ... ou nom@entreprise.com',
        briefLabel: 'Votre besoin ou projet *',
        briefPlaceholder: 'Décrivez vos objectifs, le nombre d’utilisateurs ou d’agences...',
        submitBtn: 'Envoyer la demande',
        submittingBtn: 'Enregistrement...',
        directWhatsappBtn: 'Discuter sur WhatsApp',
        validationEmptyError: 'Veuillez renseigner votre nom, votre contact et votre besoin.',
        validationContactError: 'Veuillez saisir un numéro de téléphone ou un e-mail valide.',
        validationBriefError: 'Veuillez décrire votre demande en quelques mots (min. 6 caractères).',
        successTitle: 'Demande enregistrée avec succès',
        successReferenceLabel: 'Référence',
        successMessage:
          'Votre demande a été enregistrée. Vous pouvez transmettre immédiatement le récapitulatif ci-dessous sur notre WhatsApp pour accélérer le traitement.',
        summaryHeading: 'Récapitulatif de la demande',
        sendSummaryWhatsappBtn: 'Transmettre sur WhatsApp',
        resetBtn: 'Nouvelle demande',
      },
    },
    footer: {
      tagline: 'Infrastructure intelligente de gestion, d’IA décisionnelle et de commerce digital.',
      location: 'Siège social : Kolwezi, RDC · munguanaweza.com',
      rights: 'MUNGU ANA WEZA. Tous droits réservés.',
    },
    assistant: {
      launcherLabel: 'Concierge IA',
      panelTitle: 'Concierge IA · MUNGU ANA WEZA',
      panelSubtitle: 'Conseiller Solutions, Tarifs & Déploiement',
      welcomeMessage:
        'Bonjour. Je suis le Concierge IA de MUNGU ANA WEZA. Je peux vous présenter PIECES PRO / NOVA OS (essai gratuit 7 jours), SOKO MUNGU, MUNGU AI, nos formules (Standard 15 $, Pro 35 $, Enterprise 150 $+) et vous guider vers WhatsApp pour activer votre espace.',
      quickPrompts: [
        'Comment démarrer l’essai gratuit 7 jours ?',
        'Quels sont les tarifs et moyens de paiement ?',
        'Que fait PIECES PRO / NOVA OS ?',
      ],
      inputPlaceholder: 'Posez votre question...',
      sendLabel: 'Envoyer',
      closeLabel: 'Fermer le concierge',
      thinkingLabel: 'Analyse en cours...',
      whatsappHandoffLabel: 'Finaliser avec un conseiller sur WhatsApp',
      whatsappHandoffMessage:
        'Bonjour MUNGU ANA WEZA, je viens d’échanger avec votre Concierge IA sur munguanaweza.com et souhaite poursuivre ma demande.',
      errorMessage: 'Le Concierge IA est momentanément occupé. Poursuivez directement sur WhatsApp.',
    },
  },
  en: {
    meta: {
      pageTitle: 'MUNGU ANA WEZA — Intelligent Business & Commerce Infrastructure',
      pageDescription:
        'MUNGU ANA WEZA (munguanaweza.com): Global SaaS & AI enterprise platform featuring PIECES PRO / NOVA OS, SOKO MUNGU, MUNGU AI, and custom software engineering.',
    },
    a11y: {
      skipToContent: 'Skip to main content',
      primaryNav: 'Primary navigation',
      mobileNav: 'Mobile navigation',
      languageSelector: 'Language selector',
      footerNav: 'Footer navigation',
    },
    nav: {
      accueil: 'Home',
      piecesPro: 'PIECES PRO',
      sokoMungu: 'SOKO MUNGU',
      munguAi: 'MUNGU AI',
      operations: 'MUANS Ops',
      solutions: 'Engineering',
      tarifs: 'Pricing',
      contact: 'Contact',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
    hero: {
      kicker: 'Global SaaS & Tech Enterprise · munguanaweza.com',
      headline: 'Intelligent Business & Commerce Infrastructure',
      subheadline:
        'MUNGU ANA WEZA engineers cloud operating systems, multi-currency commerce tools, decision-support AI, and bespoke enterprise software designed to scale modern businesses.',
      ctaTrial: 'Start 7-Day Free Trial',
      ctaContact: 'Contact Us',
      ctaWhatsapp: 'WhatsApp (+243 891 733 969)',
      whatsappGreeting:
        'Hello MUNGU ANA WEZA, I would like to explore your SaaS ecosystem and start a 7-day free trial.',
      imageAlt: 'MUNGU ANA WEZA dark luxury enterprise cloud and AI architecture',
      pillars: [
        {
          title: 'PIECES PRO / NOVA OS',
          description: 'Unified cloud platform for inventory, POS, sales, and multi-currency installment collections.',
          href: '#pieces-pro',
        },
        {
          title: 'SOKO MUNGU',
          description: 'Upcoming smart digital commerce and B2B/B2C trade connectivity platform.',
          href: '#soko-mungu',
        },
        {
          title: 'MUNGU AI',
          description: 'Intelligent analytics and decision-support engine under human governance.',
          href: '#mungu-ai',
        },
        {
          title: 'Software Engineering',
          description: 'Web & Mobile platforms, custom ERP/CRM architecture, and digital growth systems.',
          href: '#solutions',
        },
      ],
    },
    piecesPro: {
      kicker: '01 · Flagship Cloud Platform',
      title: 'PIECES PRO / NOVA OS',
      subtitle: 'Cloud & intelligent control over inventory, POS, sales, and multi-currency collections',
      description:
        'Built as a unified operational core for modern merchants, distributors, and multi-branch enterprises, PIECES PRO / NOVA OS streamlines inventory tracking, fast POS checkout, and structured installment receivables across USD, FC, and EUR.',
      trialHighlightTitle: 'Full 7-Day Free Trial',
      trialHighlightBody:
        'Deploy PIECES PRO / NOVA OS across your real workflow for 7 days with zero commitment and direct onboarding support from our engineering team.',
      ctaStartTrial: 'Start 7-Day Free Trial',
      ctaSubscribe: 'Explore SaaS Plans',
      ctaWhatsappTrial: 'Activate on WhatsApp',
      whatsappTrialMessage:
        'Hello MUNGU ANA WEZA, I want to start the 7-day free trial for PIECES PRO / NOVA OS.',
      features: [
        {
          title: 'Real-time multi-currency inventory',
          detail: 'SKU tracking, unit cost, cash pricing, and installment schedules in USD, FC, or EUR.',
        },
        {
          title: 'Integrated Point of Sale (POS)',
          detail: 'Rapid counter billing with automatic stock deduction and real-time ledger updates.',
        },
        {
          title: 'Installment & aging visibility',
          detail: 'Automated remaining balance tracking and clear overdue status classification.',
        },
      ],
      preview: {
        appTitle: 'PIECES PRO / NOVA OS',
        subtitleLabel: 'Cloud Commerce & POS Workspace',
        tabs: {
          dashboard: 'Overview',
          inventory: 'Inventory',
          pos: 'POS',
          installments: 'Installments',
        },
        collectedLabel: 'Collected',
        overdueLabel: 'Overdue accounts',
        unitsLabel: 'Stock units',
        receivablesLabel: 'Active receivables',
        searchPlaceholder: 'Search SKU or product name...',
        costLabel: 'Cost',
        cashLabel: 'Cash',
        creditLabel: 'Credit',
        qtyLabel: 'Qty',
        dueDateLabel: 'Due date',
        paidLabel: 'Paid',
        remainingLabel: 'Remaining',
        recordPaymentBtn: 'Record $25',
        settledLabel: 'Settled',
        posSelectPrompt: 'Select an item to process an instant POS sale:',
        posRecordSaleBtn: 'Complete POS Sale',
        posSaleConfirmed: 'POS sale recorded and stock updated.',
        statusOnTime: 'On time',
        statusLatePrefix: 'Late',
        statusDaysUnit: 'd',
        statusRisk: 'Follow-up +30d',
        addItemBtn: 'Add Item',
        cancelBtn: 'Cancel',
        saveItemBtn: 'Save',
        itemNamePlaceholder: 'Item designation',
        emptyInventory: 'No products match this search.',
        footerNote: 'Interactive live preview · Multi-currency cloud architecture',
      },
    },
    sokoMungu: {
      kicker: '02 · Upcoming Ecosystem Platform',
      title: 'SOKO MUNGU',
      subtitle: 'Our vision for smart commercial discovery and B2B/B2C trade connectivity',
      description:
        'SOKO MUNGU is the upcoming commerce network within the MUNGU ANA WEZA ecosystem, engineered to connect businesses operating on PIECES PRO / NOVA OS directly with enterprise buyers and consumers.',
      noticeTitle: 'Upcoming Platform Status',
      noticeBody:
        'SOKO MUNGU is presented here as a roadmap vision within our ecosystem. No live public storefront or automated online checkout is active on this site yet.',
      imageAlt: 'SOKO MUNGU digital commerce architecture preview',
      roadmapTitle: 'Planned architectural pillars',
      roadmapItems: [
        {
          number: '01.',
          title: 'Verified merchant catalogs',
          detail: 'Structured product visibility connecting trusted suppliers with regional and B2B buyers.',
        },
        {
          number: '02.',
          title: 'PIECES PRO / NOVA OS bridge',
          detail: 'Seamless synchronization planned between cloud stock records and marketplace listings.',
        },
        {
          number: '03.',
          title: 'Smart inquiry routing',
          detail: 'Rapid trade matching and order requests confirmed directly between buyer and merchant.',
        },
      ],
      ctaInterest: 'Join Early Access List',
    },
    munguAi: {
      kicker: '03 · Decision Intelligence',
      title: 'MUNGU AI',
      subtitle: 'Intelligent analytics and decision-support engine for modern enterprises',
      description:
        'MUNGU AI turns operational data into clear executive insights—surfacing fast-moving stock trends, collection priorities, and multilingual conversational support for your customers.',
      disclaimerTitle: 'Human-Governed Advisory Scope',
      disclaimerBody:
        'MUNGU AI operates strictly as an analytical and decision-support engine. It never executes automated financial or credit approvals—final commercial authority always stays with your team.',
      imageAlt: 'MUNGU AI decision-support engine interface',
      capabilities: [
        {
          number: '01.',
          title: 'Inventory velocity alerts',
          detail: 'Spots high-demand SKUs early so procurement teams reorder before stockouts occur.',
        },
        {
          number: '02.',
          title: 'Receivables prioritization',
          detail: 'Organizes aging client balances to guide disciplined manual collections.',
        },
        {
          number: '03.',
          title: 'Multilingual AI Concierge',
          detail: 'Answers product, pricing, and onboarding inquiries fluently in FR, EN, and AR.',
        },
      ],
      ctaOpenAssistant: 'Launch AI Concierge',
      ctaAskWhatsapp: 'Talk to an Advisor',
    },
    agentCalculator: {
      kicker: '03B · Automation ROI Estimator',
      title: 'AI Agent Team Efficiency Calculator',
      subtitle:
        'Estimate weekly hours reclaimed, monthly labor savings, and annual return based on your team’s repetitive operational workflows.',
      tasksLabel: 'Automated Tasks per Week',
      tasksUnit: 'Tasks',
      timeLabel: 'Manual Time per Task (Min)',
      timeUnit: 'Min',
      rateLabel: 'Hourly Labor Rate ($)',
      rateUnit: '$/Hr',
      calculateBtn: 'Estimate Agent Savings',
      resetBtn: 'Reset',
      resultsTitle: 'Your AI Agent Orchestration Potential',
      weeklyHoursLabel: 'Weekly Hours Reclaimed',
      hoursShortUnit: 'hrs',
      monthlySavingsLabel: 'Monthly Labor Savings',
      efficiencyBoostLabel: 'Team Efficiency Boost',
      annualRoiLabel: 'Annual Agent ROI',
      assumptionNote:
        'Model assumptions: 4 weeks/month, 40-hour weekly capacity baseline for efficiency boost, and $50/month baseline AI agent hosting / API cost.',
      deployCta: 'Deploy AI Agents',
      askTeamCta: 'Discuss with AI Concierge',
    },
    operations: {
      kicker: '03C · MUANS GO & MUANS Admin',
      title: 'Operations Hub · Dispatch Orders, Team Chat & Admin Control',
      subtitle:
        'Publish and accept delivery orders in real time, coordinate drivers and merchants via internal messaging, and monitor dispatch KPIs from the Admin Panel.',
      adminToggleBtn: 'Admin',
      auth: {
        signInBtn: 'Sign in with Google',
        signingInBtn: 'Signing in...',
        signOutBtn: 'Sign Out',
        signedInAsLabel: 'Signed in:',
        adminVerifiedLabel: 'Verified Admin',
        signInRequiredTitle: 'Authentication Required for Live Operations',
        signInRequiredBody:
          'Sign in with Google to publish or accept MUANS GO delivery orders, participate in internal dispatch chat, and access authorized admin controls.',
        unverifiedEmailError: 'Your Google account email must be verified to access operations.',
        authErrorGeneric: 'Unable to complete Google Sign-In. Please try again.',
      },
      adminPanel: {
        title: 'Supreme Control Panel (Admin)',
        subtitle: 'Live monitoring of delivery orders, active drivers, and estimated commissions ($1.50 per accepted dispatch).',
        restrictedTitle: 'Protected Administrator Access',
        restrictedBody:
          'Sign in with the authorized administrator account (munguanawaza@gmail.com) to inspect commission metrics and manage all orders.',
        totalOrdersLabel: 'Total Orders',
        activeDriversLabel: 'Active Drivers',
        estimatedRevenueLabel: 'Estimated Revenue',
        commissionNote: 'Calculated at $1.50 per accepted or completed order.',
        tableCustomer: 'Customer / Destination',
        tableDetails: 'Details',
        tableStatus: 'Status',
        tableDate: 'Date',
        tableActions: 'Actions',
        emptyTable: 'No orders recorded yet.',
        completeAction: 'Complete',
        cancelAction: 'Cancel',
      },
      orders: {
        title: 'Delivery Orders',
        subtitle: 'Live MUANS GO dispatch queue · Real-time Firestore sync',
        customerPlaceholder: 'Customer name or address (e.g. Dilala District)...',
        detailsPlaceholder: 'Package details or delivery instructions...',
        publishBtn: 'Publish Order',
        publishingBtn: 'Publishing...',
        validationError: 'Please enter both destination and details (min. 2 characters each).',
        createdFeedback: 'Order published to the active dispatch queue.',
        acceptBtn: 'Accept',
        completeBtn: 'Complete',
        cancelBtn: 'Cancel',
        emptyQueue: 'No active orders in the queue right now.',
        statusPending: 'Pending',
        statusAccepted: 'Accepted',
        statusCompleted: 'Completed',
        statusCancelled: 'Cancelled',
        assignedToLabel: 'Driver:',
        createdByLabel: 'Created by:',
      },
      chat: {
        title: 'Internal Messaging',
        subtitle: 'Kolwezi Operations Channel · Drivers, Merchants & Staff',
        roleLabel: 'Operational role',
        roles: {
          driver: 'Chauffeur',
          merchant: 'Commerçant',
          employee: 'Employé',
          admin: 'Admin',
        },
        messagePlaceholder: 'Send an update to the operations team...',
        sendBtn: 'Send',
        sendingBtn: 'Sending...',
        emptyMessages: 'No messages in this channel yet.',
        validationError: 'Please write a message (max. 1000 characters).',
        adminRoleLockedNote: 'The Admin badge is restricted to verified administrator accounts.',
      },
      errorBoundary: {
        fallbackTitle: 'Operations Workspace Temporarily Unavailable',
        fallbackMessage:
          'A permission restriction or live sync error interrupted the workspace.',
        retryLabel: 'Retry',
      },
    },
    engineering: {
      kicker: '04 · Software Engineering & Digital Transformation',
      title: 'Enterprise software tailored to your architecture',
      subtitle:
        'Alongside our SaaS suite, our engineering division delivers scalable digital platforms, custom enterprise systems, and measurable growth frameworks.',
      selectAction: 'Request Technical Quote',
      services: [
        {
          number: '01.',
          id: 'web_mobile',
          title: 'Web & Mobile Platforms',
          summary:
            'High-availability web applications and native/cross-platform iOS & Android mobile apps engineered for speed and security.',
          deliverables: ['Cloud Portals', 'iOS & Android Apps', 'Secure APIs'],
        },
        {
          number: '02.',
          id: 'erp_crm',
          title: 'Custom ERP & CRM',
          summary:
            'Tailored internal operations software featuring multi-branch consolidation, financial audit trails, and role-based governance.',
          deliverables: ['Custom Workflows', 'Multi-Branch Sync', 'Role Permissions'],
        },
        {
          number: '03.',
          id: 'digital_growth',
          title: 'Digital Growth Systems',
          summary:
            'Targeted digital acquisition funnels, social presence management, and conversion analytics built to expand enterprise revenue.',
          deliverables: ['Paid Acquisition', 'Social Ecosystems', 'Conversion Analytics'],
        },
      ],
    },
    tarifs: {
      kicker: '05 · Global SaaS Pricing',
      title: 'Transparent tiers engineered to scale with your business',
      subtitle:
        'Start with a 7-day free trial of PIECES PRO / NOVA OS and upgrade seamlessly as your branches and team expand.',
      currencyNoteTitle: 'International & Local Payments with Flexible Confirmation',
      currencyNoteBody:
        'All plans are priced in USD. Payment is flexible across M-Pesa, Airtel Money, Orange Money, and Bank Transfer (local or international) with pro-forma invoicing and guided activation.',
      paymentMethodsBadge: 'M-Pesa · Airtel Money · Orange Money · Bank Transfer',
      selectPlanBtn: 'Select Plan',
      recommendedTag: 'Most Popular',
      plans: [
        {
          id: 'trial-7d',
          name: 'Free Trial',
          usdPrice: '$0',
          period: '7 days',
          summary: 'Experience full PIECES PRO / NOVA OS capabilities in live operations.',
          features: [
            'Multi-currency stock & catalog',
            'Integrated POS & rapid receipts',
            'Installment tracking for 7 days',
            'Guided setup support',
          ],
        },
        {
          id: 'standard',
          name: 'Standard',
          usdPrice: '$15',
          period: '/ mo',
          summary: 'Essential cloud suite for digitizing a single storefront or point of sale.',
          features: [
            'Full inventory & POS workspace',
            'USD / FC / EUR multi-currency view',
            '1 active storefront location',
            'WhatsApp & email support',
          ],
        },
        {
          id: 'pro',
          name: 'Pro',
          usdPrice: '$35',
          period: '/ mo',
          summary: 'Designed for growing teams managing installment sales and receivables.',
          highlighted: true,
          features: [
            'Everything in Standard',
            'Collections & debt-aging analytics',
            'Multi-user access & role controls',
            'MUNGU AI decision insights',
          ],
        },
        {
          id: 'entreprise',
          name: 'Enterprise',
          usdPrice: '$150+',
          period: '/ mo',
          summary: 'Multi-branch cloud infrastructure, custom integrations, and SLA support.',
          features: [
            'Multi-branch & warehouse rollup',
            'Custom ERP/CRM integrations',
            'Dedicated team onboarding & training',
            'Priority SLA engineering support',
          ],
        },
      ],
      paymentStepsTitle: 'Flexible subscription & activation workflow',
      paymentSteps: [
        {
          step: '01.',
          title: 'Select plan or free trial',
          detail: 'Submit your plan choice or 7-day trial request via form or WhatsApp.',
        },
        {
          step: '02.',
          title: 'Choose payment channel',
          detail: 'Settle via M-Pesa, Airtel Money, Orange Money, or Bank Transfer.',
        },
        {
          step: '03.',
          title: 'Flexible confirmation & launch',
          detail: 'Once confirmed, our team provisions your cloud workspace immediately.',
        },
      ],
    },
    trust: {
      kicker: '06 · Trust & Governance',
      title: 'Enterprise architecture built on transparency and operational control',
      subtitle:
        'Every MUNGU ANA WEZA deployment is backed by verifiable operational commitments: disciplined access control, human-supervised AI, and official billing clarity.',
      pillars: [
        {
          index: '01.',
          iconKey: 'shield',
          title: 'Cloud Security & Access Control',
          description:
            'Role-based permissions for cashiers and managers, TLS-encrypted transport, structured cloud backups, and isolated company workspaces.',
        },
        {
          index: '02.',
          iconKey: 'cpu',
          title: 'Human-Governed AI',
          description:
            'Decision-support models analyze stock and receivables trends while keeping every financial approval and operational action under human authority.',
        },
        {
          index: '03.',
          iconKey: 'receipt',
          title: 'Verifiable Billing & Pro-Forma',
          description:
            'Clear USD reference pricing, official pro-forma invoicing, and auditable payment confirmation across Mobile Money and bank transfers.',
        },
        {
          index: '04.',
          iconKey: 'headphones',
          title: '7-Day Trial & Direct Onboarding',
          description:
            'Test PIECES PRO / NOVA OS on your real catalog before committing, supported directly by our engineering team via WhatsApp and email.',
        },
      ],
      assuranceStripTitle: 'Verified Commitments · munguanaweza.com',
      assuranceItems: [
        'Official MUNGU ANA WEZA platform',
        '7-day free trial at $0',
        'Multi-currency USD / FC / EUR',
        'Direct line: +243 891 733 969',
      ],
      ctaLabel: 'Start 7-Day Free Trial',
    },
    contact: {
      kicker: '07 · Contact & Onboarding',
      title: 'Start your free trial or discuss an enterprise build',
      subtitle:
        'Reach our solutions team directly to activate a 7-day trial, request a custom architecture quote, or schedule a walkthrough.',
      channels: {
        whatsappTitle: 'Global WhatsApp',
        whatsappValue: '+243 891 733 969',
        whatsappNote: 'Fastest channel for 7-day trial activation, quotes, and payment confirmation.',
        whatsappAction: 'Message on WhatsApp',
        emailTitle: 'Official Email',
        emailValue: 'munguanawaza@gmail.com',
        emailCopy: 'Copy Email',
        emailCopied: 'Copied',
        locationTitle: 'Headquarters',
        locationValue: 'Kolwezi, DRC',
        locationDetail: 'munguanaweza.com · Cloud delivery worldwide',
      },
      map: {
        title: 'MUANS GO — Kolwezi Navigation & Headquarters',
        subtitle:
          'Locate the MUNGU ANA WEZA headquarters, pin partner locations in Kolwezi, or save verified stops locally for offline reference.',
        hqLabel: 'MUNGU ANA WEZA — Headquarters',
        searchPlaceholder: 'Search a district or partner (e.g. Dilala, Kolwezi)...',
        searchBtn: 'Search',
        searchingLabel: 'Searching...',
        roadmapLabel: 'Map',
        satelliteLabel: 'Satellite',
        recenterBtn: 'Recenter HQ',
        openExternalBtn: 'Open in Google Maps',
        loadingLabel: 'Loading Google Maps...',
        noResultsLabel: 'No matching places found for that query.',
        unavailableLabel: 'Interactive map is temporarily unavailable.',
        missingKeyNote: 'You can open the verified location directly in Google Maps.',
        onlineStatusLabel: 'Online Mode',
        offlineStatusLabel: 'Offline Mode (Local Cache)',
        addPartnerBtn: 'Add Partner (Dilala)',
        addingPartnerLabel: 'Locating...',
        partnerAddedFeedback: 'Partner pinned on MUANS GO map.',
        saveOfflineBtn: 'Save Offline Snapshot',
        offlineSavedFeedback: 'Locations cached locally (30-day limit).',
        savedLocationsTitle: 'Saved Offline Directory',
        clearCacheBtn: 'Clear Cache',
      },
      form: {
        title: 'Quote & 7-Day Free Trial Request',
        subtitle: 'Submit your details to generate a reference and WhatsApp-ready summary.',
        whatsappHeader: 'Enterprise Inquiry — munguanaweza.com (MUNGU ANA WEZA)',
        planLabel: 'Product or Plan',
        planOptions: [
          { id: 'trial-7d', label: 'PIECES PRO / NOVA OS — 7-Day Free Trial ($0)' },
          { id: 'standard', label: 'PIECES PRO / NOVA OS — Standard ($15/mo)' },
          { id: 'pro', label: 'PIECES PRO / NOVA OS — Pro ($35/mo)' },
          { id: 'entreprise', label: 'Enterprise — Multi-Branch & Custom ($150+/mo)' },
          { id: 'engineering', label: 'Engineering — Web/Mobile or Custom ERP/CRM' },
          { id: 'soko-mungu', label: 'SOKO MUNGU — Early Access & Partnership' },
          { id: 'mungu-ai', label: 'MUNGU AI — Decision-Support Analytics' },
        ],
        nameLabel: 'Full Name *',
        namePlaceholder: 'Your full name',
        companyLabel: 'Company / Organization',
        companyPlaceholder: 'Your company name (optional)',
        contactLabel: 'WhatsApp Number or Email *',
        contactPlaceholder: '+243 ... or name@company.com',
        briefLabel: 'Project or Trial Details *',
        briefPlaceholder: 'Tell us about your team size, workflow, or technical scope...',
        submitBtn: 'Submit Request',
        submittingBtn: 'Submitting...',
        directWhatsappBtn: 'Chat on WhatsApp',
        validationEmptyError: 'Please provide your name, contact info, and request details.',
        validationContactError: 'Please enter a valid phone number or email address.',
        validationBriefError: 'Please write at least 6 characters describing your request.',
        successTitle: 'Request submitted successfully',
        successReferenceLabel: 'Reference',
        successMessage:
          'Your request has been logged. Send the prepared summary below directly to our WhatsApp desk for rapid onboarding.',
        summaryHeading: 'Request Summary',
        sendSummaryWhatsappBtn: 'Send via WhatsApp',
        resetBtn: 'Submit Another Request',
      },
    },
    footer: {
      tagline: 'Intelligent cloud business infrastructure, decision AI, and custom software engineering.',
      location: 'Headquarters: Kolwezi, DRC · munguanaweza.com',
      rights: 'MUNGU ANA WEZA. All rights reserved.',
    },
    assistant: {
      launcherLabel: 'AI Concierge',
      panelTitle: 'MUNGU ANA WEZA Concierge',
      panelSubtitle: 'Sales & Solutions Advisor',
      welcomeMessage:
        'Hello. I am the MUNGU ANA WEZA AI Concierge. Ask about PIECES PRO / NOVA OS (7-day free trial), SOKO MUNGU, MUNGU AI, custom software engineering, or our plans (Standard $15/mo, Pro $35/mo, Enterprise $150+/mo).',
      quickPrompts: [
        'How do I start the 7-day free trial?',
        'What plans & payment methods do you support?',
        'Tell me about PIECES PRO / NOVA OS',
      ],
      inputPlaceholder: 'Ask your question...',
      sendLabel: 'Send',
      closeLabel: 'Close concierge',
      thinkingLabel: 'Thinking...',
      whatsappHandoffLabel: 'Complete onboarding on WhatsApp',
      whatsappHandoffMessage:
        'Hello MUNGU ANA WEZA, I just spoke with your AI Concierge on munguanaweza.com and would like to proceed.',
      errorMessage: 'AI Concierge is temporarily busy. Please continue directly on WhatsApp.',
    },
  },
  ar: {
    meta: {
      pageTitle: 'MUNGU ANA WEZA — بنية تحتية ذكية لإدارة الأعمال والتجارة',
      pageDescription:
        'شركة MUNGU ANA WEZA للبرمجيات السحابية والذكاء الاصطناعي (munguanaweza.com): نظام PIECES PRO / NOVA OS، منصة SOKO MUNGU، محرك MUNGU AI وهندسة البرمجيات المخصصة.',
    },
    a11y: {
      skipToContent: 'الانتقال إلى المحتوى الرئيسي',
      primaryNav: 'التنقل الرئيسي',
      mobileNav: 'قائمة الهاتف',
      languageSelector: 'اختيار اللغة',
      footerNav: 'روابط التذييل',
    },
    nav: {
      accueil: 'الرئيسية',
      piecesPro: 'PIECES PRO',
      sokoMungu: 'SOKO MUNGU',
      munguAi: 'MUNGU AI',
      operations: 'عمليات MUANS',
      solutions: 'الهندسة',
      tarifs: 'الأسعار',
      contact: 'تواصل معنا',
      menuOpen: 'فتح القائمة',
      menuClose: 'إغلاق القائمة',
    },
    hero: {
      kicker: 'منصة برمجيات سحابية وذكاء اصطناعي · munguanaweza.com',
      headline: 'بنية تحتية ذكية لإدارة الأعمال والتجارة',
      subheadline:
        'تبني شركة MUNGU ANA WEZA أنظمة سحابية وحلول ذكاء اصطناعي متكاملة لإدارة المخزون والمبيعات متعددة العملات، ودعم القرار المؤسسي، وهندسة المنصات البرمجية المخصصة وفق أعلى المعايير العالمية.',
      ctaTrial: 'ابدأ التجربة المجانية 7 أيام',
      ctaContact: 'تواصل معنا',
      ctaWhatsapp: 'واتساب المباشر (+243 891 733 969)',
      whatsappGreeting:
        'مرحباً MUNGU ANA WEZA، أود التعرف على حلولكم البرمجية وبدء التجربة المجانية لمدة 7 أيام.',
      imageAlt: 'البنية السحابية والذكاء الاصطناعي لشركة MUNGU ANA WEZA',
      pillars: [
        {
          title: 'PIECES PRO / NOVA OS',
          description: 'نظام سحابي متكامل للمخزون، ونقاط البيع (POS)، والمبيعات والأقساط متعددة العملات.',
          href: '#pieces-pro',
        },
        {
          title: 'SOKO MUNGU',
          description: 'رؤية منصة التجارة والربط التجاري الذكي القادمة ضمن منظومتنا المتكاملة.',
          href: '#soko-mungu',
        },
        {
          title: 'MUNGU AI',
          description: 'محرك تحليلات ذكية ودعم القرار للشركات والتجار تحت إشراف بشري كامل.',
          href: '#mungu-ai',
        },
        {
          title: 'هندسة البرمجيات',
          description: 'منصات الويب والتطبيقات، وأنظمة ERP / CRM المخصصة، وحلول النمو الرقمي.',
          href: '#solutions',
        },
      ],
    },
    piecesPro: {
      kicker: '01 · المنصة السحابية الأساسية',
      title: 'PIECES PRO / NOVA OS',
      subtitle: 'نظام سحابي وذكي متكامل للمخزون ونقاط البيع والمبيعات والتحصيل متعدد العملات',
      description:
        'صُمم PIECES PRO / NOVA OS ليكون النواة التشغيلية للشركات والموزعين والشبكات التجارية؛ حيث يوحّد إدارة المخزون الفورية، وكاشير نقاط البيع (POS)، ومتابعة المبيعات النقدية والأقساط بعدة عملات (USD / FC / EUR).',
      trialHighlightTitle: 'تجربة مجانية شاملة لمدة 7 أيام',
      trialHighlightBody:
        'اختبر نظام PIECES PRO / NOVA OS في عملك الفعلي لمدة 7 أيام مجاناً دون أي التزام مع مرافقة كاملة لتهيئة الأصناف والعملات.',
      ctaStartTrial: 'ابدأ التجربة المجانية (7 أيام)',
      ctaSubscribe: 'استعرض الباقات',
      ctaWhatsappTrial: 'تفعيل عبر واتساب',
      whatsappTrialMessage:
        'مرحباً MUNGU ANA WEZA، أرغب في بدء التجربة المجانية لمدة 7 أيام لنظام PIECES PRO / NOVA OS.',
      features: [
        {
          title: 'إدارة مخزون فورية متعددة العملات',
          detail: 'تتبع الكميات، وسعر التكلفة، وسعر الكاش والتقسيط بعملات USD / FC / EUR.',
        },
        {
          title: 'نقاط بيع (POS) سريعة ومربوطة',
          detail: 'تسجيل فوري للمبيعات في المتجر مع خصم تلقائي للمخزون وتحديث الإيرادات.',
        },
        {
          title: 'متابعة الأقساط والتحصيل بدقة',
          detail: 'احتساب المبالغ المتبقية وتواريخ الاستحقاق وتنبيهات الحسابات المتأخرة.',
        },
      ],
      preview: {
        appTitle: 'PIECES PRO / NOVA OS',
        subtitleLabel: 'بيئة الأعمال ونقاط البيع السحابية',
        tabs: {
          dashboard: 'لوحة التحكم',
          inventory: 'المخزون',
          pos: 'POS',
          installments: 'الأقساط',
        },
        collectedLabel: 'المبالغ المحصّلة',
        overdueLabel: 'حسابات متأخرة',
        unitsLabel: 'وحدات المخزون',
        receivablesLabel: 'مستحقات قيد التحصيل',
        searchPlaceholder: 'ابحث برقم الصنف أو الاسم...',
        costLabel: 'التكلفة',
        cashLabel: 'كاش',
        creditLabel: 'تقسيط',
        qtyLabel: 'الكمية',
        dueDateLabel: 'الاستحقاق',
        paidLabel: 'المدفوع',
        remainingLabel: 'المتبقي',
        recordPaymentBtn: 'تحصيل 25 $',
        settledLabel: 'مكتمل',
        posSelectPrompt: 'اختر صنفاً لتسجيل عملية بيع فورية عبر نقطة البيع:',
        posRecordSaleBtn: 'تأكيد البيع (POS)',
        posSaleConfirmed: 'تم تسجيل عملية البيع وتحديث المخزون.',
        statusOnTime: 'منتظم',
        statusLatePrefix: 'تأخير',
        statusDaysUnit: 'يوم',
        statusRisk: 'متابعة +30 يوم',
        addItemBtn: 'إضافة صنف',
        cancelBtn: 'إلغاء',
        saveItemBtn: 'حفظ',
        itemNamePlaceholder: 'اسم الصنف',
        emptyInventory: 'لا توجد أصناف مطابقة لبحثك.',
        footerNote: 'معاينة تفاعلية · بنية سحابية متعددة العملات',
      },
    },
    sokoMungu: {
      kicker: '02 · منصة قادمة ضمن المنظومة',
      title: 'SOKO MUNGU',
      subtitle: 'رؤية منصة التجارة والربط التجاري الذكي بين الشركات والتجار والمشترين',
      description:
        'يمثل SOKO MUNGU المرحلة المقبلة في منظومة MUNGU ANA WEZA للربط التجاري الرقمي بين المؤسسات العاملة عبر PIECES PRO / NOVA OS وشبكة الموردين والمشترين بوضوح وموثوقية.',
      noticeTitle: 'منصة قادمة قيد التطوير ضمن المنظومة',
      noticeBody:
        'يُعرض قسم SOKO MUNGU هنا للتعريف برؤيته ودوره المستقبلي في المنظومة؛ ولا يوجد حالياً متجر إلكتروني عام أو دفع آلي مباشر مفعّل عبر هذه الصفحة.',
      imageAlt: 'رؤية منصة التجارة الرقمية SOKO MUNGU',
      roadmapTitle: 'الركائز المخططة للمنصة',
      roadmapItems: [
        {
          number: '01.',
          title: 'دليل تجاري موثوق',
          detail: 'عرض منظم لكتالوجات التجار والموردين المعتمدين لسهولة الوصول والمقارنة.',
        },
        {
          number: '02.',
          title: 'تكامل مع PIECES PRO / NOVA OS',
          detail: 'ربط مستقبلي يتيح مزامنة حالة التوفر مباشرة من المخزون السحابي دون جهد إضافي.',
        },
        {
          number: '03.',
          title: 'توجيه ذكي للطلبات',
          detail: 'تنظيم طلبات الشراء والتوريد مع تأكيد بشري مباشر بين البائع والمشتري.',
        },
      ],
      ctaInterest: 'سجّل اهتمامك للوصول المبكر',
    },
    munguAi: {
      kicker: '03 · الذكاء التحليلي ودعم القرار',
      title: 'MUNGU AI',
      subtitle: 'محرك التحليلات الذكية ودعم القرار للشركات والتجار',
      description:
        'يحوّل محرك MUNGU AI بيانات المبيعات والمخزون والتحصيل إلى مؤشرات عملية تساعد الإدارات على رصد سرعة الدوران، وتحديد أولويات التموين، وتقديم تجربة استشارية ذكية متعددة اللغات.',
      disclaimerTitle: 'مساعدة تحليلية تحت الإشراف البشري',
      disclaimerBody:
        'يعمل MUNGU AI كمحرك تحليلي داعم لاتخاذ القرار فقط، ولا يُصدر قرارات مالية أو ائتمانية تلقائية؛ إذ تبقى جميع الاعتمادات التجارية بيد الإدارة البشرية بالكامل.',
      imageAlt: 'واجهة محرك التحليلات الذكية MUNGU AI',
      capabilities: [
        {
          number: '01.',
          title: 'قراءة حركة ودوران المخزون',
          detail: 'كشف الأصناف الأكثر طلباً والتنبيه المبكر قبل نفاد الكميات الأساسية.',
        },
        {
          number: '02.',
          title: 'ترتيب أولويات التحصيل',
          detail: 'تلخيص مواعيد الاستحقاق لتسهيل المتابعة اليومية الدقيقة لفريق المبيعات.',
        },
        {
          number: '03.',
          title: 'مستشار ذكي متعدد اللغات',
          detail: 'إجابة الزوار والعملاء بالفرنسية والإنجليزية والعربية وتأهيل الطلبات بسلاسة.',
        },
      ],
      ctaOpenAssistant: 'تحدث مع المستشار الذكي',
      ctaAskWhatsapp: 'استشر فريقنا الآن',
    },
    agentCalculator: {
      kicker: '03B · حاسبة عائد الأتمتة بالذكاء الاصطناعي',
      title: 'حاسبة كفاءة فريق وكلاء الذكاء الاصطناعي',
      subtitle:
        'احسب الساعات الأسبوعية المستردة والوفورات الشهرية والعائد السنوي المتوقع عند أتمتة المهام التشغيلية المتكررة لفريقك.',
      tasksLabel: 'عدد المهام المؤتمتة أسبوعياً',
      tasksUnit: 'مهمة',
      timeLabel: 'الوقت اليدوي لكل مهمة (دقيقة)',
      timeUnit: 'دقيقة',
      rateLabel: 'التكلفة الساعية للعمل ($)',
      rateUnit: '$/ساعة',
      calculateBtn: 'احسب الوفورات والعائد',
      resetBtn: 'إعادة ضبط',
      resultsTitle: 'إمكانات تشغيل فريق وكلاء الذكاء الاصطناعي',
      weeklyHoursLabel: 'الساعات المستردة أسبوعياً',
      hoursShortUnit: 'ساعة',
      monthlySavingsLabel: 'الوفورات الشهرية المقدرة',
      efficiencyBoostLabel: 'تحسّن كفاءة الفريق',
      annualRoiLabel: 'العائد السنوي على الاستثمار (ROI)',
      assumptionNote:
        'أساس الحساب التقديري: 4 أسابيع شهرياً، معيار 40 ساعة عمل أسبوعياً لقياس الكفاءة، وتكلفة تشغيل تقديرية 50 $ شهرياً لخدمة السحابة / API.',
      deployCta: 'اطلب نشر الوكلاء الأذكياء',
      askTeamCta: 'استشر المستشار الذكي',
    },
    operations: {
      kicker: '03C · MUANS GO و MUANS Admin',
      title: 'مركز العمليات · طلبات التوصيل والمراسلة ولوحة الإدارة',
      subtitle:
        'أنشئ طلبات التوصيل واقبلها فورياً، ونسّق مع السائقين والتجار عبر المراسلة الداخلية، وتابع المؤشرات عبر لوحة تحكم الإدارة.',
      adminToggleBtn: 'لوحة الإدارة',
      auth: {
        signInBtn: 'تسجيل الدخول عبر Google',
        signingInBtn: 'جاري الدخول...',
        signOutBtn: 'تسجيل الخروج',
        signedInAsLabel: 'مسجّل باسم:',
        adminVerifiedLabel: 'مدير موثّق',
        signInRequiredTitle: 'يلزم تسجيل الدخول للوصول إلى العمليات الفورية',
        signInRequiredBody:
          'سجّل الدخول بحساب Google لنشر طلبات توصيل MUANS GO أو قبولها، واستخدام المراسلة الداخلية، والوصول إلى صلاحيات الإدارة المعتمدة.',
        unverifiedEmailError: 'يجب أن يكون بريد حساب Google موثقاً للوصول إلى مركز العمليات.',
        authErrorGeneric: 'تعذر إتمام تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.',
      },
      adminPanel: {
        title: 'لوحة التحكم العليا (Admin)',
        subtitle: 'متابعة فورية لطلبات التوصيل، والسائقين النشطين، والعمولات المقدرة ($1.50 لكل طلب مقبول).',
        restrictedTitle: 'دخول مخصص للمدير المعتمد',
        restrictedBody:
          'سجّل الدخول بحساب المدير المعتمد (munguanawaza@gmail.com) لاستعراض الإيرادات وإدارة جميع الطلبات.',
        totalOrdersLabel: 'إجمالي الطلبات',
        activeDriversLabel: 'السائقون النشطون',
        estimatedRevenueLabel: 'الإيرادات المقدرة',
        commissionNote: 'تُحتسب بمعدل 1.50 $ لكل طلب مقبول أو مكتمل.',
        tableCustomer: 'العميل / الوجهة',
        tableDetails: 'التفاصيل',
        tableStatus: 'الحالة',
        tableDate: 'التاريخ',
        tableActions: 'إجراءات',
        emptyTable: 'لا توجد طلبات مسجلة حتى الآن.',
        completeAction: 'إتمام',
        cancelAction: 'إلغاء',
      },
      orders: {
        title: 'طلبات التوصيل',
        subtitle: 'قائمة التوصيل النشطة لـ MUANS GO · مزامنة فورية',
        customerPlaceholder: 'اسم العميل أو العنوان (مثل: حي ديلالا)...',
        detailsPlaceholder: 'تفاصيل الطرد أو تعليمات التوصيل...',
        publishBtn: 'نشر الطلب',
        publishingBtn: 'جاري النشر...',
        validationError: 'يرجى إدخال الوجهة والتفاصيل (حرفان على الأقل لكل منهما).',
        createdFeedback: 'تمت إضافة الطلب إلى قائمة الانتظار النشطة.',
        acceptBtn: 'قبول الطلب',
        completeBtn: 'تأكيد التسليم',
        cancelBtn: 'إلغاء',
        emptyQueue: 'لا توجد طلبات نشطة حالياً.',
        statusPending: 'قيد الانتظار',
        statusAccepted: 'مقبول',
        statusCompleted: 'مكتمل',
        statusCancelled: 'ملغى',
        assignedToLabel: 'السائق:',
        createdByLabel: 'بواسطة:',
      },
      chat: {
        title: 'المراسلة الداخلية',
        subtitle: 'قناة عمليات كولويزي · السائقون والتجار والفريق',
        roleLabel: 'الدور التشغيلي',
        roles: {
          driver: 'سائق',
          merchant: 'تاجر',
          employee: 'موظف',
          admin: 'مدير',
        },
        messagePlaceholder: 'اكتب رسالة لفريق العمليات...',
        sendBtn: 'إرسال',
        sendingBtn: 'جاري الإرسال...',
        emptyMessages: 'لا توجد رسائل في القناة بعد.',
        validationError: 'يرجى كتابة رسالة صالحة (بحد أقصى 1000 حرف).',
        adminRoleLockedNote: 'صفة المدير متاحة للحسابات الإدارية المعتمدة فقط.',
      },
      errorBoundary: {
        fallbackTitle: 'مساحة العمليات غير متاحة مؤقتاً',
        fallbackMessage:
          'حدثت مشكلة في الصلاحيات أو المزامنة اللحظية مع قاعدة البيانات.',
        retryLabel: 'إعادة المحاولة',
      },
    },
    engineering: {
      kicker: '04 · هندسة البرمجيات والتحول الرقمي',
      title: 'حلول هندسية مصممة لمتطلبات المؤسسات',
      subtitle:
        'إلى جانب منتجاتنا السحابية، نبني لعملائنا منصات رقمية عالية الاعتمادية وأنظمة إدارة مؤسسية مخصصة ومستدامة.',
      selectAction: 'اطلب عرضاً تقنياً',
      services: [
        {
          number: '01.',
          id: 'web_mobile',
          title: 'منصات الويب وتطبيقات الجوال',
          summary:
            'تطوير بوابات ويب متقدمة وتطبيقات هواتف ذكية لأنظمة iOS وAndroid بأعلى معايير الأداء والأمان.',
          deliverables: ['منصات سحابية', 'تطبيقات iOS وAndroid', 'واجهات API آمنة'],
        },
        {
          number: '02.',
          id: 'erp_crm',
          title: 'أنظمة ERP وCRM مخصصة',
          summary:
            'بناء أنظمة أعمال مصممة لمسارات شركتك تشمل ربط الفروع، والتدقيق المالي، وإدارة صلاحيات الفرق.',
          deliverables: ['مسارات عمل مخصصة', 'مزامنة الفروع', 'إدارة الصلاحيات'],
        },
        {
          number: '03.',
          id: 'digital_growth',
          title: 'النمو الرقمي والتسويق',
          summary:
            'تصميم منظومات الاستقطاب الرقمي، وإدارة القنوات الاجتماعية، وتحليل التحويلات لتعزيز الإيرادات.',
          deliverables: ['استقطاب موجّه', 'إدارة القنوات', 'تحليلات الأداء'],
        },
      ],
    },
    tarifs: {
      kicker: '05 · الباقات والأسعار العالمية',
      title: 'باقات مرنة تنمو مع توسع أعمالك',
      subtitle:
        'ابدأ بتجربة مجانية لمدة 7 أيام على PIECES PRO / NOVA OS، واختر الباقة الملائمة لحجم فريقك ونقاط البيع لديك.',
      currencyNoteTitle: 'دعم الدفع الدولي والمحلي بآلية تأكيد مرنة',
      currencyNoteBody:
        'الباقات مسعّرة بالدولار الأمريكي (USD)، مع دعم كامل لوسائل الدفع المعتمدة: M-Pesa وAirtel Money وOrange Money والتحويل البنكي، وفق آلية تأكيد مرنة وإصدار فواتير منظمة.',
      paymentMethodsBadge: 'M-Pesa · Airtel Money · Orange Money · التحويل البنكي',
      selectPlanBtn: 'اختر هذه الباقة',
      recommendedTag: 'الأكثر اختياراً',
      plans: [
        {
          id: 'trial-7d',
          name: 'Free Trial',
          usdPrice: '0 $',
          period: '7 أيام',
          summary: 'اختبر كافة إمكانات PIECES PRO / NOVA OS في عملك الفعلي.',
          features: [
            'إدارة المخزون والكتالوج متعدد العملات',
            'نقطة بيع (POS) وإيصالات سريعة',
            'متابعة الأقساط لمدة 7 أيام',
            'مرافقة وإعداد مبدئي للحساب',
          ],
        },
        {
          id: 'standard',
          name: 'Standard',
          usdPrice: '15 $',
          period: '/ شهرياً',
          summary: 'الحزمة الأساسية لرقمنة متجر أو نقطة بيع واحدة بكفاءة.',
          features: [
            'إدارة كاملة للمخزون ونقطة البيع (POS)',
            'عرض متعدد العملات (USD / FC / EUR)',
            'نقطة بيع نشطة واحدة',
            'دعم عبر واتساب والبريد الإلكتروني',
          ],
        },
        {
          id: 'pro',
          name: 'Pro',
          usdPrice: '35 $',
          period: '/ شهرياً',
          summary: 'مثالية للأنشطة المتنامية التي تدير البيع بالتقسيط وعدة مستخدمين.',
          highlighted: true,
          features: [
            'جميع مزايا باقة Standard',
            'متابعة التحصيل وأعمار الديون',
            'تعدد المستخدمين وصلاحيات الفريق',
            'لوحات تحليلات MUNGU AI',
          ],
        },
        {
          id: 'entreprise',
          name: 'Enterprise',
          usdPrice: '150 $+',
          period: '/ شهرياً',
          summary: 'بنية سحابية متعددة الفروع مع تكاملات مخصصة ودعم مؤسسي.',
          features: [
            'دمج عدة فروع ومستودعات مركزية',
            'تكاملات وأتمتة ERP وCRM مخصصة',
            'تدريب الفريق والإطلاق المخصص',
            'دعم هندسي بأولوية واتفاقية خدمة',
          ],
        },
      ],
      paymentStepsTitle: 'خطوات اشتراك مرنة وسريعة',
      paymentSteps: [
        {
          step: '01.',
          title: 'اختيار الباقة أو التجربة',
          detail: 'أرسل طلبك عبر نموذج الموقع أو تواصل مباشرة عبر واتساب.',
        },
        {
          step: '02.',
          title: 'السداد عبر القناة المناسبة لك',
          detail: 'اختر الدفع عبر M-Pesa أو Airtel Money أو Orange Money أو التحويل البنكي.',
        },
        {
          step: '03.',
          title: 'تأكيد مرن وتفعيل فوري',
          detail: 'بمجرد تأكيد عملية الدفع أو التحويل، يتم تفعيل بيئتك السحابية مباشرة.',
        },
      ],
    },
    trust: {
      kicker: '06 · الثقة والحوكمة المؤسسية',
      title: 'بنية برمجية تقوم على الشفافية والتحكم التشغيلي الكامل',
      subtitle:
        'تعتمد جميع حلول MUNGU ANA WEZA على التزامات واضحة وقابلة للتحقق: حماية البيانات، إشراف بشري كامل على الذكاء الاصطناعي، وفوترة رسمية موثقة.',
      pillars: [
        {
          index: '01.',
          iconKey: 'shield',
          title: 'أمان السحابة وصلاحيات الوصول',
          description:
            'صلاحيات دقيقة حسب الدور الوظيفي، اتصال مشفر عبر TLS، نسخ احتياطي منظم، وعزل كامل لبيانات كل مؤسسة.',
        },
        {
          index: '02.',
          iconKey: 'cpu',
          title: 'ذكاء اصطناعي بإشراف بشري',
          description:
            'تقدّم خوارزميات التحليل توصيات عملية للمخزون والأقساط مع بقاء القرار المالي والاعتماد النهائي بيد الإدارة.',
        },
        {
          index: '03.',
          iconKey: 'receipt',
          title: 'فوترة شفافة وتوثيق الدفع',
          description:
            'تسعير واضح بالدولار الأمريكي مع فواتير رسمية وتأكيد موثق لعمليات السداد عبر Mobile Money أو التحويل البنكي.',
        },
        {
          index: '04.',
          iconKey: 'headphones',
          title: 'تجربة 7 أيام ودعم هندسي مباشر',
          description:
            'اختبر نظام PIECES PRO / NOVA OS ببيانات متجرك الفعلية قبل الاشتراك، مع مرافقة مباشرة عبر واتساب والبريد الرسمي.',
        },
      ],
      assuranceStripTitle: 'التزامات موثقة · munguanaweza.com',
      assuranceItems: [
        'الهوية الرسمية لشركة MUNGU ANA WEZA',
        'تجربة مجانية كاملة 7 أيام مقابل 0 $',
        'دعم العملات USD / FC / EUR',
        'تواصل مباشر: +243 891 733 969',
      ],
      ctaLabel: 'فعّل التجربة المجانية 7 أيام',
    },
    contact: {
      kicker: '07 · التواصل المباشر والانطلاق',
      title: 'ابدأ تجربتك المجانية أو ناقش مشروعك التقني',
      subtitle:
        'فريق الحلول لدينا جاهز لتفعيل التجربة المجانية لمدة 7 أيام، أو إعداد عرض فني مخصص، أو ترتيب عرض توضيحي مباشر.',
      channels: {
        whatsappTitle: 'واتساب العالمي',
        whatsappValue: '+243 891 733 969',
        whatsappNote: 'القناة الأسرع لتفعيل التجربة المجانية 7 أيام وتأكيد الاشتراكات.',
        whatsappAction: 'مراسلة عبر واتساب',
        emailTitle: 'البريد الرسمي',
        emailValue: 'munguanawaza@gmail.com',
        emailCopy: 'نسخ البريد',
        emailCopied: 'تم النسخ',
        locationTitle: 'المقر الرئيسي',
        locationValue: 'كولويزي، جمهورية الكونغو الديمقراطية',
        locationDetail: 'munguanaweza.com · خدمات سحابية بلا حدود',
      },
      map: {
        title: 'MUANS GO — الملاحة والمقر الرئيسي في كولويزي',
        subtitle:
          'حدد موقع مقر MUNGU ANA WEZA في كولويزي، وأضف نقاط الشركاء التجاريين، أو احفظ المواقع محلياً للرجوع إليها دون إنترنت.',
        hqLabel: 'MUNGU ANA WEZA — المقر الرئيسي',
        searchPlaceholder: 'ابحث عن حي أو شريك (مثل: Dilala, Kolwezi)...',
        searchBtn: 'بحث',
        searchingLabel: 'جاري البحث...',
        roadmapLabel: 'خريطة',
        satelliteLabel: 'قمر صناعي',
        recenterBtn: 'العودة إلى المقر',
        openExternalBtn: 'فتح في خرائط Google',
        loadingLabel: 'جاري تحميل خرائط Google...',
        noResultsLabel: 'لم يتم العثور على نتائج مطابقة لهذا البحث.',
        unavailableLabel: 'الخريطة التفاعلية غير متاحة حالياً.',
        missingKeyNote: 'يمكنك فتح الموقع المعتمد مباشرة عبر خرائط Google.',
        onlineStatusLabel: 'متصل بالإنترنت',
        offlineStatusLabel: 'وضع عدم الاتصال (الذاكرة المحلية)',
        addPartnerBtn: 'إضافة شريك (ديلالا)',
        addingPartnerLabel: 'جاري التحديد...',
        partnerAddedFeedback: 'تمت إضافة الشريك على خريطة MUANS GO.',
        saveOfflineBtn: 'حفظ للعمل دون إنترنت',
        offlineSavedFeedback: 'تم حفظ المواقع محلياً (صلاحية 30 يوماً).',
        savedLocationsTitle: 'المواقع المحفوظة محلياً',
        clearCacheBtn: 'مسح المحفوظات',
      },
      form: {
        title: 'نموذج طلب عرض سعر أو تجربة مجانية (7 أيام)',
        subtitle: 'أرسل بياناتك للحصول على رقم مرجعي وملخص جاهز للإرسال عبر واتساب.',
        whatsappHeader: 'طلب جديد — munguanaweza.com (MUNGU ANA WEZA)',
        planLabel: 'المنتج أو الباقة المطلوبة',
        planOptions: [
          { id: 'trial-7d', label: 'PIECES PRO / NOVA OS — تجربة مجانية 7 أيام (0 $)' },
          { id: 'standard', label: 'PIECES PRO / NOVA OS — Standard (15 $/شهرياً)' },
          { id: 'pro', label: 'PIECES PRO / NOVA OS — Pro (35 $/شهرياً)' },
          { id: 'entreprise', label: 'Enterprise — متعدد الفروع ومخصص (150 $+/شهرياً)' },
          { id: 'engineering', label: 'هندسة البرمجيات — ويب، تطبيقات، أو ERP / CRM' },
          { id: 'soko-mungu', label: 'SOKO MUNGU — شراكة ووصول مبكر' },
          { id: 'mungu-ai', label: 'MUNGU AI — التحليلات ودعم القرار' },
        ],
        nameLabel: 'الاسم الكامل *',
        namePlaceholder: 'اكتب اسمك الكامل',
        companyLabel: 'الشركة أو المؤسسة',
        companyPlaceholder: 'اسم الشركة أو النشاط (اختياري)',
        contactLabel: 'رقم واتساب أو البريد الإلكتروني *',
        contactPlaceholder: '+243 ... أو name@company.com',
        briefLabel: 'تفاصيل الطلب أو المشروع *',
        briefPlaceholder: 'اذكر حجم فريقك، عدد الفروع، أو المتطلبات التقنية...',
        submitBtn: 'إرسال الطلب',
        submittingBtn: 'جاري الإرسال...',
        directWhatsappBtn: 'تواصل عبر واتساب',
        validationEmptyError: 'يرجى إدخال الاسم ووسيلة التواصل وتفاصيل الطلب.',
        validationContactError: 'يرجى إدخال رقم هاتف أو بريد إلكتروني صحيح.',
        validationBriefError: 'يرجى كتابة 6 أحرف على الأقل لوصف طلبك.',
        successTitle: 'تم تسجيل طلبك بنجاح',
        successReferenceLabel: 'رقم المرجع',
        successMessage:
          'تم حفظ تفاصيل طلبك. يمكنك إرسال الملخص أدناه مباشرة عبر واتساب لتسريع التفعيل والتواصل.',
        summaryHeading: 'ملخص الطلب',
        sendSummaryWhatsappBtn: 'إرسال الملخص عبر واتساب',
        resetBtn: 'إرسال طلب جديد',
      },
    },
    footer: {
      tagline: 'بنية تحتية ذكية لإدارة الأعمال والذكاء الاصطناعي والتجارة الرقمية.',
      location: 'المقر الرئيسي: كولويزي، الكونغو الديمقراطية · munguanaweza.com',
      rights: 'MUNGU ANA WEZA. جميع الحقوق محفوظة.',
    },
    assistant: {
      launcherLabel: 'المستشار الذكي',
      panelTitle: 'المستشار الذكي · MUNGU ANA WEZA',
      panelSubtitle: 'مستشار المبيعات والحلول التقنية',
      welcomeMessage:
        'مرحباً بك. أنا المستشار الذكي لشركة MUNGU ANA WEZA. يمكنك سؤالي عن نظام PIECES PRO / NOVA OS والتجربة المجانية 7 أيام، أو SOKO MUNGU، أو MUNGU AI، أو هندسة البرمجيات، أو باقاتنا (Standard 15$، Pro 35$، Enterprise 150+$).',
      quickPrompts: [
        'كيف أبدأ التجربة المجانية 7 أيام؟',
        'ما هي الباقات ووسائل الدفع المتاحة؟',
        'اشرح لي نظام PIECES PRO / NOVA OS',
      ],
      inputPlaceholder: 'اكتب سؤالك هنا...',
      sendLabel: 'إرسال',
      closeLabel: 'إغلاق المستشار',
      thinkingLabel: 'جاري التحليل...',
      whatsappHandoffLabel: 'إتمام الطلب مع مستشارنا على واتساب',
      whatsappHandoffMessage:
        'مرحباً MUNGU ANA WEZA، لقد استشرت المساعد الذكي في munguanaweza.com وأود إتمام طلبي.',
      errorMessage: 'المستشار الذكي مشغول مؤقتاً. يمكنك المتابعة مباشرة عبر واتساب.',
    },
  },
};
