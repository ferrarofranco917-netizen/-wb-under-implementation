// ========= LOCALE MAP GLOBALE =========
const LOCALE_MAP = { 
    it: 'it-IT', 
    en: 'en-GB', 
    es: 'es-ES', 
    fr: 'fr-FR' 
};

// ========= CLASSE PRINCIPALE =========
class BudgetWise {
    constructor() {
        // ========== DATI INIZIALI ==========
        this.license = null;
        
        this.data = {
            incomes: [],
            fixedExpenses: [],
            variableExpenses: {},
            savingsPercent: 0,
            savingsGoal: 0,
            savingsPot: 0,
            threshold: 50,
            language: 'it',
            periodStart: '',
            periodEnd: ''
        };

        // Inizializza il periodo di default
        this.data.periodStart = this.getDefaultPeriodStart();
        this.data.periodEnd = this.getDefaultPeriodEnd();
        
        this.chart = null;
        this.categoryExpenses = {};
        
        // ========== STATO VISUALIZZAZIONE FISSE IN HOME ==========
        this.showFixedInHome = localStorage.getItem('budgetwise-show-fixed-home') !== 'false';
        
        // ========== STATO VISUALIZZAZIONE FISSE NEL TAB ==========
        this.showFixedList = localStorage.getItem('budgetwise-show-fixed-list') !== 'false';
        
        // ========== REGOLE CATEGORIE APPRESE ==========
        this.categoryRules = this.migrateCategoryRules(JSON.parse(localStorage.getItem('budgetwise-category-rules')) || {});
        this.CATEGORY_CONFIDENCE_THRESHOLD = 3;
        
        // ========== CATEGORIE PERSONALIZZATE ==========
        this.defaultCategories = ['Alimentari', 'Trasporti', 'Altro'];
        const savedCustom = JSON.parse(localStorage.getItem('budgetwise-custom-categories')) || [];
        this.customCategories = savedCustom.filter(cat => !this.defaultCategories.includes(cat));

        // ========== UI STATE ==========
        this.showAllExpenses = localStorage.getItem('budgetwise-show-all-expenses') === 'true';
        this.fixedDateFormat = localStorage.getItem('budgetwise-fixed-date-format') || 'days';
        this.searchTerm = '';
        this.searchCategoryFilter = 'all';
        this.filteredExpenses = [];
        
        // ========== COLORI PERSONALIZZATI ==========
        const savedColors = localStorage.getItem('budgetwise-custom-colors');
        if (savedColors) {
            this.customColors = JSON.parse(savedColors);
        } else {
            this.customColors = null;
        }
        
        this.customColorsTheme = localStorage.getItem('budgetwise-custom-colors-theme') || null;
        
        // ========== TRADUZIONI ==========
        this.translations = {
            it: {
                savingsWidgetTitle: 'Raggiungerai il tuo obiettivo',
                savingsPotInputLabel: 'Risparmi iniziali (€)',
                excelSheetPlaceholder: 'Carica un file Excel',
                excelHelp: '⚠️ I file Excel vengono convertiti automaticamente',
                never: "Mai",
                currentPaceReachOn: "Al ritmo attuale, raggiungerai l'obiettivo il {date}",
                goalNotReachable: "Con questi parametri non raggiungerai l'obiettivo",
                savingsSuggestionTitle: "Suggerimento",
                applySuggestion: "Applica suggerimento",
                increaseToPercentToArriveEarlier: "Aumenta al {percent}% per arrivare {months} mesi prima!",
                increaseToPercentToArriveEarlier_one: "Aumenta al {percent}% per arrivare {months} mese prima!",
                suggestionAppliedToast: "💡 Suggerimento applicato: {percent}% di risparmio",
                onboardingDemo: "✨ Carica demo",
                loadDemo: "Carica demo",
                savingsPotLabel: 'Piano risparmi',
                searchPlaceholder: 'Cerca per descrizione, categoria o importo',
                maybeLater: 'Forse dopo',
                resetColors: 'Ripristina colori predefiniti',
                colorsTitle: '🎨 Personalizza colori',
                colorsSubtitle: 'Scegli i tuoi colori preferiti per personalizzare l\'app.',
                fixedPaid: '✅ Pagata',
                fixedPlanned: '⏳ Prevista',
                fixedDue: 'Scadenza',
                fixedFound: 'Trovata',
                budget: 'Budget giornaliero',
                remaining: 'Rimanenza',
                days: 'Giorni rimasti',
                period: 'Periodo',
                totalIncome: 'Totale entrate',
                startGuide: '👋 Inizia inserendo le tue entrate nella sezione qui sotto!',
                incomes: '🏦 Entrate del periodo',
                fixed: '📌 Spese fisse mensili',
                variable: '🧾 Spese variabili',
                chart: '📊 Distribuzione spese',
                assistant: '🤖 Assistente Finanziario AI',
                savings: '🎯 Obiettivo risparmio',
                settings: '⚙️ Impostazioni',
                badge: 'multiplo',
                addIncome: '➕ Aggiungi entrata',
                addFixed: '➕ Aggiungi spesa fissa',
                addExpense: '➕ Aggiungi spesa',
                resetDay: '🗑️ Cancella spese del giorno',
                resetVariablePeriod: '🗑️ Cancella spese variabili del periodo',
                confirmResetVariablePeriod: 'Sei sicuro di voler cancellare TUTTE le spese variabili del periodo corrente?',
                variablePeriodReset: 'Spese variabili del periodo cancellate!',
                noVariablePeriodToReset: 'Non ci sono spese variabili da cancellare in questo periodo.',
                applySavings: 'Applica risparmio',
                backup: '💾 Scarica backup',
                restore: '📂 Ripristina',
                resetAll: '⚠️ Reset completo',
                export: '📅 Esporta in Calendar',
                send: 'Invia',
                incomeDesc: 'Descrizione (es. Stipendio)',
                incomeAmount: 'Importo €',
                incomeDateLabel: 'Data',
                fixedName: 'Nome (es. Mutuo)',
                fixedAmount: 'Importo €',
                fixedDay: 'Giorno (es. 27)',
                expenseName: 'Cosa hai comprato?',
                expenseAmount: '€',
                chatPlaceholder: 'Es. Quanto posso risparmiare questo mese?',
                dateLabel: 'Seleziona data:',
                dayLabel: 'Giorno del mese',
                endDateLabel: 'Data scadenza (fine)',
                percentLabel: 'Percentuale su entrate (%)',
                goalLabel: 'Obiettivo (€)',
                thresholdLabel: '🔔 Soglia avviso (€)',
                languageLabel: '🌍 Lingua',
                backupLabel: '📅 Backup dati',
                micFixed: '🎤 Tocca e di\' tutto in una frase',
                micVariable: '🎤 Tocca per parlare',
                helpFixed: '⏰ Verrà conteggiata automaticamente ogni mese fino alla scadenza',
                chartNote: 'Aggiungi spese per vedere il grafico',
                noIncome: 'Nessuna entrata',
                noFixed: 'Nessuna spesa fissa',
                noVariable: 'Nessuna spesa in questo giorno',
                welcomeMessage: 'Ciao! Sono il tuo assistente finanziario. Chiedimi qualsiasi cosa sul tuo budget!',
                suggestion1: '💶 Risparmia 100€',
                suggestion2: '🔮 Simula aumento',
                suggestion3: '🎯 Obiettivo',
                suggestion4: '📊 Top categoria',
                assistantName: 'Assistente',
                incomeAdded: '✅ Entrata aggiunta!',
                incomeDeleted: '🗑️ Entrata eliminata',
                fixedAdded: '✅ Spesa fissa aggiunta!',
                fixedDeleted: '🗑️ Spesa eliminata',
                expenseAdded: '✅ Spesa aggiunta!',
                expenseDeleted: '🗑️ Spesa eliminata',
                dayReset: '🗑️ Spese del giorno cancellate',
                savingsApplied: '💰 Risparmio applicato!',
                backupDownloaded: '💾 Backup scaricato!',
                dataRestored: '📂 Dati ripristinati!',
                resetCompleted: '🔄 Reset completato',
                calendarExported: '📅 Calendario esportato!',
                fillFields: '⚠️ Compila tutti i campi',
                invalidDay: '⚠️ Giorno non valido (1-31)',
                thresholdExceeded: '⚠️ Attenzione! Hai superato la soglia di ',
                active: '🟢 Attivo',
                expired: '🔴 Scaduto',
                dueToday: 'Scade oggi',
                daysAgo: 'Scaduta da {days} giorni',
                inDays: 'Tra {days} giorni',
                today: 'Oggi',
                yearSing: 'anno',
                yearPlur: 'anni',
                monthSing: 'mese',
                monthPlur: 'mesi',
                daySing: 'giorno',
                dayPlur: 'giorni',
                andConj: 'e',
                confirmReset: 'Sei sicuro di voler cancellare TUTTI i dati?',
                noGoal: 'Non hai ancora impostato un obiettivo di risparmio. Vai nella sezione 🎯 e impostalo!',
                noExpenses: 'Non hai ancora spese registrate. Aggiungine qualcuna per avere un\'analisi!',
                footerText: 'BudgetWise 2.0 — Gestione intelligente delle tue finanze',
                footerFeatures: '✨ Assistente AI integrato • Riconoscimento vocale • Tema scuro',
                fixedVoiceButton: '🎤 Inserisci spesa fissa con voce',
                variableVoiceButton: '🎤 Inserisci con voce',
                categoryAlimentari: '🍎 Alimentari',
                categoryTrasporti: '🚗 Trasporti',
                categorySvago: '🎮 Svago',
                categorySalute: '💊 Salute',
                categoryAbbigliamento: '👕 Abbigliamento',
                categoryAltro: '📦 Altro',
                
                // Onboarding
                onboardingWelcome: '👋 Benvenuto in BudgetWise',
                onboardingStep1: 'Inserisci il tuo primo stipendio o entrata qui sotto.',
                onboardingStep2: '📌 Aggiungi una spesa fissa mensile (es. affitto, bollette).',
                onboardingStep3: '🧾 Registra una spesa variabile come la spesa alimentare.',
                onboardingStep4: '📊 Controlla il tuo budget giornaliero nel riquadro in alto.',
                onboardingStep5: '🤖 Chiedi consigli all\'assistente AI o prova il microfono.',
                onboardingStep6: '📥 Puoi anche importare movimenti bancari in formato CSV o Excel.',
                onboardingNext: 'Avanti →',
                onboardingSkip: 'Salta',
                
                // Import review
                importReview: '📋 Revisione spese importate',
                importConfirm: '✅ Conferma',
                importCancel: '✕ Annulla',
                importCategory: 'Categoria',
                importLearn: '📌 L\'app ricorderà questa scelta',
                importSuggested: 'Suggerito: {cat} (conferma per imparare)',
                
                // Traduzioni CSV
                csvTitle: '📥 Importa movimenti bancari',
                csvSubtitle: 'Scarica l\'estratto conto dalla tua banca in formato CSV o Excel (.xlsx)',
                csvChooseFile: 'Scegli file CSV o Excel',
                csvNoFile: 'Nessun file selezionato',
                csvImportBtn: '📥 Importa CSV / Excel',
                csvDateFormat: 'Formato data',
                csvSeparator: 'Separatore',
                csvComma: 'Virgola (,)',
                csvSemicolon: 'Punto e virgola (;)',
                csvTab: 'Tabulazione',
                csvPreview: 'Anteprima',
                
                // Gestione categorie
                manageCategories: '📂 Gestisci categorie',
                addCategory: '➕ Aggiungi categoria',
                categoryName: 'Nome categoria',
                saveCategory: 'Salva',
                deleteCategory: '🗑️ Elimina',
                confirmDeleteCategory: 'Sei sicuro di voler eliminare la categoria "{name}"?',
                categoryAlreadyExists: 'Categoria già esistente',
                categoryAdded: '✅ Categoria aggiunta!',
                categoryDeleted: '🗑️ Categoria eliminata',
                categoryUpdated: '✏️ Categoria aggiornata',
                defaultCategories: 'Categorie predefinite',
                customCategories: 'Le tue categorie',
                noCustomCategories: 'Nessuna categoria personalizzata',

                // NUOVE CHIAVI PER I TAB
                tabHome: '🏠 Home',
                tabIncomes: '🏦 Entrate',
                tabFixed: '📌 Fisse',
                tabVariable: '🧾 Variabili',
                tabTools: '🛠️ Strumenti',

                // NUOVE CHIAVI PER SKIP ROWS
                skipRowsLabel: 'Salta righe iniziali',
                headerRowManualLabel: 'Riga intestazione',
                skipHelp: '📌 Per file con righe iniziali (es. Fineco): salta le righe fino a trovare le colonne',

                docTitle: '💰 BudgetWise 2.0 - Gestione Finanziaria Intelligente',
                subtitle: 'Stipendio a stipendio — gestione intelligente con AI',
                add: 'Aggiungi',
                dateHint: 'gg/mm/aaaa',
                autoRecommended: 'Auto (consigliato)',
                ddmmyyyy: 'GG/MM/AAAA',
                mmddyyyy: 'MM/DD/AAAA',
                positiveBalance: 'Saldo positivo',
                negativeBalance: 'Attenzione: saldo negativo',
                vsYesterday0: 'rispetto a ieri: 0%',
                detailTotal: 'Totale: {total}',
                noExpensesShort: 'Nessuna spesa',
                voiceSpeak: 'Parlare...',
                voiceTap: 'Tocca per parlare',
                error: 'Errore',
                genericExpense: 'Spesa',
                voiceDetected: '✅ Rilevato: {desc} {amount}€',
                voiceFixedDetected: '✅ Spesa fissa rilevata: {name} {amount}€ giorno {day}',
                invalidFile: '❌ File non valido',
                fixedExpense: 'Spesa fissa',
                everyMonthOnDay: 'Ogni mese il giorno',
                featureInDev: '🔍 Funzionalità in sviluppo',
                csvTemplateDetected: '📌 Rilevato template CSV: "{name}".\nVuoi usarlo automaticamente?',
                csvFieldDate: '📅 Data',
                csvFieldDescription: '📝 Descrizione',
                csvFieldAmount: '💰 Importo',
                csvFieldCategory: '🏷️ Categoria',
                csvFieldIgnore: '❌ Ignora',
                csvSaveAsTemplate: '💾 Salva come template',
                csvTemplateNamePlaceholder: 'Nome template (es. Intesa, Unicredit...)',
                csvColumnN: 'Colonna {n}',
                empty: 'vuota',
                csvMappingRequired: '❌ Devi mappare Data, Descrizione e Importo!',
                csvEmpty: '❌ CSV vuoto',
                importCancelled: '⏸️ Import annullato',
                csvImportError: '❌ Errore durante l\'import CSV',
                fileReadError: '❌ Errore durante la lettura del file',
                importCompleted: '✅ Import completato!\n➕ Aggiunti: {added}{dupLine}',
                duplicatesSkipped: '⚠️ Duplicati saltati: {dup}',
                onboardingSubtitle: 'Segui la guida passo-passo',
                onboardingDemo: "✨ Carica demo",
                onboardingEmpty: 'Inizia vuoto',
                you: 'Tu',
                adviceRed: '⚠️ Sei in rosso! Rivedi le spese.',
                adviceLowRemaining: '⚠️ Attenzione: ti rimangono solo {remaining} per i prossimi giorni.',
                adviceGood: '💪 Vai bene! Hai ancora {remaining} di margine.',
                aiSuggestionsTitle: '🤖 Suggerimenti AI',
                aiSmartBadge: 'intelligente',
                csvMappingTitle: '📋 Mappa le colonne del file CSV',
                csvMappingInstructionsHtml: '<strong>📌 Istruzioni:</strong> Associa ogni colonna del tuo file al campo corrispondente. Le righe con importo positivo saranno considerate <strong>entrate</strong>, quelle negative <strong>spese</strong>.',
                csvMappingFieldsTitle: '🎯 Associazione campi:',
                showAllExpenses: 'Mostra tutte le spese del periodo',
                edit: 'Modifica',
                categoriesSectionTitle: '📂 Gestione categorie',
                manageCustomCategories: '➕ Gestisci categorie personalizzate',
                newCategoryLabel: 'Nuova categoria',
                newCategoryPlaceholder: 'es. Viaggi',
                defaultCategoriesTitle: 'Categorie predefinite',
                yourCategoriesTitle: 'Le tue categorie',
                close: 'Chiudi',
                
                // NUOVE TRADUZIONI
                fixedDateFormatDays: '🗓️ Giorni rimanenti',
                fixedDateFormatMonths: '📆 Mesi e giorni',
                fixedDateFormatHelp: 'Scegli come visualizzare le scadenze delle spese fisse',
                hideOptions: 'Nascondi opzioni',
                excelSheet: 'Foglio Excel',
                excelHeaderRow: 'Riga intestazione',
                row1: 'Riga 1',
                row2: 'Riga 2',
                row3: 'Riga 3',
                rowNone: 'Nessuna (auto)',
                never: 'Mai',
                percent0: '0%',
                percent15: '15%',
                percent30: '30%',
                currentPlan: '📅 Piano attuale',
                currentPlanMessage: 'Con questi parametri non raggiungerai l\'obiettivo',
                endPeriod: 'Fine periodo',
                upgradeBanner: '🚀 Upgrade a Premium',
                upgradeBannerText: 'Sblocca funzionalità illimitate e l\'assistente AI!',
                upgrade: 'Upgrade',
                free: '🆓 Free',
                premium: '💎 Premium',
                transactionsLimit: '50 transazioni/mese',
                perMonth: '/mese',
                fixedExpensesLimit: '5 spese fisse',
                savingsPercentLimit: '15% risparmio max',
                categoriesLimit: '3 categorie base',
                popular: 'POPOLARE',
                price: '€4.99 /mese',
                freeTrial: '🎁 Prova Gratuita',
                freeTrialText: '7 giorni di Premium, zero rischi!',
                startTrial: '🚀 Inizia Prova Gratuita',
                activateLicense: '🔑 Attiva Licenza',
                allCategories: '📋 Tutte le categorie',
                clearFilters: '✕ Cancella filtri',
                transactionCounter: 'Transazioni mensili',
                aiSuggestionReduce: '💡 Hai speso {amount} in {category}. Riducendolo del 10% ({reduction}), potresti destinarlo al risparmio.',
                aiSuggestionTransport: '🚗 Hai speso {amount} in trasporti. Usando più mezzi pubblici potresti risparmiare circa {potential} al mese.',
                aiSuggestionLeisure: '🎮 Hai speso {amount} in svago. Limitando le uscite a 2 a settimana potresti risparmiare {potential}.',
                aiActionSetGoal: '🎯 Imposta obiettivo',
                aiActionLearnHow: '💡 Scopri come',
                aiActionPlan: '📅 Pianifica',
                features: {
                    csvImport: '✅ Importazione CSV',
                    csvImport: '❌ Importazione CSV',
                    aiAssistant: '✅ Assistente AI',
                    aiAssistant: '❌ Assistente AI',
                    cloudSync: '✅ Sincronizzazione cloud',
                    cloudSync: '❌ Sincronizzazione cloud',
                    unlimitedTransactions: '✅ Transazioni illimitate',
                    unlimitedFixedExpenses: '✅ Spese fisse illimitate',
                    savingsPercentUnlimited: '✅ Risparmio fino al 50%',
                    customCategories: '✅ Categorie personalizzate',
                    excelImport: '✅ Importazione CSV/Excel',
                    advancedAI: '✅ Assistente AI avanzato',
                    detailedReports: '✅ Report dettagliati',
                    voiceRecognition: '✅ Riconoscimento vocale',
                    colorCustomization: '✅ Colori personalizzati'
                }
            },
            en: {
                backupButton: '💾 Download backup',
                restoreButton: '📂 Restore backup',
                never: "Never",
                transactionsLimit: '50 transactions/month',
                currentPaceReachOn: "At the current pace, you'll reach the goal on {date}",
                goalNotReachable: "With these parameters you won't reach the goal",
                savingsSuggestionTitle: "Tip",
                applySuggestion: "Apply suggestion",
                increaseToPercentToArriveEarlier: "Increase to {percent}% to reach the goal {months} months earlier!",
                increaseToPercentToArriveEarlier_one: "Increase to {percent}% to reach the goal {months} month earlier!",
                suggestionAppliedToast: "💡 Suggestion applied: {percent}% savings",
                perMonth: '/month',
                onboardingDemo: "✨ Load demo",
                loadDemo: "Load demo",
                upgradeBanner: '🚀 Upgrade to Premium',
                upgradeBannerText: 'Unlock unlimited features and AI assistant!',
                upgrade: 'Upgrade',
                free: '🆓 Free',
                premium: '💎 Premium',
                transactionsLimit: '30 transactions/month',
                fixedExpensesLimit: '5 fixed expenses',
                savingsPercentLimit: '15% max savings',
                categoriesLimit: '3 base categories',
                popular: 'POPULAR',
                price: '€4.99/month',
                freeTrial: '🎁 Free Trial',
                freeTrialText: '7 days of Premium, zero risk!',
                startTrial: '🚀 Start Free Trial',
                activateLicense: '🔑 Activate License',
                maybeLater: 'Maybe later',
                allCategories: '📋 All categories',
                clearFilters: '✕ Clear filters',
                savingsWidgetTitle: 'You will reach your goal',
                never: 'Never',
                percent0: '0%',
                percent15: '15%',
                percent30: '30%',
                currentPlan: '📅 Current plan',
                currentPlanMessage: 'With these parameters you will never reach the goal',
                excelSheet: 'Excel Sheet',
                excelSheetPlaceholder: 'Load an Excel file',
                rowNone: 'None (auto)',
                excelHelp: '⚠️ Excel files are converted automatically',
                hideOptions: 'Hide options',
                advancedOptions: '⚙️ Advanced options',
                savingsPotLabel: 'Savings plan',
                searchPlaceholder: 'Search by description, category or amount',
                resetColors: 'Reset default colors',
                colorsTitle: '🎨 Customize colors',
                colorsSubtitle: 'Choose your favorite colors to personalize the app.',
                fixedPaid: '✅ Paid',
                fixedPlanned: '⏳ Planned',
                fixedDue: 'Due',
                fixedFound: 'Found',
                budget: 'Daily budget',
                remaining: 'Remaining',
                days: 'Days left',
                period: 'Period',
                totalIncome: 'Total income',
                startGuide: '👋 Start by adding your income below!',
                incomes: '🏦 Period income',
                fixed: '📌 Monthly fixed expenses',
                variable: '🧾 Variable expenses',
                chart: '📊 Expense distribution',
                assistant: '🤖 AI Financial Assistant',
                savings: '🎯 Savings goal',
                settings: '⚙️ Settings',
                badge: 'multiple',
                addIncome: '➕ Add income',
                addFixed: '➕ Add fixed expense',
                addExpense: '➕ Add expense',
                resetDay: '🗑️ Clear day expenses',
                resetVariablePeriod: '🗑️ Clear period variable expenses',
                confirmResetVariablePeriod: 'Are you sure you want to delete ALL variable expenses in the current period?',
                variablePeriodReset: 'Period variable expenses deleted!',
                noVariablePeriodToReset: 'There are no variable expenses to delete in this period.',
                applySavings: 'Apply savings',
                backup: '💾 Download backup',
                restore: '📂 Restore',
                resetAll: '⚠️ Full reset',
                export: '📅 Export to Calendar',
                send: 'Send',
                incomeDesc: 'Description (e.g. Salary)',
                incomeAmount: 'Amount €',
                incomeDateLabel: 'Date',
                fixedName: 'Name (e.g. Mortgage)',
                fixedAmount: 'Amount €',
                fixedDay: 'Day (e.g. 27)',
                expenseName: 'What did you buy?',
                expenseAmount: '€',
                chatPlaceholder: 'E.g. How much can I save this month?',
                dateLabel: 'Select date:',
                dayLabel: 'Day of month',
                endDateLabel: 'Expiry date',
                percentLabel: 'Percentage of income (%)',
                goalLabel: 'Goal (€)',
                thresholdLabel: '🔔 Alert threshold (€)',
                languageLabel: '🌍 Language',
                backupLabel: '📅 Data backup',
                micFixed: '🎤 Say everything in one phrase',
                micVariable: '🎤 Tap to speak',
                helpFixed: '⏰ Automatically counted each month until expiry',
                chartNote: 'Add expenses to see chart',
                noIncome: 'No income',
                noFixed: 'No fixed expenses',
                noVariable: 'No expenses on this day',
                welcomeMessage: 'Hi! I\'m your financial assistant. Ask me anything about your budget!',
                suggestion1: '💶 Save 100€',
                suggestion2: '🔮 Simulate increase',
                suggestion3: '🎯 Goal',
                suggestion4: '📊 Top category',
                assistantName: 'Assistant',
                incomeAdded: '✅ Income added!',
                incomeDeleted: '🗑️ Income deleted',
                fixedAdded: '✅ Fixed expense added!',
                fixedDeleted: '🗑️ Expense deleted',
                expenseAdded: '✅ Expense added!',
                expenseDeleted: '🗑️ Expense deleted',
                dayReset: '🗑️ Day expenses cleared',
                savingsApplied: '💰 Savings applied!',
                backupDownloaded: '💾 Backup downloaded!',
                dataRestored: '📂 Data restored!',
                resetCompleted: '🔄 Reset completed',
                calendarExported: '📅 Calendar exported!',
                fillFields: '⚠️ Fill all fields',
                invalidDay: '⚠️ Invalid day (1-31)',
                thresholdExceeded: '⚠️ Warning! You exceeded the threshold of ',
                active: '🟢 Active',
                expired: '🔴 Expired',
                dueToday: 'Due today',
                daysAgo: 'Expired {days} days ago',
                inDays: 'In {days} days',
                today: 'Today',
                yearSing: 'year',
                yearPlur: 'years',
                monthSing: 'month',
                monthPlur: 'months',
                daySing: 'day',
                dayPlur: 'days',
                andConj: 'and',
                confirmReset: 'Are you sure you want to delete ALL data?',
                noGoal: 'You haven\'t set a savings goal yet. Go to the 🎯 section and set one!',
                noExpenses: 'You haven\'t recorded any expenses yet. Add some to get an analysis!',
                footerText: 'BudgetWise 2.0 — Smart financial management',
                footerFeatures: '✨ AI Assistant • Voice recognition • Dark theme',
                fixedVoiceButton: '🎤 Add fixed expense with voice',
                variableVoiceButton: '🎤 Add with voice',
                categoryAlimentari: '🍎 Groceries',
                categoryTrasporti: '🚗 Transport',
                categorySvago: '🎮 Leisure',
                categorySalute: '💊 Health',
                categoryAbbigliamento: '👕 Clothing',
                categoryAltro: '📦 Other',
                
                // Onboarding
                onboardingWelcome: '👋 Welcome to BudgetWise',
                onboardingStep1: 'Add your first income below.',
                onboardingStep2: '📌 Add a fixed monthly expense (e.g. rent, utilities).',
                onboardingStep3: '🧾 Record a variable expense like groceries.',
                onboardingStep4: '📊 Check your daily budget in the top card.',
                onboardingStep5: '🤖 Ask the AI assistant or try voice input.',
                onboardingStep6: '📥 You can also import bank statements in CSV format.',
                onboardingNext: 'Next →',
                onboardingSkip: 'Skip',
                
                // Import review
                importReview: '📋 Import Review',
                importConfirm: '✅ Confirm',
                importCancel: '✕ Cancel',
                importCategory: 'Category',
                importLearn: '📌 The app will remember this choice',
                importSuggested: 'Suggested: {cat} (confirm to learn)',
                
                // CSV translations
                csvTitle: '📥 Import bank statements',
                csvSubtitle: 'Download your bank statement in CSV format',
                csvChooseFile: 'Choose file',
                csvNoFile: 'No file selected',
                csvImportBtn: '📥 Import CSV',
                csvDateFormat: 'Date format',
                csvSeparator: 'Separator',
                csvComma: 'Comma (,)',
                csvSemicolon: 'Semicolon (;)',
                csvTab: 'Tab',
                csvPreview: 'Preview',
                
                // Category management
                manageCategories: '📂 Manage categories',
                addCategory: '➕ Add category',
                categoryName: 'Category name',
                saveCategory: 'Save',
                deleteCategory: '🗑️ Delete',
                confirmDeleteCategory: 'Are you sure you want to delete the category "{name}"?',
                categoryAlreadyExists: 'Category already exists',
                categoryAdded: '✅ Category added!',
                categoryDeleted: '🗑️ Category deleted',
                categoryUpdated: '✏️ Category updated',
                defaultCategories: 'Default categories',
                customCategories: 'Your categories',
                noCustomCategories: 'No custom categories',

                // Tab keys
                tabHome: '🏠 Home',
                tabIncomes: '🏦 Incomes',
                tabFixed: '📌 Fixed',
                tabVariable: '🧾 Variable',
                tabTools: '🛠️ Tools',

                // Skip rows
                skipRowsLabel: 'Skip initial rows',
                headerRowManualLabel: 'Header row',
                skipHelp: '📌 For files with initial rows (e.g., Fineco): skip rows until you find the columns',

                docTitle: '💰 BudgetWise 2.0 - Smart Budget Manager',
                subtitle: 'Paycheck to paycheck — smart management with AI',
                add: 'Add',
                dateHint: 'mm/dd/yyyy',
                autoRecommended: 'Auto (recommended)',
                ddmmyyyy: 'DD/MM/YYYY',
                mmddyyyy: 'MM/DD/YYYY',
                positiveBalance: 'Positive balance',
                negativeBalance: 'Warning: negative balance',
                vsYesterday0: 'vs yesterday: 0%',
                detailTotal: 'Total: {total}',
                noExpensesShort: 'No expenses',
                voiceSpeak: 'Speak...',
                voiceTap: 'Tap to speak',
                error: 'Error',
                genericExpense: 'Expense',
                voiceDetected: '✅ Detected: {desc} €{amount}',
                voiceFixedDetected: '✅ Fixed expense detected: {name} €{amount} day {day}',
                invalidFile: '❌ Invalid file',
                fixedExpense: 'Fixed expense',
                everyMonthOnDay: 'Every month on day',
                featureInDev: '🔍 Feature in development',
                csvTemplateDetected: '📌 CSV template detected: "{name}".\nUse it automatically?',
                csvFieldDate: '📅 Date',
                csvFieldDescription: '📝 Description',
                csvFieldAmount: '💰 Amount',
                csvFieldCategory: '🏷️ Category',
                csvFieldIgnore: '❌ Ignore',
                csvSaveAsTemplate: '💾 Save as template',
                csvTemplateNamePlaceholder: 'Template name (e.g. Intesa, Unicredit...)',
                csvColumnN: 'Column {n}',
                empty: 'empty',
                csvMappingRequired: '❌ You must map Date, Description and Amount!',
                csvEmpty: '❌ Empty CSV',
                importCancelled: '⏸️ Import cancelled',
                csvImportError: '❌ Error during CSV import',
                fileReadError: '❌ Error reading the file',
                importCompleted: '✅ Import completed!\n➕ Added: {added}{dupLine}',
                duplicatesSkipped: '⚠️ Duplicates skipped: {dup}',
                onboardingSubtitle: 'Follow the step-by-step guide',
                onboardingDemo: "✨ Load demo",
                onboardingEmpty: 'Start empty',
                you: 'You',
                adviceRed: "⚠️ You're in the red! Review your expenses.",
                adviceLowRemaining: '⚠️ Warning: you only have {remaining} left for the coming days.',
                adviceGood: "💪 You're doing well! You still have {remaining} left.",
                aiSuggestionsTitle: '🤖 AI Suggestions',
                aiSmartBadge: 'smart',
                csvMappingTitle: '📋 Map CSV columns',
                csvMappingInstructionsHtml: '<strong>📌 Instructions:</strong> Map each CSV column to the right field. Positive amounts are treated as <strong>income</strong>, negative amounts as <strong>expenses</strong>.',
                csvMappingFieldsTitle: '🎯 Field mapping:',
                showAllExpenses: 'Show all period expenses',
                edit: 'Edit',
                categoriesSectionTitle: '📂 Category management',
                manageCustomCategories: '➕ Manage custom categories',
                newCategoryLabel: 'New category',
                newCategoryPlaceholder: 'e.g. Travel',
                defaultCategoriesTitle: 'Default categories',
                yourCategoriesTitle: 'Your categories',
                close: 'Close',
                fixedDateFormatDays: '🗓️ Days remaining',
                fixedDateFormatMonths: '📆 Months and days',
                fixedDateFormatHelp: 'Choose how to display fixed expense deadlines',
                hideOptions: 'Hide options',
                row1: 'Row 1',
                row2: 'Row 2',
                row3: 'Row 3',
                endPeriod: 'End of period',
                transactionCounter: 'Monthly transactions',
                aiSuggestionReduce: '💡 You spent {amount} on {category}. Reducing it by 10% ({reduction}) could boost your savings.',
                aiSuggestionTransport: '🚗 You spent {amount} on transport. Using more public transport could save you about {potential} per month.',
                aiSuggestionLeisure: '🎮 You spent {amount} on leisure. Limiting outings to 2 per week could save you {potential}.',
                aiActionSetGoal: '🎯 Set goal',
                aiActionLearnHow: '💡 Learn how',
                aiActionPlan: '📅 Plan',
                features: {
                    csvImport: '✅ CSV Import',
                     csvImport: '❌ CSV Import',
                    aiAssistant: '✅ AI Assistant',
                    aiAssistant: '❌ AI Assistant',
                    cloudSync: '✅ Cloud Sync',
                    cloudSync: '❌ Cloud Sync',
                    unlimitedTransactions: '✅ Unlimited transactions',
                    unlimitedFixedExpenses: '✅ Unlimited fixed expenses',
                    savingsPercentUnlimited: '✅ Up to 50% savings',
                    customCategories: '✅ Custom categories',
                    excelImport: '✅ CSV/Excel Import',
                    advancedAI: '✅ Advanced AI Assistant',
                    detailedReports: '✅ Detailed reports',
                    voiceRecognition: '✅ Voice recognition',
                    colorCustomization: '✅ Color customization'
                }
            },
            es: {
                chartTotalLabel: 'Total gastos',
                aiSuggestionReduce: '💡 Has gastado {amount} en {category}. Reduciéndolo un 10% ({reduction}), podrías destinarlo al ahorro.',
                aiSuggestionTransport: '🚗 Has gastado {amount} en transporte. Usando más transporte público podrías ahorrar unos {potential} al mes.',
                aiSuggestionLeisure: '🎮 Has gastado {amount} en ocio. Limitando las salidas a 2 por semana podrías ahorrar {potential}.',
                aiActionSetGoal: 'Establecer objetivo',
                aiActionLearnHow: 'Aprende cómo',
                aiActionPlan: 'Planificar',
                never: "Nunca",
                transactionsLimit: '50 transacciones/mes',
                perMonth: '/mes',
                currentPaceReachOn: "Al ritmo actual, alcanzarás el objetivo el {date}",
                goalNotReachable: "Con estos parámetros no alcanzarás el objetivo",
                savingsSuggestionTitle: "Sugerencia",
                applySuggestion: "Aplicar sugerencia",
                increaseToPercentToArriveEarlier: "Aumenta al {percent}% para llegar {months} meses antes!",
                increaseToPercentToArriveEarlier_one: "Aumenta al {percent}% para llegar {months} mes antes!",
                suggestionAppliedToast: "💡 Sugerencia aplicada: {percent}% de ahorro",
                                onboardingDemo: "✨ Cargar demo",
                loadDemo: "Cargar demo",
                upgradeBanner: '🚀 Mejora a Premium',
                upgradeBannerText: '¡Desbloquea funciones ilimitadas y el asistente IA!',
                upgrade: 'Mejorar',
                free: '🆓 Gratis',
                premium: '💎 Premium',
                transactionsLimit: '30 transacciones/mes',
                fixedExpensesLimit: '5 gastos fijos',
                savingsPercentLimit: '15% ahorro máx.',
                categoriesLimit: '3 categorías básicas',
                popular: 'POPULAR',
                price: '€4.99 /mes',
                freeTrial: '🎁 Prueba Gratuita',
                freeTrialText: '7 días de Premium, ¡sin riesgos!',
                startTrial: '🚀 Iniciar Prueba Gratuita',
                activateLicense: '🔑 Activar Licencia',
                maybeLater: 'Quizás después',
                allCategories: '📋 Todas las categorías',
                clearFilters: '✕ Cancelar filtros',
                savingsWidgetTitle: 'Alcanzarás tu objetivo',
                never: 'Nunca',
                percent0: '0%',
                percent15: '15%',
                percent30: '30%',
                currentPlan: '📅 Plan actual',
                currentPlanMessage: 'Con estos parámetros no alcanzarás el objetivo',
                excelSheet: 'Hoja de Excel',
                excelSheetPlaceholder: 'Cargar un archivo Excel',
                rowNone: 'Ninguna (auto)',
                excelHelp: '⚠️ Los archivos Excel se convierten automáticamente',
                hideOptions: 'Ocultar opciones',
                advancedOptions: '⚙️ Opciones avanzadas',
                savingsPotLabel: 'Plan de ahorro',
                searchPlaceholder: 'Buscar por descripción, categoría o importe',
                resetColors: 'Restablecer colores predeterminados',
                colorsTitle: '🎨 Personalizar colores',
                colorsSubtitle: 'Elige tus colores favoritos para personalizar la app.',
                fixedPaid: '✅ Pagado',
                fixedPlanned: '⏳ Previsto',
                fixedDue: 'Vence',
                fixedFound: 'Encontrado',
                budget: 'Presupuesto diario',
                remaining: 'Restante',
                days: 'Días restantes',
                period: 'Período',
                totalIncome: 'Ingresos totales',
                startGuide: '👋 ¡Empieza añadiendo tus ingresos abajo!',
                incomes: '🏦 Ingresos del período',
                fixed: '📌 Gastos fijos mensuales',
                variable: '🧾 Gastos variables',
                chart: '📊 Distribución de gastos',
                assistant: '🤖 Asistente financiero IA',
                savings: '🎯 Objetivo de ahorro',
                settings: '⚙️ Ajustes',
                badge: 'múltiple',
                addIncome: '➕ Añadir ingreso',
                addFixed: '➕ Añadir gasto fijo',
                addExpense: '➕ Añadir gasto',
                resetDay: '🗑️ Borrar gastos del día',
                resetVariablePeriod: '🗑️ Borrar gastos variables del periodo',
                confirmResetVariablePeriod: '¿Seguro que quieres borrar TODOS los gastos variables del periodo actual?',
                variablePeriodReset: '¡Gastos variables del periodo borrados!',
                noVariablePeriodToReset: 'No hay gastos variables para borrar en este periodo.',
                applySavings: 'Aplicar ahorro',
                backup: '💾 Descargar copia',
                restore: '📂 Restaurar',
                resetAll: '⚠️ Reinicio total',
                export: '📅 Exportar a Calendar',
                send: 'Enviar',
                incomeDesc: 'Descripción (p. ej. Salario)',
                incomeAmount: 'Importe €',
                incomeDateLabel: 'Fecha',
                fixedName: 'Nombre (p. ej. Hipoteca)',
                fixedAmount: 'Importe €',
                fixedDay: 'Día (p. ej. 27)',
                expenseName: '¿Qué compraste?',
                expenseAmount: '€',
                chatPlaceholder: 'p. ej. ¿Cuánto puedo ahorrar este mes?',
                dateLabel: 'Selecciona fecha:',
                dayLabel: 'Día del mes',
                endDateLabel: 'Fecha de vencimiento',
                percentLabel: 'Porcentaje de ingresos (%)',
                goalLabel: 'Objetivo (€)',
                thresholdLabel: '🔔 Umbral de aviso (€)',
                languageLabel: '🌍 Idioma',
                backupLabel: '📅 Copia de datos',
                micFixed: '🎤 Toca y dilo en una frase',
                micVariable: '🎤 Toca para hablar',
                helpFixed: '⏰ Se contabiliza automáticamente cada mes hasta el vencimiento',
                chartNote: 'Añade gastos para ver el gráfico',
                noIncome: 'Sin ingresos',
                noFixed: 'Sin gastos fijos',
                noVariable: 'Sin gastos en este día',
                welcomeMessage: '¡Hola! Soy tu asistente financiero. ¡Pregúntame lo que quieras sobre tu presupuesto!',
                suggestion1: '💶 Ahorrar 100€',
                suggestion2: '🔮 Simular aumento',
                suggestion3: '🎯 Objetivo',
                suggestion4: '📊 Categoría top',
                assistantName: 'Asistente',
                incomeAdded: '✅ ¡Ingreso añadido!',
                incomeDeleted: '🗑️ Ingreso eliminado',
                fixedAdded: '✅ ¡Gasto fijo añadido!',
                fixedDeleted: '🗑️ Gasto eliminado',
                expenseAdded: '✅ ¡Gasto añadido!',
                expenseDeleted: '🗑️ Gasto eliminado',
                dayReset: '🗑️ Gastos del día borrados',
                savingsApplied: '💰 ¡Ahorro aplicado!',
                backupDownloaded: '💾 ¡Copia descargada!',
                dataRestored: '📂 ¡Datos restaurados!',
                resetCompleted: '🔄 Reinicio completado',
                calendarExported: '📅 ¡Calendario exportado!',
                fillFields: '⚠️ Rellena todos los campos',
                invalidDay: '⚠️ Día no válido (1-31)',
                thresholdExceeded: '⚠️ ¡Atención! Has superado el umbral de ',
                active: '🟢 Activo',
                expired: '🔴 Vencido',
                dueToday: 'Vence hoy',
                daysAgo: 'Vencido hace {days} días',
                inDays: 'En {days} días',
                today: 'Hoy',
                yearSing: 'año',
                yearPlur: 'años',
                monthSing: 'mes',
                monthPlur: 'meses',
                daySing: 'día',
                dayPlur: 'días',
                andConj: 'y',
                confirmReset: '¿Seguro que quieres borrar TODOS los datos?',
                noGoal: 'Aún no has establecido un objetivo de ahorro. Ve a 🎯 y configúralo.',
                noExpenses: 'Aún no tienes gastos registrados. Añade algunos para ver el análisis.',
                footerText: 'BudgetWise 2.0 — Gestión inteligente de tus finanzas',
                footerFeatures: '✨ Asistente IA • Reconocimiento de voz • Tema oscuro',
                fixedVoiceButton: '🎤 Añadir gasto fijo con voz',
                variableVoiceButton: '🎤 Añadir con voz',
                categoryAlimentari: '🍎 Alimentación',
                categoryTrasporti: '🚗 Transporte',
                categorySvago: '🎮 Ocio',
                categorySalute: '💊 Salud',
                categoryAbbigliamento: '👕 Ropa',
                categoryAltro: '📦 Otros',
                onboardingWelcome: '👋 Bienvenido a BudgetWise',
                onboardingStep1: 'Añade tu primer ingreso abajo.',
                onboardingStep2: '📌 Añade un gasto fijo mensual (p. ej. alquiler, servicios).',
                onboardingStep3: '🧾 Registra un gasto variable como la compra.',
                onboardingStep4: '📊 Revisa tu presupuesto diario en la tarjeta superior.',
                onboardingStep5: '🤖 Pregunta al asistente IA o prueba el micrófono.',
                onboardingStep6: '📥 También puedes importar movimientos bancarios en CSV.',
                onboardingNext: 'Siguiente →',
                onboardingSkip: 'Saltar',
                importReview: '📋 Revisión de importación',
                importConfirm: '✅ Confirmar',
                importCancel: '✕ Cancelar',
                importCategory: 'Categoría',
                importLearn: '📌 La app recordará esta elección',
                importSuggested: 'Sugerido: {cat} (confirma para aprender)',
                csvTitle: '📥 Importar movimientos bancarios',
                csvSubtitle: 'Descarga tu extracto en formato CSV',
                csvChooseFile: 'Elegir archivo',
                csvNoFile: 'Ningún archivo seleccionado',
                csvImportBtn: '📥 Importar CSV',
                csvDateFormat: 'Formato de fecha',
                csvSeparator: 'Separador',
                csvComma: 'Coma (,)',
                csvSemicolon: 'Punto y coma (;)',
                csvTab: 'Tabulación',
                csvPreview: 'Vista previa',
                categoriesSectionTitle: '📂 Gestión de categorías',
                manageCustomCategories: '➕ Gestionar categorías personalizadas',
                newCategoryLabel: 'Nueva categoría',
                newCategoryPlaceholder: 'p. ej. Viajes',
                defaultCategoriesTitle: 'Categorías predeterminadas',
                yourCategoriesTitle: 'Tus categorías',
                close: 'Cerrar',
                advancedOptions: '⚙️ Opciones avanzadas',
                excelSheet: 'Hoja de Excel',
                excelHeaderRow: 'Fila de encabezado',
                excelSheetPlaceholder: 'Cargar un archivo Excel',
                rowNone: 'Ninguna (auto)',
                excelHelp: '⚠️ Los archivos Excel se convierten automáticamente',
                backupButton: '💾 Descargar copia',
                restoreButton: '📂 Restaurar',
                manageCategories: '📂 Gestionar categorías',
                addCategory: '➕ Añadir categoría',
                categoryName: 'Nombre de la categoría',
                saveCategory: 'Guardar',
                deleteCategory: '🗑️ Eliminar',
                confirmDeleteCategory: '¿Seguro que quieres eliminar la categoría "{name}"?',
                categoryAlreadyExists: 'La categoría ya existe',
                categoryAdded: '✅ ¡Categoría añadida!',
                categoryDeleted: '🗑️ Categoría eliminada',
                categoryUpdated: '✏️ Categoría actualizada',
                defaultCategories: 'Categorías predeterminadas',
                customCategories: 'Tus categorías',
                noCustomCategories: 'Sin categorías personalizadas',
                tabHome: '🏠 Inicio',
                tabIncomes: '🏦 Ingresos',
                tabFixed: '📌 Fijas',
                tabVariable: '🧾 Variables',
                tabTools: '🛠️ Herramientas',
                skipRowsLabel: 'Saltar filas iniciales',
                headerRowManualLabel: 'Fila de encabezado',
                skipHelp: '📌 Para archivos con filas iniciales (ej. Fineco): salta las filas hasta encontrar las columnas',
                docTitle: '💰 BudgetWise 2.0 - Gestor de presupuesto inteligente',
                subtitle: 'De nómina a nómina — gestión inteligente con IA',
                add: 'Añadir',
                dateHint: 'dd/mm/aaaa',
                autoRecommended: 'Auto (recomendado)',
                ddmmyyyy: 'DD/MM/AAAA',
                mmddyyyy: 'MM/DD/AAAA',
                positiveBalance: 'Saldo positivo',
                negativeBalance: 'Atención: saldo negativo',
                vsYesterday0: 'vs ayer: 0%',
                detailTotal: 'Total: {total}',
                noExpensesShort: 'Sin gastos',
                voiceSpeak: 'Habla...',
                voiceTap: 'Toca para hablar',
                error: 'Error',
                genericExpense: 'Gasto',
                voiceDetected: '✅ Detectado: {desc} €{amount}',
                voiceFixedDetected: '✅ Gasto fijo detectado: {name} €{amount} día {day}',
                invalidFile: '❌ Archivo no válido',
                fixedExpense: 'Gasto fijo',
                everyMonthOnDay: 'Cada mes el día',
                featureInDev: '🔍 Función en desarrollo',
                csvTemplateDetected: '📌 Plantilla CSV detectada: "{name}".\\n¿Usarla automáticamente?',
                csvFieldDate: '📅 Fecha',
                csvFieldDescription: '📝 Descripción',
                csvFieldAmount: '💰 Importe',
                csvFieldCategory: '🏷️ Categoría',
                csvFieldIgnore: '❌ Ignorar',
                csvSaveAsTemplate: '💾 Guardar como plantilla',
                csvTemplateNamePlaceholder: 'Nombre de plantilla (p. ej. Intesa, Unicredit...)',
                csvColumnN: 'Columna {n}',
                empty: 'vacía',
                csvMappingRequired: '❌ Debes asignar Fecha, Descripción e Importe.',
                csvEmpty: '❌ CSV vacío',
                importCancelled: '⏸️ Importación cancelada',
                csvImportError: '❌ Error durante la importación CSV',
                fileReadError: '❌ Error al leer el archivo',
                duplicatesSkipped: '⚠️ Duplicados omitidos: {dup}',
                importCompleted: '✅ Importación completada!\\n➕ Añadidos: {added}{dupLine}',
                onboardingSubtitle: 'Sigue la guía paso a paso',
                onboardingDemo: "✨ Cargar demo",
                onboardingEmpty: 'Empezar vacío',
                you: 'Tú',
                adviceRed: '⚠️ ¡Estás en negativo! Revisa tus gastos.',
                adviceLowRemaining: '⚠️ Atención: solo te quedan {remaining} para los próximos días.',
                adviceGood: '💪 ¡Vas bien! Aún te quedan {remaining}.',
                aiSmartBadge: 'inteligente',
                aiSuggestionsTitle: '🤖 Sugerencias IA',
                csvMappingTitle: '📋 Mapear columnas CSV',
                csvMappingInstructionsHtml: '<strong>📌 Instrucciones:</strong> Asocia cada columna del CSV con su campo. Importes positivos = <strong>ingresos</strong>, negativos = <strong>gastos</strong>.',
                csvMappingFieldsTitle: '🎯 Asignación de campos:',
                showAllExpenses: 'Mostrar todos los gastos del período',
                edit: 'Editar',
                fixedDateFormatDays: '🗓️ Días restantes',
                fixedDateFormatMonths: '📆 Meses y días',
                fixedDateFormatHelp: 'Elige cómo visualizar los plazos de gastos fijos',
                hideOptions: 'Ocultar opciones',
                row1: 'Fila 1',
                row2: 'Fila 2',
                row3: 'Fila 3',
                endPeriod: 'Fin del período',
                transactionCounter: 'Transacciones mensuales',
                features: {
                    csvImport: '✅ Importación CSV',
                    csvImport: '❌ Importación CSV',
                    aiAssistant: '❌ Asistente IA',
                    cloudSync: '❌ Sincronización en la nube',
                    aiAssistant: '✅ Asistente IA',
                    cloudSync: '✅ Sincronización en la nube',
                    unlimitedTransactions: '✅ Transacciones ilimitadas',
                    unlimitedFixedExpenses: '✅ Gastos fijos ilimitados',
                    savingsPercentUnlimited: '✅ Ahorro hasta 50%',
                    customCategories: '✅ Categorías personalizadas',
                    excelImport: '✅ Importación CSV/Excel',
                    advancedAI: '✅ Asistente IA avanzado',
                    detailedReports: '✅ Informes detallados',
                    voiceRecognition: '✅ Reconocimiento de voz',
                    colorCustomization: '✅ Colores personalizados'
                }
            },
            fr: {
                never: "Jamais",
                currentPaceReachOn: "Au rythme actuel, vous atteindrez l'objectif le {date}",
                goalNotReachable: "Avec ces paramètres, vous n'atteindrez pas l'objectif",
                savingsSuggestionTitle: "Suggestion",
                applySuggestion: "Appliquer la suggestion",
                increaseToPercentToArriveEarlier: "Augmente à {percent}% pour atteindre l'objectif {months} mois plus tôt !",
                increaseToPercentToArriveEarlier_one: "Augmente à {percent}% pour atteindre l'objectif {months} mois plus tôt !",
                suggestionAppliedToast: "💡 Suggestion appliquée : {percent}% d'épargne",
                onboardingDemo: "✨ Charger la démo",
                loadDemo: "Cargar demo",
                upgradeBanner: '🚀 Passez à Premium',
                upgradeBannerText: 'Débloquez des fonctionnalités illimitées et l\'assistant IA !',
                upgrade: 'Passer à Premium',
                free: '🆓 Gratuit',
                premium: '💎 Premium',
                transactionsLimit: '30 transactions/mois',
                fixedExpensesLimit: '5 dépenses fixes',
                savingsPercentLimit: '15% épargne max',
                categoriesLimit: '3 catégories de base',
                perMonth: '/mois',
                popular: 'POPULAIRE',
                price: '€4.99 /mois',
                freeTrial: '🎁 Essai Gratuit',
                freeTrialText: '7 jours de Premium, zéro risque !',
                startTrial: '🚀 Commencer l\'essai gratuit',
                activateLicense: '🔑 Activer la licence',
                maybeLater: 'Peut-être plus tard',
                allCategories: '📋 Toutes les catégories',
                clearFilters: '✕ Effacer les filtres',
                savingsWidgetTitle: 'Vous atteindrez votre objectif',
                never: 'Jamais',
                percent0: '0%',
                percent15: '15%',
                percent30: '30%',
                currentPlan: '📅 Plan actuel',
                currentPlanMessage: 'Avec ces paramètres, vous n\'atteindrez jamais l\'objectif',
                excelSheet: 'Feuille Excel',
                excelSheetPlaceholder: 'Charger un fichier Excel',
                rowNone: 'Aucune (auto)',
                excelHelp: '⚠️ Les fichiers Excel sont convertis automatiquement',
                hideOptions: 'Masquer les options',
                advancedOptions: '⚙️ Options avancées',
                savingsPotLabel: 'Plan d\'épargne',
                searchPlaceholder: 'Rechercher par description, catégorie ou montant',
                resetColors: 'Réinitialiser les couleurs par défaut',
                colorsTitle: '🎨 Personnaliser les couleurs',
                colorsSubtitle: 'Choisissez vos couleurs préférées pour personnaliser l\'application.',
                fixedPaid: '✅ Payé',
                fixedPlanned: '⏳ Prévu',
                fixedDue: 'Échéance',
                fixedFound: 'Trouvé',
                transactionsLimit: '50 transactions/mois',
                budget: 'Budget journalier',
                remaining: 'Reste',
                days: 'Jours restants',
                period: 'Période',
                totalIncome: 'Total des revenus',
                startGuide: '👋 Commence en ajoutant tes revenus ci-dessous !',
                incomes: '🏦 Revenus de la période',
                fixed: '📌 Dépenses fixes mensuelles',
                variable: '🧾 Dépenses variables',
                chart: '📊 Répartition des dépenses',
                assistant: '🤖 Assistant financier IA',
                savings: '🎯 Objectif d’épargne',
                settings: '⚙️ Paramètres',
                badge: 'multiple',
                addIncome: '➕ Ajouter un revenu',
                addFixed: '➕ Ajouter une dépense fixe',
                addExpense: '➕ Ajouter une dépense',
                resetDay: '🗑️ Supprimer les dépenses du jour',
                resetVariablePeriod: '🗑️ Supprimer les dépenses variables de la période',
                confirmResetVariablePeriod: 'Es-tu sûr de vouloir supprimer TOUTES les dépenses variables de la période en cours ?',
                variablePeriodReset: 'Dépenses variables de la période supprimées !',
                noVariablePeriodToReset: 'Aucune dépense variable à supprimer sur cette période.',
                applySavings: 'Appliquer l’épargne',
                backup: '💾 Télécharger la sauvegarde',
                restore: '📂 Restaurer',
                resetAll: '⚠️ Réinitialisation complète',
                export: '📅 Exporter vers Calendar',
                send: 'Envoyer',
                incomeDesc: 'Description (ex. Salaire)',
                incomeAmount: 'Montant €',
                incomeDateLabel: 'Date',
                fixedName: 'Nom (ex. Crédit)',
                fixedAmount: 'Montant €',
                fixedDay: 'Jour (ex. 27)',
                expenseName: 'Qu’as-tu acheté ?',
                expenseAmount: '€',
                chatPlaceholder: 'Ex. Combien puis-je économiser ce mois-ci ?',
                dateLabel: 'Choisir une date :',
                dayLabel: 'Jour du mois',
                endDateLabel: 'Date d’échéance',
                percentLabel: 'Pourcentage des revenus (%)',
                goalLabel: 'Objectif (€)',
                thresholdLabel: '🔔 Seuil d’alerte (€)',
                languageLabel: '🌍 Langue',
                backupLabel: '📅 Sauvegarde des données',
                micFixed: '🎤 Appuie et dis tout en une phrase',
                micVariable: '🎤 Appuie pour parler',
                helpFixed: '⏰ Comptabilisée automatiquement chaque mois jusqu’à l’échéance',
                chartNote: 'Ajoute des dépenses pour voir le graphique',
                noIncome: 'Aucun revenu',
                noFixed: 'Aucune dépense fixe',
                noVariable: 'Aucune dépense ce jour',
                welcomeMessage: 'Salut ! Je suis ton assistant financier. Demande-moi n’importe quoi sur ton budget !',
                suggestion1: '💶 Économiser 100€',
                suggestion2: '🔮 Simuler une hausse',
                suggestion3: '🎯 Objectif',
                suggestion4: '📊 Catégorie top',
                assistantName: 'Assistant',
                incomeAdded: '✅ Revenu ajouté !',
                incomeDeleted: '🗑️ Revenu supprimé',
                fixedAdded: '✅ Dépense fixe ajoutée !',
                fixedDeleted: '🗑️ Dépense supprimée',
                expenseAdded: '✅ Dépense ajoutée !',
                expenseDeleted: '🗑️ Dépense supprimée',
                dayReset: '🗑️ Dépenses du jour supprimées',
                savingsApplied: '💰 Épargne appliquée !',
                backupDownloaded: '💾 Sauvegarde téléchargée !',
                dataRestored: '📂 Données restaurées !',
                resetCompleted: '🔄 Réinitialisation terminée',
                calendarExported: '📅 Calendrier exporté !',
                fillFields: '⚠️ Remplis tous les champs',
                invalidDay: '⚠️ Jour invalide (1-31)',
                thresholdExceeded: '⚠️ Attention ! Tu as dépassé le seuil de ',
                active: '🟢 Actif',
                expired: '🔴 Expiré',
                dueToday: 'Échéance aujourd’hui',
                daysAgo: 'Expiré il y a {days} jours',
                inDays: 'Dans {days} jours',
                today: 'Aujourd\'hui',
                yearSing: 'an',
                yearPlur: 'ans',
                monthSing: 'mois',
                monthPlur: 'mois',
                daySing: 'jour',
                dayPlur: 'jours',
                andConj: 'et',
                confirmReset: 'Es-tu sûr de vouloir supprimer TOUTES les données ?',
                noGoal: 'Tu n’as pas encore défini d’objectif d’épargne. Va sur 🎯 et configure-le.',
                noExpenses: 'Tu n’as encore aucune dépense. Ajoute-en pour voir l’analyse.',
                footerText: 'BudgetWise 2.0 — Gestion intelligente de tes finances',
                footerFeatures: '✨ Assistant IA • Reconnaissance vocale • Thème sombre',
                fixedVoiceButton: '🎤 Ajouter une dépense fixe par voix',
                variableVoiceButton: '🎤 Ajouter par voix',
                categoryAlimentari: '🍎 Alimentation',
                categoryTrasporti: '🚗 Transport',
                categorySvago: '🎮 Loisirs',
                categorySalute: '💊 Santé',
                categoryAbbigliamento: '👕 Vêtements',
                categoryAltro: '📦 Autre',
                onboardingWelcome: '👋 Bienvenue sur BudgetWise',
                onboardingStep1: 'Ajoute ton premier revenu ci-dessous.',
                onboardingStep2: '📌 Ajoute une dépense fixe mensuelle (ex. loyer, factures).',
                onboardingStep3: '🧾 Enregistre une dépense variable comme les courses.',
                onboardingStep4: '📊 Consulte ton budget journalier dans la carte du haut.',
                onboardingStep5: '🤖 Demande à l’assistant IA ou teste le micro.',
                onboardingStep6: '📥 Tu peux aussi importer un CSV bancaire.',
                onboardingNext: 'Suivant →',
                onboardingSkip: 'Passer',
                importReview: '📋 Revue d’importation',
                importConfirm: '✅ Confirmer',
                importCancel: '✕ Annuler',
                importCategory: 'Catégorie',
                importLearn: '📌 L’app se souviendra de ce choix',
                importSuggested: 'Suggéré: {cat} (confirmer pour apprendre)',
                csvTitle: '📥 Importer des opérations bancaires',
                csvSubtitle: 'Télécharge ton relevé en CSV',
                csvChooseFile: 'Choisir un fichier',
                csvNoFile: 'Aucun fichier sélectionné',
                csvImportBtn: '📥 Importer CSV',
                csvDateFormat: 'Format de date',
                csvSeparator: 'Séparateur',
                csvComma: 'Virgule (,)',
                csvSemicolon: 'Point-virgule (;)',
                csvTab: 'Tabulation',
                csvPreview: 'Aperçu',
                categoriesSectionTitle: '📂 Gestion des catégories',
                manageCustomCategories: '➕ Gérer les catégories personnalisées',
                newCategoryLabel: 'Nouvelle catégorie',
                newCategoryPlaceholder: 'ex. Voyages',
                defaultCategoriesTitle: 'Catégories par défaut',
                yourCategoriesTitle: 'Vos catégories',
                close: 'Fermer',
                advancedOptions: '⚙️ Options avancées',
                excelSheet: 'Feuille Excel',
                excelHeaderRow: 'Ligne d\'en-tête',
                excelSheetPlaceholder: 'Charger un fichier Excel',
                rowNone: 'Aucune (auto)',
                excelHelp: '⚠️ Les fichiers Excel sont convertis automatiquement',
                backupButton: '💾 Télécharger la sauvegarde',
                restoreButton: '📂 Restaurer',
                manageCategories: '📂 Gérer les catégories',
                addCategory: '➕ Ajouter une catégorie',
                categoryName: 'Nom de la catégorie',
                saveCategory: 'Enregistrer',
                deleteCategory: '🗑️ Supprimer',
                confirmDeleteCategory: 'Supprimer la catégorie « {name} » ?',
                categoryAlreadyExists: 'La catégorie existe déjà',
                categoryAdded: '✅ Catégorie ajoutée !',
                categoryDeleted: '🗑️ Catégorie supprimée',
                categoryUpdated: '✏️ Catégorie mise à jour',
                defaultCategories: 'Catégories par défaut',
                customCategories: 'Tes catégories',
                noCustomCategories: 'Aucune catégorie personnalisée',
                tabHome: '🏠 Accueil',
                tabIncomes: '🏦 Revenus',
                tabFixed: '📌 Fixes',
                tabVariable: '🧾 Variables',
                tabTools: '🛠️ Outils',
                skipRowsLabel: 'Ignorer les lignes initiales',
                headerRowManualLabel: 'Ligne d\'en-tête',
                skipHelp: '📌 Pour les fichiers avec lignes initiales (ex. Fineco): ignorez les lignes jusqu\'à trouver les colonnes',
                docTitle: '💰 BudgetWise 2.0 - Gestionnaire de budget intelligent',
                subtitle: 'De paie en paie — gestion intelligente avec IA',
                add: 'Ajouter',
                dateHint: 'jj/mm/aaaa',
                autoRecommended: 'Auto (recommandé)',
                ddmmyyyy: 'JJ/MM/AAAA',
                mmddyyyy: 'MM/JJ/AAAA',
                positiveBalance: 'Solde positif',
                negativeBalance: 'Attention : solde négatif',
                vsYesterday0: 'vs hier : 0%',
                detailTotal: 'Total : {total}',
                noExpensesShort: 'Aucune dépense',
                voiceSpeak: 'Parle...',
                voiceTap: 'Appuie pour parler',
                error: 'Erreur',
                genericExpense: 'Dépense',
                voiceDetected: '✅ Détecté : {desc} €{amount}',
                voiceFixedDetected: '✅ Dépense fixe détectée : {name} €{amount} jour {day}',
                invalidFile: '❌ Fichier invalide',
                fixedExpense: 'Dépense fixe',
                everyMonthOnDay: 'Chaque mois le jour',
                featureInDev: '🔍 Fonction en développement',
                csvTemplateDetected: '📌 Modèle CSV détecté : « {name} ».\\nL’utiliser automatiquement ?',
                csvFieldDate: '📅 Date',
                csvFieldDescription: '📝 Description',
                csvFieldAmount: '💰 Montant',
                csvFieldCategory: '🏷️ Catégorie',
                csvFieldIgnore: '❌ Ignorer',
                csvSaveAsTemplate: '💾 Enregistrer comme modèle',
                csvTemplateNamePlaceholder: 'Nom du modèle (ex. Intesa, Unicredit...)',
                csvColumnN: 'Colonne {n}',
                empty: 'vide',
                csvMappingRequired: '❌ Tu dois mapper Date, Description et Montant.',
                csvEmpty: '❌ CSV vide',
                importCancelled: '⏸️ Import annulé',
                csvImportError: '❌ Erreur pendant l’import CSV',
                fileReadError: '❌ Erreur de lecture du fichier',
                duplicatesSkipped: '⚠️ Doublons ignorés : {dup}',
                importCompleted: '✅ Import terminé !\\n➕ Ajoutés : {added}{dupLine}',
                onboardingSubtitle: 'Suis le guide pas à pas',
                onboardingDemo: "✨ Charger la démo",
                onboardingEmpty: 'Commencer vide',
                you: 'Toi',
                adviceRed: '⚠️ Tu es dans le rouge ! Revois tes dépenses.',
                adviceLowRemaining: '⚠️ Attention : il ne te reste que {remaining} pour les prochains jours.',
                adviceGood: '💪 Ça va ! Il te reste encore {remaining}.',
                aiSuggestionsTitle: '🤖 Suggestions IA',
                chartTotalLabel: 'Total dépenses',
                aiSmartBadge: 'intelligent',
                aiSuggestionReduce: '💡 Vous avez dépensé {amount} en {category}. En réduisant de 10% ({reduction}), vous pourriez ajouter cette somme à votre épargne.',
                aiSuggestionTransport: '🚗 Vous avez dépensé {amount} en transport. En utilisant plus les transports publics, vous pourriez économiser environ {potential} par mois.',
                aiSuggestionLeisure: '🎮 Vous avez dépensé {amount} en loisirs. En limitant les sorties à 2 par semaine, vous pourriez économiser {potential}.',
                csvMappingTitle: '📋 Mapper les colonnes CSV',
                csvMappingInstructionsHtml: '<strong>📌 Instructions :</strong> Associe chaque colonne du CSV au bon champ. Montants positifs = <strong>revenus</strong>, négatifs = <strong>dépenses</strong>.',
                csvMappingFieldsTitle: '🎯 Association des champs :',
                showAllExpenses: 'Afficher toutes les dépenses de la période',
                edit: 'Modifier',
                fixedDateFormatDays: '🗓️ Jours restants',
                fixedDateFormatMonths: '📆 Mois et jours',
                fixedDateFormatHelp: 'Choisissez comment afficher les échéances des dépenses fixes',
                hideOptions: 'Masquer les options',
                row1: 'Ligne 1',
                row2: 'Ligne 2',
                row3: 'Ligne 3',
                endPeriod: 'Fin de période',
                transactionCounter: 'Transactions mensuelles',
                features: {
                    csvImport: '✅ Importation CSV',
                    csvImport: '❌ Importation CSV',
                    aiAssistant: '❌ Assistant IA',
                    cloudSync: '❌ Synchronisation cloud',
                    aiAssistant: '✅ Assistant IA',
                    cloudSync: '✅ Synchronisation cloud',
                    unlimitedTransactions: '✅ Transactions illimitées',
                    unlimitedFixedExpenses: '✅ Dépenses fixes illimitées',
                    savingsPercentUnlimited: '✅ Épargne jusqu\'à 50%',
                    customCategories: '✅ Catégories personnalisées',
                    excelImport: '✅ Importation CSV/Excel',
                    advancedAI: '✅ Assistant IA avancé',
                    detailedReports: '✅ Rapports détaillés',
                    voiceRecognition: '✅ Reconnaissance vocale',
                    colorCustomization: '✅ Couleurs personnalisées'
                }
            }
        };
        
        this.init();
    }

    initializeLicenseSystem() {
        // ========== SISTEMA LICENZE ==========
        if (typeof BudgetWiseLicense !== 'undefined') {
            this.license = new BudgetWiseLicense();
            console.log('✅ Sistema licenze inizializzato correttamente');
        } else {
            console.warn('⚠️ BudgetWiseLicense non disponibile, uso fallback');
            
            // Fallback inline
            this.license = {
                isPremium: false,
                trialUsed: false,
                limits: {
                    free: { 
                        maxTransactions: 30, 
                        maxFixedExpenses: 5,
                        maxSavingsPercent: 15,
                        maxCategories: 3, 
                        csvImport: false,
                        voiceRecognition: false,
                        colorCustomization: false,
                        advancedFixedFormat: false,
                        calendarExport: false
                    },
                    premium: { 
                        maxTransactions: Infinity, 
                        maxFixedExpenses: Infinity,
                        maxSavingsPercent: 50,
                        maxCategories: Infinity, 
                        csvImport: true,
                        voiceRecognition: true,
                        colorCustomization: true,
                        advancedFixedFormat: true,
                        calendarExport: true
                    }
                },
                checkPremiumStatus: () => false,
                getPlanInfo: () => ({ name: 'Free', status: 'Limitato' }),
                hasFullPremiumAccess: () => false,
                canUseFeature: (feature) => false,
                canAddTransaction: (count) => count < 30,
                canAddFixedExpense: (count) => count < 5,
                getCurrentLimits: () => ({ 
                    maxTransactions: 30, 
                    maxFixedExpenses: 5,
                    maxSavingsPercent: 15,
                    maxCategories: 3, 
                    csvImport: false,
                    voiceRecognition: false,
                    colorCustomization: false,
                    advancedFixedFormat: false,
                    calendarExport: false
                }),
                getMaxSavingsPercent: () => 15,
                getUpgradeMessage: (feature) => 'Questa funzionalità è disponibile nella versione Premium! 💎',
                isFeatureLocked: () => true
            };
        }
    }

    // ========== SISTEMA LIMITI FREE/PREMIUM ==========
    calculateMonthlyTransactions() {
        let count = 0;
        
        // Conta spese variabili
        if (this.data.variableExpenses) {
            Object.values(this.data.variableExpenses).forEach(day => {
                count += day?.length || 0;
            });
        }
        
        // Conta spese fisse
        count += this.data.fixedExpenses?.length || 0;
        
        // Conta entrate
        count += this.data.incomes?.length || 0;
        
        return count;
    }

    updateTransactionCount() {
        const count = this.calculateMonthlyTransactions();
        
        const transactionCounter = document.getElementById('transactionCounter');
        if (transactionCounter) {
            const limits = this.license?.getCurrentLimits();
            if (limits && !this.license?.hasFullPremiumAccess()) {
                transactionCounter.textContent = `${count}/${limits.maxTransactions}`;
                
                // Cambia colore se vicino al limite
                if (count >= limits.maxTransactions - 5) {
                    transactionCounter.classList.add('warning');
                } else {
                    transactionCounter.classList.remove('warning');
                }
                
                if (count >= limits.maxTransactions) {
                    transactionCounter.classList.add('danger');
                } else {
                    transactionCounter.classList.remove('danger');
                }
            } else {
                transactionCounter.textContent = '∞';
            }
        }
    }

    checkFreeLimits(feature, value = null) {
        if (!this.license) return true;
        
        // Se è premium o trial attivo, tutto permesso
        if (this.license.hasFullPremiumAccess?.() || false) return true;
        
        const limits = this.license.getCurrentLimits?.() || this.license.limits?.free;
        
        switch(feature) {
            case 'addVariableExpense':
            case 'addIncome':
                const transactionCount = this.calculateMonthlyTransactions();
                if (transactionCount >= limits.maxTransactions) {
                    this.showToast(`⚠️ Hai raggiunto il limite di ${limits.maxTransactions} transazioni mensili (versione Free)`);
                    this.showUpgradePrompt('transactions');
                    return false;
                }
                break;
                
            case 'addFixedExpense':
                if (this.data.fixedExpenses?.length >= limits.maxFixedExpenses) {
                    this.showToast(`⚠️ Limite di ${limits.maxFixedExpenses} spese fisse raggiunto (versione Free)`);
                    this.showUpgradePrompt('fixedExpenses');
                    return false;
                }
                break;
                
            case 'customCategory':
                if (!limits.customCategories) {
                    this.showUpgradePrompt('customCategories');
                    return false;
                }
                break;
                
            case 'csvImport':
                if (!limits.csvImport) {
                    this.showUpgradePrompt('csvImport');
                    return false;
                }
                break;
                
            case 'voiceRecognition':
                if (!limits.voiceRecognition) {
                    this.showUpgradePrompt('voiceRecognition');
                    return false;
                }
                break;
                
            case 'savePercent':
                const maxPercent = this.license.getMaxSavingsPercent?.() || limits.maxSavingsPercent;
                if (value > maxPercent) {
                    this.showToast(`⚠️ Nella versione Free la percentuale massima è ${maxPercent}%`);
                    return false;
                }
                break;
                
            case 'calendarExport':
                if (!limits.calendarExport) {
                    this.showUpgradePrompt('calendarExport');
                    return false;
                }
                break;
                
            case 'fixedDateFormat':
                if (!limits.advancedFixedFormat && value === 'months') {
                    this.showUpgradePrompt('advancedFixedFormat');
                    return false;
                }
                break;
                
            case 'colorCustomization':
                if (!limits.colorCustomization) {
                    this.showUpgradePrompt('colorCustomization');
                    return false;
                }
                break;
        }
        
        return true;
    }

    showUpgradePrompt(feature) {
        const message = this.license?.getUpgradeMessage?.(feature) || 
                       'Questa funzionalità è disponibile nella versione Premium! 💎';
        
        // Mostra un prompt non intrusivo
        const prompt = document.createElement('div');
        prompt.className = 'upgrade-prompt';
        prompt.innerHTML = `
            <h4>🔒 Versione Free</h4>
            <p>${message}</p>
            <button onclick="window.app?.showPremiumModal()">💎 Scopri Premium</button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            // Rimuovi eventuali prompt esistenti
            const oldPrompt = document.querySelector('.upgrade-prompt');
            if (oldPrompt) oldPrompt.remove();
            
            container.insertBefore(prompt, container.firstChild);
            
            setTimeout(() => {
                if (prompt.parentNode) {
                    prompt.remove();
                }
            }, 5000);
        }
    }

    applyFreeLimitsToUI() {
        if (!this.license) return;
        
        const isFree = !(this.license.hasFullPremiumAccess?.() || false);
        const limits = this.license.getCurrentLimits?.() || this.license.limits?.free;
        
        // Disabilita/Nascondi feature bloccate in free
        if (isFree) {
            // Categorie personalizzate
            if (!limits.customCategories) {
                document.querySelectorAll('[data-premium="custom-categories"], #manageCategoriesBtn, #categoryManagerOverlay').forEach(el => {
                    if (el) el.classList.add('feature-locked');
                });
            }
            
            // Riconoscimento vocale
            if (!limits.voiceRecognition) {
                const micFixed = document.getElementById('micFixedBtn');
                const voiceBtn = document.getElementById('voiceBtn');
                const chatVoice = document.getElementById('chatVoiceBtn');
                
                if (micFixed) {
                    micFixed.disabled = true;
                    micFixed.title = '🔒 Funzione Premium';
                }
                if (voiceBtn) {
                    voiceBtn.disabled = true;
                    voiceBtn.title = '🔒 Funzione Premium';
                }
                if (chatVoice) {
                    chatVoice.disabled = true;
                    chatVoice.title = '🔒 Funzione Premium';
                }
            }
            
            // Import CSV/Excel
            if (!limits.csvImport) {
                const importSection = document.querySelector('[data-tab="tools"] .section-card:has(#csvTitle)');
                if (importSection) {
                    importSection.classList.add('feature-locked');
                }
            }
            
            // Colori personalizzati
            if (!limits.colorCustomization) {
                const colorSection = document.querySelector('[data-tab="tools"] .section-card:has(#colorsTitle)');
                if (colorSection) {
                    colorSection.classList.add('feature-locked');
                }
                
                // Disabilita anche i color picker
                document.querySelectorAll('#colorAccent, #colorAccentLight, #colorCardBg, #colorTextPrimary, #colorTextSecondary, #colorBg, #colorSuccess, #colorDanger, #colorWarning, #colorBorder, #resetColorsBtn').forEach(el => {
                    if (el) el.disabled = true;
                });
            }
            
            // Formato date avanzato
            if (!limits.advancedFixedFormat) {
                const monthsRadio = document.getElementById('dateFormatMonths');
                if (monthsRadio) {
                    monthsRadio.disabled = true;
                    const monthsLabel = document.querySelector('label[for="dateFormatMonths"]');
                    if (monthsLabel) monthsLabel.classList.add('feature-locked-sm');
                }
            }
            
            // Esportazione calendario
            if (!limits.calendarExport) {
                const exportBtn = document.getElementById('exportCalendarBtn');
                if (exportBtn) {
                    exportBtn.disabled = true;
                    exportBtn.title = '🔒 Funzione Premium';
                }
            }
            
            // Limita percentuale risparmio
            const savePercentSlider = document.getElementById('savePercent');
            if (savePercentSlider) {
                savePercentSlider.max = limits.maxSavingsPercent;
            }
        }
    }

    init() {
        // ========== INIZIALIZZAZIONE SISTEMA LICENZE ==========
        this.initializeLicenseSystem();
        
        this.loadData();
        this.setupEventListeners();
        this.applyTheme();
        // NOTE: custom colors should NOT override theme defaults unless the user explicitly saved them.
        // Otherwise we would "freeze" light colors as inline CSS variables and dark mode would barely change.
        if (localStorage.getItem('budgetwise-custom-colors')) {
            this.applyCustomColors();
        } else {
            this.clearThemeInlineOverrides();
        }
        this.setupColorPickers();
        this.updateUI();
        this.updateChart();
        this.setupVoice();
        this.applyLanguage();
        this.startOnboarding();
        this.updateAllCategorySelects();
        this.initTabs();
        
        // Applica limiti free alla UI
        this.applyFreeLimitsToUI();

        const toggle = document.getElementById('showAllExpensesToggle');
        if (toggle) toggle.checked = !!this.showAllExpenses;
        this.populateCategoryFilter();
    }

    getDefaultPeriodStart() {
        // Default: start from last salary income (if available), otherwise today
        const salary = this.findLastSalaryIncome();
        if (salary && salary.date) return this.normalizeIsoDate(salary.date);
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    getDefaultPeriodEnd() {
        // Default: next salary date (one month after last salary), otherwise +28 days
        const salary = this.findLastSalaryIncome();
        if (salary && salary.date) {
            const start = this.normalizeIsoDate(salary.date);
            const next = this.addMonthsClamp(start, 1);
            return next;
        }
        const end = new Date();
        end.setDate(end.getDate() + 28);
        return end.toISOString().split('T')[0];
    }

    normalizeIsoDate(dateStr) {
        if (!dateStr) return '';
        const s = String(dateStr).trim();
        const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (m) {
            const y = m[1];
            const mm = String(m[2]).padStart(2, '0');
            const dd = String(m[3]).padStart(2, '0');
            return `${y}-${mm}-${dd}`;
        }
        return s;
    }

    /**
     * Parsing robusto importi (supporta formati tipo "1.234,56" e "1234.56")
     */
    parseMoney(value) {
        if (typeof value === 'number' && isFinite(value)) return value;
        if (value === null || value === undefined) return 0;
        let s = String(value).trim();
        if (!s) return 0;

        // Rimuovi simboli e spazi
        s = s.replace(/\s/g, '');

        // Se contiene sia '.' che ',' assumiamo: '.' migliaia e ',' decimali (formato IT)
        if (s.includes('.') && s.includes(',')) {
            s = s.replace(/\./g, '').replace(',', '.');
        } else if (s.includes(',') && !s.includes('.')) {
            // Solo ',' -> decimali
            s = s.replace(',', '.');
        }

        // Pulisci tutto tranne cifre, punto e segno
        s = s.replace(/[^0-9.\-]/g, '');

        const n = parseFloat(s);
        return isFinite(n) ? n : 0;
    }



    // ==================== PERIODO BASATO SU STIPENDIO ====================
    isSalaryIncome(inc) {
        if (!inc) return false;
        const desc = String(inc.desc || '').toLowerCase();
        // Versione multilingua potenziata
        return /\b(stipend(io)?|mensilit[àa]|cedolino|paga|salario|retribuzione|salary|pay(|roll|check|cheque)|wage|earnings|stipend|sueldo|salario|estipendio|salaire|paie|traitement|rémunération|gehalt|lohn|besoldung|vergütung|entgelt|salär)\b/i.test(desc);
    }

    findLastSalaryIncome() {
        if (!this.data.incomes || !Array.isArray(this.data.incomes)) return null;
        const today = new Date();
        const candidates = this.data.incomes
            .filter(inc => inc && inc.date && this.isSalaryIncome(inc))
            .map(inc => ({ ...inc, _d: new Date(this.normalizeIsoDate(inc.date)) }))
            .filter(inc => !isNaN(inc._d.getTime()) && inc._d <= today)
            .sort((a, b) => a._d - b._d);
        return candidates.length ? candidates[candidates.length - 1] : null;
    }

    // Aggiunge mesi mantenendo il "giorno stipendio"; se il mese non ha quel giorno, usa l'ultimo giorno del mese
    addMonthsClamp(isoDate, monthsToAdd) {
        const d = new Date(this.normalizeIsoDate(isoDate));
        if (isNaN(d.getTime())) return '';
        const y = d.getFullYear();
        const m = d.getMonth();
        const day = d.getDate();
        const targetMonth = m + (monthsToAdd || 0);
        const ty = y + Math.floor(targetMonth / 12);
        const tm = ((targetMonth % 12) + 12) % 12;
        const lastDay = new Date(ty, tm + 1, 0).getDate();
        const dd = Math.min(day, lastDay);
        const out = new Date(ty, tm, dd);
        return out.toISOString().split('T')[0];
    }

    ensureSalaryPeriod() {
        // CERCA PRIMA UNO STIPENDIO
        const lastSalary = this.findLastSalaryIncome();
        
        if (lastSalary && lastSalary.date) {
            const start = this.normalizeIsoDate(lastSalary.date);
            const nextSalary = this.addMonthsClamp(start, 1);
            
            this.data.periodStart = start;
            this.data.periodEnd = nextSalary;
            console.log('📅 Periodo basato su stipendio:', start, '→', nextSalary);
            return;
        }
        
        // SE NON TROVA STIPENDIO, USA LA PRIMA ENTRATA
        if (this.data.incomes && this.data.incomes.length > 0) {
            // Ordina per data
            const sorted = [...this.data.incomes].sort((a, b) => 
                new Date(a.date) - new Date(b.date)
            );
            
            const start = this.normalizeIsoDate(sorted[0].date);
            const nextSalary = this.addMonthsClamp(start, 1);
            
            this.data.periodStart = start;
            this.data.periodEnd = nextSalary;
            console.log('📅 Periodo basato su prima entrata:', start, '→', nextSalary);
            return;
        }
        
        // DEFAULT
        const today = new Date();
        const end = new Date(today);
        end.setDate(today.getDate() + 28);
        
        this.data.periodStart = today.toISOString().split('T')[0];
        this.data.periodEnd = end.toISOString().split('T')[0];
    }

    isDateInPeriod(isoDate) {
        const d = new Date(this.normalizeIsoDate(isoDate));
        const start = new Date(this.normalizeIsoDate(this.data.periodStart));
        const end = new Date(this.normalizeIsoDate(this.data.periodEnd));
        if ([d, start, end].some(x => isNaN(x.getTime()))) return false;
        return d >= start && d < end;
    }


    // ==================== FIRST RUN / DEMO DATA ====================
    isFirstRun() {
        return localStorage.getItem('budgetwise-first-run-seen') !== 'true';
    }

    markFirstRunSeen() {
        localStorage.setItem('budgetwise-first-run-seen', 'true');
    }

    getDemoCustomCategories() {
        const lang = this.data.language || 'it';
        const map = {
            it: { home: 'Casa', kids: 'Bambini', work: 'Lavoro' },
            en: { home: 'Home', kids: 'Kids', work: 'Work' },
            es: { home: 'Casa', kids: 'Niños', work: 'Trabajo' },
            fr: { home: 'Maison', kids: 'Enfants', work: 'Travail' }
        };
        return map[lang] || map.it;
    }

    ensureDemoCategories() {
        const dc = this.getDemoCustomCategories();
        const demoCats = [dc.home, dc.kids, dc.work];
        let changed = false;

        demoCats.forEach(cat => {
            if (!this.getAllCategories().includes(cat)) {
                this.customCategories.push(cat);
                changed = true;
            }
        });

        if (changed) {
            this.saveCustomCategories();
            this.updateAllCategorySelects();
        }
    }

        getDemoData() {
        const today = new Date();
        const lang = this.data.language || 'it';
        const demoText = {
            it: {
                income: 'Stipendio',
                rent: 'Affitto',
                phone: 'Telefono',
                grocery: 'Spesa supermercato',
                homeMaint: 'Manutenzione casa',
                fuel: 'Benzina',
                pharmacy: 'Farmacia',
                pizza: 'Pizza',
                daycare: 'Asilo',
                tshirt: 'Maglietta',
                coffee: 'Caffè',
                workLunch: 'Pranzo lavoro'
            },
            en: {
                income: 'Salary',
                rent: 'Rent',
                phone: 'Phone',
                grocery: 'Groceries',
                homeMaint: 'Home maintenance',
                fuel: 'Fuel',
                pharmacy: 'Pharmacy',
                pizza: 'Pizza',
                daycare: 'Daycare',
                tshirt: 'T-shirt',
                coffee: 'Coffee',
                workLunch: 'Work lunch'
            },
            es: {
                income: 'Salario',
                rent: 'Alquiler',
                phone: 'Teléfono',
                grocery: 'Supermercado',
                homeMaint: 'Mantenimiento del hogar',
                fuel: 'Gasolina',
                pharmacy: 'Farmacia',
                pizza: 'Pizza',
                daycare: 'Guardería',
                tshirt: 'Camiseta',
                coffee: 'Café',
                workLunch: 'Almuerzo de trabajo'
            },
            fr: {
                income: 'Salaire',
                rent: 'Loyer',
                phone: 'Téléphone',
                grocery: 'Courses',
                homeMaint: 'Entretien maison',
                fuel: 'Carburant',
                pharmacy: 'Pharmacie',
                pizza: 'Pizza',
                daycare: 'Crèche',
                tshirt: 'T-shirt',
                coffee: 'Café',
                workLunch: 'Déjeuner de travail'
            }
        };
        
        // Mappa delle categorie per lingua
        const categoryMap = {
            it: {
                groceries: 'Alimentari',
                transport: 'Trasporti',
                leisure: 'Svago',
                health: 'Salute',
                clothing: 'Abbigliamento',
                other: 'Altro'
            },
            en: {
                groceries: 'Groceries',
                transport: 'Transport',
                leisure: 'Leisure',
                health: 'Health',
                clothing: 'Clothing',
                other: 'Other'
            },
            es: {
                groceries: 'Alimentación',
                transport: 'Transporte',
                leisure: 'Ocio',
                health: 'Salud',
                clothing: 'Ropa',
                other: 'Otros'
            },
            fr: {
                groceries: 'Alimentation',
                transport: 'Transport',
                leisure: 'Loisirs',
                health: 'Santé',
                clothing: 'Vêtements',
                other: 'Autre'
            }
        };
        
        const T = demoText[lang] || demoText.it;
        const dc = this.getDemoCustomCategories();
        const cats = categoryMap[lang] || categoryMap.it;
        const iso = (d) => d.toISOString().split('T')[0];

        const start = new Date(today);
        const end = new Date(today);
        end.setDate(end.getDate() + 30);

        const makeDate = (offset) => {
            const d = new Date(today);
            d.setDate(d.getDate() - offset);
            return iso(d);
        };

        const now = Date.now();

        const demoVariable = {};
        demoVariable[makeDate(0)] = [
            { name: T.grocery, amount: 23.40, category: cats.groceries, id: now + 1 },
            { name: T.homeMaint, amount: 30.00, category: dc.home, id: now + 7 }
        ];
        demoVariable[makeDate(1)] = [
            { name: T.fuel, amount: 35.00, category: cats.transport, id: now + 2 }
        ];
        demoVariable[makeDate(2)] = [
            { name: T.pharmacy, amount: 12.90, category: cats.health, id: now + 3 }
        ];
        demoVariable[makeDate(3)] = [
            { name: T.pizza, amount: 18.00, category: cats.leisure, id: now + 4 },
            { name: T.daycare, amount: 120.00, category: dc.kids, id: now + 8 }
        ];
        demoVariable[makeDate(4)] = [
            { name: T.tshirt, amount: 19.99, category: cats.clothing, id: now + 5 }
        ];
        demoVariable[makeDate(5)] = [
            { name: T.coffee, amount: 2.20, category: cats.other, id: now + 6 },
            { name: T.workLunch, amount: 14.00, category: dc.work, id: now + 9 }
        ];

        const farFuture = new Date(today);
        farFuture.setFullYear(farFuture.getFullYear() + 5);

        return {
            incomes: [
                { desc: T.income, amount: 2000, date: iso(today), id: now + 100 }
            ],
            fixedExpenses: [
                { name: T.rent, amount: 650, day: 5, endDate: iso(farFuture), id: now + 200 },
                { name: T.phone, amount: 15, day: 12, endDate: iso(farFuture), id: now + 201 }
            ],
            variableExpenses: demoVariable,
            savingsPercent: 10,
            savingsGoal: 1500,
            threshold: 50,
            language: this.data.language || 'it',
            periodStart: iso(start),
            periodEnd: iso(end)
        };
    }

    loadDemoData() {
        this.ensureDemoCategories();
        this.data = this.getDemoData();
        this.saveData();
        this.updateAllCategorySelects();
        this.updateUI();
        this.updateChart();
        this.applyLanguage();

        localStorage.setItem('budgetwise-demo-loaded', 'true');
        this.showToast(this.t('demoLoaded'), 'success');
    }

    t(key, vars) {
        const lang = this.data.language || "it";
        const dict = this.translations[lang] || this.translations.it || {};
        let str = dict[key] ?? (this.translations.en ? (this.translations.en[key] ?? key) : key);
        if (vars && typeof vars === "object") {
            for (const [k, v] of Object.entries(vars)) {
                str = String(str).replaceAll(`{${k}}`, String(v));
            }
        }
        return str;
    }

 applyLanguage() {
        console.log('🌐 Cambio lingua a:', this.data.language);
        // Applica traduzioni a tutti gli elementi con data-i18n (testi, placeholder, aria-label)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;
            const val = this.t(key);
            const tag = (el.tagName || '').toUpperCase();

            // placeholder per input/textarea
            if ((tag === 'INPUT' || tag === 'TEXTAREA') && el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', val);
                return;
            }

           // Se serve HTML (es. <strong>, <br>), abilitalo solo dove dichiarato
if (el.hasAttribute('data-i18n-html')) {
    el.innerHTML = val;
} else {
    el.textContent = val;
}
        });

        document.getElementById('languageSelect').value = this.data.language;
        const subtitleEl = document.querySelector('.subtitle');
        if (subtitleEl) subtitleEl.textContent = this.t('subtitle');
        document.documentElement.lang = (this.data.language || 'it');
        document.title = this.t('docTitle');
        
        const summaryLabels = document.querySelectorAll('.summary-label');
        if (summaryLabels.length >= 3) {
            summaryLabels[0].textContent = this.t('budget');
            summaryLabels[1].textContent = this.t('remaining');
            summaryLabels[2].textContent = this.t('days');
        }
        
        const h2s = document.querySelectorAll('h2');
        h2s.forEach(h2 => {
            const text = h2.textContent;
            if (text.includes('🏦')) h2.innerHTML = this.t('incomes');
            else if (text.includes('📌')) h2.innerHTML = this.t('fixed');
            else if (text.includes('🧾')) h2.innerHTML = this.t('variable');
            else if (text.includes('📊')) h2.innerHTML = this.t('chart');
            else if (text.includes('Suggerimenti')) h2.innerHTML = this.t('aiSuggestionsTitle');
            else if (text.includes('🤖')) h2.innerHTML = this.t('assistant');
            else if (text.includes('🎯')) h2.innerHTML = this.t('savings');
            else if (text.includes('⚙️')) h2.innerHTML = this.t('settings');
        });
        
        const badge = document.querySelector('.badge');
        if (badge) badge.textContent = this.t('badge');
        
        document.getElementById('addIncomeBtn').innerHTML = this.t('addIncome');
        document.getElementById('addFixedBtn').innerHTML = this.t('addFixed');
        document.getElementById('addExpenseBtn').innerHTML = this.t('addExpense');
        document.getElementById('resetDayBtn').innerHTML = this.t('resetDay');
        const resetPeriodBtn = document.getElementById('resetPeriodVariableBtn');
        if (resetPeriodBtn) resetPeriodBtn.innerHTML = this.t('resetVariablePeriod');
        document.getElementById('applySaveBtn').textContent = this.t('applySavings');
        document.getElementById('backupBtn').innerHTML = this.t('backup');
        document.getElementById('restoreBtn').innerHTML = this.t('restore');

        const loadDemoBtn = document.getElementById('loadDemoBtn');
        if (loadDemoBtn) loadDemoBtn.textContent = this.t('onboardingDemo');
        document.getElementById('resetAllBtn').innerHTML = this.t('resetAll');
        document.getElementById('exportCalendarBtn').textContent = this.t('export');
        document.getElementById('sendChatBtn').textContent = this.t('send');
        
        document.getElementById('incomeDesc').placeholder = this.t('incomeDesc');
        document.getElementById('incomeAmount').placeholder = this.t('incomeAmount');
        document.getElementById('fixedName').placeholder = this.t('fixedName');
        document.getElementById('fixedAmount').placeholder = this.t('fixedAmount');
        document.getElementById('fixedDay').placeholder = this.t('fixedDay');
        document.getElementById('expenseName').placeholder = this.t('expenseName');
        document.getElementById('expenseAmount').placeholder = this.t('expenseAmount');
        document.getElementById('chatInput').placeholder = this.t('chatPlaceholder');
        
        const dateLabel = document.querySelector('.date-selector label');
        if (dateLabel) dateLabel.textContent = this.t('dateLabel');
        
        const dayLabel = document.querySelector('.input-group.half label');
        if (dayLabel) dayLabel.textContent = this.t('dayLabel');
        
        const endDateLabel = document.querySelectorAll('.input-group.half label')[1];
        if (endDateLabel) endDateLabel.textContent = this.t('endDateLabel');
        
        document.getElementById('fixedVoiceStatus').textContent = this.t('micFixed');
        document.getElementById('voiceStatus').textContent = this.t('micVariable');
        
        const helpFixed = document.getElementById('fixedHelp');
        if (helpFixed) helpFixed.textContent = this.t('helpFixed');
        
        document.getElementById('chartNote').textContent = this.t('chartNote');
        
        const percentLabel = document.querySelector('.input-group label[for="savePercent"]');
        if (percentLabel) percentLabel.textContent = this.t('percentLabel');
        
        const goalLabel = document.querySelector('.input-group label[for="saveGoal"]');
        if (goalLabel) goalLabel.textContent = this.t('goalLabel');
        
        const settingLabels = document.querySelectorAll('.setting-item label');
        if (settingLabels.length >= 3) {
            settingLabels[0].innerHTML = this.t('thresholdLabel');
            settingLabels[1].innerHTML = this.t('languageLabel');
            settingLabels[2].innerHTML = this.t('backupLabel');
        }
        
        const welcomeMessage = document.querySelector('.chat-message.bot .message-text');
        if (welcomeMessage) welcomeMessage.textContent = this.t('welcomeMessage');
        
        const suggestionChips = document.querySelectorAll('.suggestion-chip');
        if (suggestionChips.length >= 4) {
            suggestionChips[0].textContent = this.t('suggestion1');
            suggestionChips[1].textContent = this.t('suggestion2');
            suggestionChips[2].textContent = this.t('suggestion3');
            suggestionChips[3].textContent = this.t('suggestion4');
        }
        
        document.getElementById('guideMessage').textContent = this.t('startGuide');
        
        const micFixedSpan = document.getElementById('micFixedText');
        if (micFixedSpan) micFixedSpan.textContent = this.t('fixedVoiceButton');

        const voiceBtnSpan = document.getElementById('voiceBtnText');
        if (voiceBtnSpan) voiceBtnSpan.textContent = this.t('variableVoiceButton');

        const totalIncomeLabel = document.getElementById('totalIncomeLabel');
        if (totalIncomeLabel) totalIncomeLabel.textContent = this.t('totalIncome');

        const footerText = document.getElementById('footerText');
        if (footerText) footerText.textContent = this.t('footerText');

        const footerFeatures = document.getElementById('footerFeatures');
        if (footerFeatures) footerFeatures.textContent = this.t('footerFeatures');

        const budgetLabel = document.getElementById('budgetLabel');
        if (budgetLabel) budgetLabel.textContent = this.t('budget');
        
        const remainingLabel = document.getElementById('remainingLabel');
        if (remainingLabel) remainingLabel.textContent = this.t('remaining');
        
        const daysLabel = document.getElementById('daysLabel');
        if (daysLabel) daysLabel.textContent = this.t('days');
        
        const assistantNameText = document.getElementById('assistantNameText');
        if (assistantNameText) assistantNameText.textContent = this.t('assistantName');
        
        const incomeDateLabel = document.getElementById('incomeDateLabel');
        if (incomeDateLabel) incomeDateLabel.textContent = this.t('incomeDateLabel');
        
        // Traduci le opzioni del select delle categorie (nel modulo variabili)
const categorySelect = document.getElementById('expenseCategory');
if (categorySelect) {
    // Ricrea le opzioni con le traduzioni corrette
    const categories = [
        { value: 'Alimentari', key: 'categoryAlimentari' },
        { value: 'Trasporti', key: 'categoryTrasporti' },
        { value: 'Altro', key: 'categoryAltro' },
        { value: 'Svago', key: 'categorySvago' },
        { value: 'Salute', key: 'categorySalute' },
        { value: 'Abbigliamento', key: 'categoryAbbigliamento' }
    ];
    
    // Filtra in base alle categorie disponibili (solo premium ha tutte)
    const availableCats = categories.slice(0, categorySelect.options.length);
    
    categorySelect.innerHTML = availableCats.map(cat => 
        `<option value="${cat.value}">${this.t(cat.key)}</option>`
    ).join('');
}
        
        const dateHintFixed = document.getElementById('dateHintFixed');
        if (dateHintFixed) dateHintFixed.textContent = this.t('dateHint');

        const dateHintVariable = document.getElementById('dateHintVariable');
        if (dateHintVariable) dateHintVariable.textContent = this.t('dateHint');

        const showAllLabel = document.getElementById('showAllExpensesLabel');
        if (showAllLabel) showAllLabel.textContent = this.t('showAllExpenses');
        
        const csvTitle = document.getElementById('csvTitle');
        if (csvTitle) csvTitle.textContent = this.t('csvTitle');

        const csvSubtitle = document.getElementById('csvSubtitle');
        if (csvSubtitle) csvSubtitle.textContent = this.t('csvSubtitle');

        const csvChooseFileLabel = document.getElementById('csvChooseFileLabel');
        if (csvChooseFileLabel) csvChooseFileLabel.textContent = this.t('csvChooseFile');

        const csvFileName = document.getElementById('csvFileName');
        if (csvFileName && (csvFileName.textContent === 'Nessun file selezionato' || csvFileName.textContent === 'No file selected')) {
            csvFileName.textContent = this.t('csvNoFile');
        }

        const importCsvBtn = document.getElementById('importCsvBtn');
        if (importCsvBtn) importCsvBtn.innerHTML = this.t('csvImportBtn');

        const csvDateFormatLabel = document.getElementById('csvDateFormatLabel');
        if (csvDateFormatLabel) csvDateFormatLabel.textContent = this.t('csvDateFormat');

        const csvSeparatorLabel = document.getElementById('csvSeparatorLabel');
        if (csvSeparatorLabel) csvSeparatorLabel.textContent = this.t('csvSeparator');

        const delimiterSelect = document.getElementById('csvDelimiter');
        if (delimiterSelect) {
            const options = delimiterSelect.options;
            if (options.length >= 2) {
                options[0].text = this.data.language === 'it' ? 'GG/MM/AAAA' : 'DD/MM/YYYY';
                options[1].text = this.data.language === 'it' ? 'MM/DD/AAAA' : 'MM/DD/YYYY';
            }
        }

        const separatorSelect = document.getElementById('csvSeparator');
        if (separatorSelect) {
            const options = separatorSelect.options;
            if (options.length >= 3) {
                options[0].text = this.t('csvComma');
                options[1].text = this.t('csvSemicolon');
                options[2].text = this.t('csvTab');
            }
        }

        const csvPreviewTitle = document.getElementById('csvPreviewTitle');
        if (csvPreviewTitle) csvPreviewTitle.textContent = this.t('csvPreview');

        const aiWidgetTitle = document.getElementById('aiWidgetTitle');
        if (aiWidgetTitle) aiWidgetTitle.textContent = this.t('aiSuggestionsTitle');
        const aiWidgetBadge = document.getElementById('aiWidgetBadge');
        if (aiWidgetBadge) aiWidgetBadge.textContent = this.t('aiSmartBadge');
        const closeDetailBtn2 = document.getElementById('closeDetailBtn');
        if (closeDetailBtn2) closeDetailBtn2.textContent = this.t('close');
        const importReviewTitle = document.getElementById('importReviewTitle');
        if (importReviewTitle) importReviewTitle.textContent = this.t('importReview');
        const csvMappingTitle = document.getElementById('csvMappingTitle');
        if (csvMappingTitle) csvMappingTitle.textContent = this.t('csvMappingTitle');
        const csvMappingInstructions = document.getElementById('csvMappingInstructions');
        if (csvMappingInstructions) csvMappingInstructions.innerHTML = this.t('csvMappingInstructionsHtml');
        const csvMappingFieldsTitle = document.getElementById('csvMappingFieldsTitle');
        if (csvMappingFieldsTitle) csvMappingFieldsTitle.textContent = this.t('csvMappingFieldsTitle');

        const catSectionTitle = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('📂'));
        if (catSectionTitle) catSectionTitle.textContent = this.t('categoriesSectionTitle');

        const manageBtn = document.getElementById('manageCategoriesBtn');
        if (manageBtn) manageBtn.textContent = this.t('manageCustomCategories');

        const catOverlay = document.getElementById('categoryManagerOverlay');
        if (catOverlay) {
            const h3 = catOverlay.querySelector('h3');
            if (h3) h3.textContent = this.t('manageCategories');

            const h4s = catOverlay.querySelectorAll('h4');
            if (h4s.length >= 2) {
                h4s[0].textContent = this.t('defaultCategoriesTitle');
                h4s[1].textContent = this.t('yourCategoriesTitle');
            }

            const newCatLabel = catOverlay.querySelector('label[for="newCategoryName"]');
            if (newCatLabel) newCatLabel.textContent = this.t('newCategoryLabel');

            const newCatInput = document.getElementById('newCategoryName');
            if (newCatInput) newCatInput.placeholder = this.t('newCategoryPlaceholder');

            const saveCatBtn = document.getElementById('saveCategoryBtn');
            if (saveCatBtn) saveCatBtn.textContent = this.t('add');

            const closeCatBtn = document.getElementById('closeCategoryManager');
            if (closeCatBtn) closeCatBtn.textContent = this.t('close');
        }

        // Traduci i bottoni dei tab
        const tabButtons = document.querySelectorAll('.tab-btn');
        if (tabButtons.length >= 5) {
            tabButtons[0].textContent = this.t('tabHome');
            tabButtons[1].textContent = this.t('tabIncomes');
            tabButtons[2].textContent = this.t('tabFixed');
            tabButtons[3].textContent = this.t('tabVariable');
            tabButtons[4].textContent = this.t('tabTools');
        }

                        // Traduzioni per skip rows
        const skipRowsLabel = document.getElementById('skipRowsLabel');
        if (skipRowsLabel) skipRowsLabel.textContent = this.t('skipRowsLabel');
        const headerRowManualLabel = document.getElementById('headerRowManualLabel');
        if (headerRowManualLabel) headerRowManualLabel.textContent = this.t('headerRowManualLabel');
        const skipHelp = document.getElementById('skipHelp');
        if (skipHelp) skipHelp.textContent = this.t('skipHelp');

        // ===== NUOVE TRADUZIONI AGGIUNTIVE =====
        
        // 1. WIDGET RISPARMIO
        const savingsWidgetTitle = document.getElementById('savingsWidgetTitle');
        if (savingsWidgetTitle) savingsWidgetTitle.textContent = this.t('savingsWidgetTitle');
        
        const targetDate = document.getElementById('targetDate');
        if (targetDate && (targetDate.textContent === 'Mai' || targetDate.textContent === 'Never' || targetDate.textContent === 'Nunca' || targetDate.textContent === 'Jamais')) {
            targetDate.textContent = this.t('never');
        }
        
        const percentLabels = document.querySelectorAll('.slider-labels span');
        if (percentLabels.length >= 3) {
            percentLabels[0].textContent = this.t('percent0');
            percentLabels[1].textContent = this.t('percent15');
            percentLabels[2].textContent = this.t('percent30');
        }
        
        const savingsPotInputLabel = document.getElementById('savingsPotInputLabel');
        if (savingsPotInputLabel) savingsPotInputLabel.textContent = this.t('savingsPotInputLabel');
        
        const currentPlanTitle = document.getElementById('currentPlanTitle');
        if (currentPlanTitle) currentPlanTitle.innerHTML = this.t('currentPlan');
        
        const currentPlanMessage = document.getElementById('currentPlanMessage');
        if (currentPlanMessage) currentPlanMessage.innerHTML = this.t('currentPlanMessage');
        
                // 2. IMPOSTAZIONI - FORMATO DATE FISSE
        const fixedDaysLabel = document.querySelector('label[for="dateFormatDays"] span');
        if (fixedDaysLabel) fixedDaysLabel.textContent = this.t('fixedDateFormatDays');
        
        const fixedMonthsLabel = document.querySelector('label[for="dateFormatMonths"] span');
        if (fixedMonthsLabel) fixedMonthsLabel.textContent = this.t('fixedDateFormatMonths');
        
        const helpText = document.getElementById('fixedDateFormatHelp');
        if (helpText) helpText.textContent = this.t('fixedDateFormatHelp');
        
        // 3. PULSANTI BACKUP
        const backupLabel = document.getElementById('backupLabel');
        if (backupLabel) backupLabel.textContent = this.t('backupLabel');
        
        const backupBtn = document.getElementById('backupBtn');
        if (backupBtn) backupBtn.innerHTML = this.t('backupButton');
        
        const restoreBtn = document.getElementById('restoreBtn');
        if (restoreBtn) restoreBtn.innerHTML = this.t('restoreButton');
        
        // 4. RICERCA
        const searchInput = document.getElementById('searchExpenses');
        if (searchInput) searchInput.placeholder = this.t('searchPlaceholder');
        
        const allCategoriesOption = document.querySelector('#searchCategory option[value="all"]');
        if (allCategoriesOption) allCategoriesOption.textContent = this.t('allCategories');
        
        const resetSearchBtn = document.getElementById('resetSearchBtn');
        if (resetSearchBtn) resetSearchBtn.innerHTML = this.t('clearFilters');
        
        // 5. RIEPILOGO IN ALTO
        const savingsPotLabel = document.getElementById('savingsPotLabel');
        if (savingsPotLabel) savingsPotLabel.textContent = this.t('savingsPotLabel');
        
        // 6. IMPORT AVANZATO - EXCEL
        const excelSheetLabel = document.getElementById('excelSheetLabel');
        if (excelSheetLabel) excelSheetLabel.textContent = this.t('excelSheet');
        
        const excelHeaderLabel = document.getElementById('excelHeaderLabel');
        if (excelHeaderLabel) excelHeaderLabel.textContent = this.t('excelHeaderRow');
        
        const excelSheetSelect = document.getElementById('excelSheet');
        if (excelSheetSelect) {
            const placeholderOption = excelSheetSelect.querySelector('option[value=""]');
            if (placeholderOption) placeholderOption.textContent = this.t('excelSheetPlaceholder');
        }
        
        const excelHeaderSelect = document.getElementById('excelHeaderRow');
        if (excelHeaderSelect) {
            const options = excelHeaderSelect.options;
            if (options.length >= 4) {
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === "-1") {
                        options[i].text = this.t('rowNone');
                    }
                }
            }
        }
        
        this.updateIncomeList();
        this.updateFixedExpensesList();
        this.updateVariableExpensesList();
        this.updateFixedStatusHome();
        this.updateChart();

        this.updateAllCategorySelects();
        const catOverlayOpen = document.getElementById('categoryManagerOverlay');
        if (catOverlayOpen && catOverlayOpen.style.display === 'flex') this.refreshCategoryList();
// Traduci il pulsante "Forse dopo" nel modal Premium
const closePremiumBtn = document.getElementById('closePremiumBtn');
if (closePremiumBtn) {
    // Mantieni l'emoji ✕ e aggiungi il testo tradotto
    closePremiumBtn.innerHTML = `✕ ${this.t('maybeLater')}`;
}

// Traduci lo span del pulsante Aggiungi categoria
const addCategoryBtnText = document.getElementById('addCategoryBtnText');
if (addCategoryBtnText) {
    addCategoryBtnText.textContent = this.t('add');
}

// Traduci le opzioni del select delle righe intestazione Excel
const excelHeaderSelectEl = document.getElementById('excelHeaderRow');  // CAMBIATO IL NOME
if (excelHeaderSelectEl) {
    const options = excelHeaderSelectEl.options;
    if (options.length >= 4) {
        // Traduci "None (auto)"
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === "-1") {
                options[i].text = this.t('rowNone');
            }
        }
    }
}

                // ===== NUOVE TRADUZIONI =====
        // 2. IMPORT EXCEL (placeholder e help)
        const excelSheetPlaceholderOption = document.querySelector('#excelSheet option[value=""]');
        if (excelSheetPlaceholderOption) excelSheetPlaceholderOption.textContent = this.t('excelSheetPlaceholder');

        const excelHelpElement = document.getElementById('excelHelp');
        if (excelHelpElement) excelHelpElement.textContent = this.t('excelHelp');

        // 3. PULSANTI BACKUP
        const backupButtonElement = document.getElementById('backupBtn');
        if (backupButtonElement) backupButtonElement.innerHTML = this.t('backupButton');

        const restoreButtonElement = document.getElementById('restoreBtn');
        if (restoreButtonElement) restoreButtonElement.innerHTML = this.t('restoreButton');

        // 4. WIDGET AI
        const aiWidgetTitleElement = document.getElementById('aiWidgetTitle');
        if (aiWidgetTitleElement) aiWidgetTitleElement.textContent = this.t('aiSuggestionsTitle');

        const aiWidgetBadgeElement = document.getElementById('aiWidgetBadge');
        if (aiWidgetBadgeElement) aiWidgetBadgeElement.textContent = this.t('aiSmartBadge');
        
        // 5. CONTATORE TRANSAZIONI
        const transactionCounter = document.getElementById('transactionCounter');
        if (transactionCounter) {
            this.updateTransactionCount();
        }
        
        this.updatePeriodInfo();
    }
                

    initTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const sections = document.querySelectorAll('.section-card[data-tab]');

        const showTab = (tabId) => {
            sections.forEach(s => {
                s.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                s.style.opacity = '0';
                s.style.transform = 'translateY(10px)';
            });

            setTimeout(() => {
                sections.forEach(s => s.style.display = 'none');
                const toShow = document.querySelectorAll(`.section-card[data-tab="${tabId}"]`);
                toShow.forEach(s => {
                    s.style.display = 'block';
                    void s.offsetWidth;
                    s.style.opacity = '1';
                    s.style.transform = 'translateY(0)';
                });

                const guide = document.querySelector('.guide-message[data-tab]');
                if (guide) {
                    guide.style.display = (tabId === guide.dataset.tab) ? 'block' : 'none';
                    if (guide.style.display === 'block') {
                        guide.style.opacity = '1';
                        guide.style.transform = 'translateY(0)';
                    }
                }

                tabs.forEach(t => t.classList.remove('active'));
                document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
            }, 200);
        };

        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                showTab(btn.dataset.tab);
            });
        });

        showTab('home');
    }

    updatePeriodInfo() {
        document.getElementById('periodInfo').textContent = `📅 ${this.t('period')}: ${this.data.periodStart} → ${this.data.periodEnd}`;
        
        const sourceEl = document.getElementById('periodSource');
        if (sourceEl && this.data.incomes && this.data.incomes.length > 0) {
            const firstIncome = this.data.incomes.sort((a,b) => new Date(a.date) - new Date(b.date))[0];
            sourceEl.textContent = this.data.language === 'it'
                ? `⏳ Periodo iniziato con: ${firstIncome.desc} del ${firstIncome.date}`
                : `⏳ Period started with: ${firstIncome.desc} on ${firstIncome.date}`;
        }
    }

    // ========== CALCOLI CON CONTROLLI ==========
    calculateTotalIncome() {
        if (!this.data.incomes || !Array.isArray(this.data.incomes)) return 0;
        // Somma solo le entrate nel periodo [periodStart, periodEnd]
        return this.data.incomes.reduce((sum, inc) => {
            const d = this.normalizeIsoDate(inc.date);
            if (!d || !this.isDateInPeriod(d)) return sum;
            return sum + (inc.amount || 0);
        }, 0);
    }

    calculateTotalVariableExpenses() {
        if (!this.data.variableExpenses || typeof this.data.variableExpenses !== 'object') return 0;
        let total = 0;
        Object.entries(this.data.variableExpenses).forEach(([date, day]) => {
            const d = this.normalizeIsoDate(date);
            if (!d || !this.isDateInPeriod(d)) return;
            if (Array.isArray(day)) {
                day.forEach(exp => total += (exp.amount || 0));
            }
        });
        return total;
    }

    calculateTotalFixedExpenses() {
        if (!this.data.fixedExpenses || !Array.isArray(this.data.fixedExpenses)) return 0;

        const start = new Date(this.normalizeIsoDate(this.data.periodStart));
        const end = new Date(this.normalizeIsoDate(this.data.periodEnd));
        if ([start, end].some(d => isNaN(d.getTime()))) return 0;

        // Scorre i mesi compresi nel periodo e include le scadenze che cadono nel periodo
        const months = [];
        const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
        const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
        while (cursor <= endMonth) {
            months.push({ y: cursor.getFullYear(), m: cursor.getMonth() });
            cursor.setMonth(cursor.getMonth() + 1);
        }

        let total = 0;

        for (const exp of this.data.fixedExpenses) {
            if (!exp || !exp.day) continue;

            const expEnd = exp.endDate ? new Date(this.normalizeIsoDate(exp.endDate)) : null;

            for (const mm of months) {
                const lastDay = new Date(mm.y, mm.m + 1, 0).getDate();
                const dueDay = Math.min(parseInt(exp.day, 10) || 1, lastDay);
                const dueDate = new Date(mm.y, mm.m, dueDay);

                if (dueDate < start || dueDate >= end) continue;
                if (expEnd && dueDate > expEnd) continue;

                total += (exp.amount || 0);
            }
        }

        return total;
    }


    /**
     * Ritorna la lista "flat" delle spese variabili nel periodo corrente
     */
    getVariableExpensesInPeriodFlat() {
        const out = [];
        if (!this.data.variableExpenses || typeof this.data.variableExpenses !== 'object') return out;
        Object.entries(this.data.variableExpenses).forEach(([date, arr]) => {
            const d = this.normalizeIsoDate(date);
            if (!d || !this.isDateInPeriod(d)) return;
            if (Array.isArray(arr)) {
                arr.forEach(e => {
                    if (!e) return;
                    out.push({
                        id: e.id,
                        date: d,
                        name: (e.name || '').toString(),
                        category: e.category,
                        amount: Number(e.amount || 0)
                    });
                });
            }
        });
        return out;
    }

    normalizeMatchText(s) {
        return (s || '')
            .toString()
            .toLowerCase()
            .replace(/[\u0300-\u036f]/g, '') // diacritics
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Verifica se una spesa variabile corrisponde ad una scadenza fissa (per non conteggiarla 2 volte)
     * Matching "robusto ma prudente":
     * - importo simile (tolleranza 1 cent)
     * - data entro +/- 3 giorni
     * - se possibile, match su token del nome
     */
    matchFixedOccurrenceToVariable(occ, vars, consumedIds) {
        const occAmount = Number(occ.amount || 0);
        const occDate = new Date(this.normalizeIsoDate(occ.dueDate));
        if (isNaN(occDate.getTime())) return null;

        const nameNorm = this.normalizeMatchText(occ.name);
        const tokens = nameNorm.split(' ').filter(t => t.length >= 4);

        const candidates = vars.filter(v => {
            if (!v || consumedIds.has(v.id)) return false;
            if (Math.abs(Math.abs(Number(v.amount || 0)) - Math.abs(occAmount)) > 0.01) return false;

            const vd = new Date(this.normalizeIsoDate(v.date));
            if (isNaN(vd.getTime())) return false;
            const diffDays = Math.abs((vd - occDate) / (1000 * 60 * 60 * 24));
            if (diffDays > 3) return false;

            return true;
        });

        if (candidates.length === 0) return null;

        // Se c'è un solo candidato, accettiamo.
        if (candidates.length === 1) return candidates[0];

        // Se più candidati: richiediamo match token sul nome (almeno 1 token)
        if (tokens.length > 0) {
            const best = candidates.find(c => {
                const cn = this.normalizeMatchText(c.name);
                return tokens.some(t => cn.includes(t));
            });
            if (best) return best;
        }

        // Fallback: il più vicino come data
        candidates.sort((a, b) => {
            const ad = new Date(this.normalizeIsoDate(a.date));
            const bd = new Date(this.normalizeIsoDate(b.date));
            return Math.abs(ad - occDate) - Math.abs(bd - occDate);
        });
        return candidates[0];
    }

    /**
     * Calcola il totale delle spese fisse NON già presenti tra le variabili importate/inserite nel periodo.
     * Evita il doppio conteggio: una fissa pagata (presente nel file banca) resta tra le variabili,
     * e viene esclusa dal "forecast" delle fisse.
     */
    calculateTotalFixedExpensesUnpaid() {
        if (!this.data.fixedExpenses || !Array.isArray(this.data.fixedExpenses)) return 0;

        const start = new Date(this.normalizeIsoDate(this.data.periodStart));
        const end = new Date(this.normalizeIsoDate(this.data.periodEnd));
        if ([start, end].some(d => isNaN(d.getTime()))) return 0;

        // mesi nel periodo
        const months = [];
        const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
        const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
        while (cursor <= endMonth) {
            months.push({ y: cursor.getFullYear(), m: cursor.getMonth() });
            cursor.setMonth(cursor.getMonth() + 1);
        }

        const vars = this.getVariableExpensesInPeriodFlat();
        const consumed = new Set();

        let total = 0;

        for (const exp of this.data.fixedExpenses) {
            if (!exp || !exp.day) continue;

            const expEnd = exp.endDate ? new Date(this.normalizeIsoDate(exp.endDate)) : null;

            for (const mm of months) {
                const lastDay = new Date(mm.y, mm.m + 1, 0).getDate();
                const dueDay = Math.min(parseInt(exp.day, 10) || 1, lastDay);
                const dueDate = new Date(mm.y, mm.m, dueDay);

                if (dueDate < start || dueDate >= end) continue;
                if (expEnd && dueDate > expEnd) continue;

                const occ = { name: exp.name, amount: exp.amount, dueDate: dueDate.toISOString().slice(0,10) };
                const match = this.matchFixedOccurrenceToVariable(occ, vars, consumed);

                if (match) {
                    consumed.add(match.id);
                    // già pagata/registrata: NON la sommiamo nelle fisse
                } else {
                    total += (exp.amount || 0);
                }
            }
        }

        return total;
    }

/**
 * Ritorna le occorrenze delle spese fisse nel periodo corrente, marcate come
 * "Pagata" se trovate tra le spese variabili (estratto conto) con match prudente.
 * Regola periodo: start <= data < end
 *
 * @returns {Array<{name:string, amount:number, dueDate:string, paid:boolean, match?:{id:string,date:string,name:string,amount:number}}>}
 */
getFixedOccurrencesInPeriod() {
    if (!this.data.fixedExpenses || !Array.isArray(this.data.fixedExpenses)) return [];

    const start = new Date(this.normalizeIsoDate(this.data.periodStart));
    const end = new Date(this.normalizeIsoDate(this.data.periodEnd));
    if ([start, end].some(d => isNaN(d.getTime()))) return [];

    // mesi nel periodo
    const months = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    while (cursor <= endMonth) {
        months.push({ y: cursor.getFullYear(), m: cursor.getMonth() });
        cursor.setMonth(cursor.getMonth() + 1);
    }

    const vars = this.getVariableExpensesInPeriodFlat();
    const consumed = new Set();

    const occs = [];

    for (const exp of this.data.fixedExpenses) {
        if (!exp || !exp.day) continue;
        const expEnd = exp.endDate ? new Date(this.normalizeIsoDate(exp.endDate)) : null;

        for (const mm of months) {
            const lastDay = new Date(mm.y, mm.m + 1, 0).getDate();
            const dueDay = Math.min(parseInt(exp.day, 10) || 1, lastDay);
            const dueDateObj = new Date(mm.y, mm.m, dueDay);

            if (dueDateObj < start || dueDateObj >= end) continue;
            if (expEnd && dueDateObj > expEnd) continue;

            const dueDate = dueDateObj.toISOString().slice(0, 10);
            const occ = { name: exp.name, amount: exp.amount, dueDate };
            const match = this.matchFixedOccurrenceToVariable(occ, vars, consumed);

            if (match) consumed.add(match.id);

            occs.push({
                name: (exp.name || '').toString(),
                amount: Number(exp.amount || 0),
                dueDate,
                paid: !!match,
                match: match ? { id: match.id, date: match.date, name: match.name, amount: match.amount } : null
            });
        }
    }

    // sort per data, poi per nome
    occs.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || '') || (a.name || '').localeCompare(b.name || ''));
    return occs;
}

updateFixedStatusHome() {
    const listEl = document.getElementById('fixedStatusHomeList');
    if (!listEl) return;

    const esc = (s) => (s ?? '').toString()
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    const occs = this.getFixedOccurrencesInPeriod();
    if (!occs || occs.length === 0) {
        listEl.innerHTML = `<p class="chart-note">${this.t('noFixed')}</p>`;
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    listEl.innerHTML = occs.map(o => {
        const dueDate = new Date(this.normalizeIsoDate(o.dueDate));
        dueDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        let statusClass = '', badgeClass = '';
        if (diffDays < 0) { statusClass = 'expired'; badgeClass = 'expired'; }
        else if (diffDays <= 3) { statusClass = 'warning'; badgeClass = 'warning'; }
        else { statusClass = 'future'; badgeClass = 'future'; }

        // Formatta i giorni rimasti come nel tab fisse
        let daysText = '';
        if (diffDays < 0) {
            daysText = this.t('daysAgo').replace('{days}', Math.abs(diffDays));
        } else if (diffDays === 0) {
            daysText = this.t('dueToday');
        } else {
            if (this.fixedDateFormat === 'months') {
                daysText = this.formatDaysToYearsMonthsDays(diffDays);
            } else {
                daysText = this.t('inDays').replace('{days}', diffDays);
            }
        }

        // Icona pagato (✅)
        const paidIcon = o.paid ? '✅ ' : '';

        // Testo del match (se presente)
        const matchTxt = (o.paid && o.match) ? `${this.t('fixedFound')}: ${o.match.date} • ${(o.match.name || '')}` : '';

        return `
            <div class="expense-item fixed-expense-item ${statusClass}">
                <div class="expense-info">
                    <span class="expense-name">${paidIcon}${esc(o.name)}</span>
                    <span class="expense-category">
                        📅 ${this.t('fixedDue')}: ${o.dueDate}
                        <span class="days-badge ${badgeClass}">${daysText}</span>
                    </span>
                    ${matchTxt ? `<div class="fixed-match" title="${esc(matchTxt)}">${esc(matchTxt)}</div>` : ''}
                </div>
                <span class="expense-amount">${this.formatCurrency(o.amount)}</span>
                <!-- Nessun pulsante di azione in home -->
            </div>
        `;
    }).join('');

    // Gestione toggle (invariata)
    const toggleBtn = document.getElementById('toggleFixedHome');
    const sectionContent = document.querySelector('#fixedStatusHome .section-content');
    if (sectionContent && toggleBtn) {
        sectionContent.style.display = this.showFixedInHome ? 'block' : 'none';
        toggleBtn.classList.toggle('hidden', !this.showFixedInHome);
        toggleBtn.title = this.showFixedInHome ? this.t('hideOptions') : this.t('showOptions');
    }
}


    calculatePlannedSavings() {
        const totalIncome = this.calculateTotalIncome();
        const percent = this.data.savingsPercent || 0;
        return (totalIncome * percent) / 100;
    }

    calculateProjectedSavingsEnd() {
        const pot = this.data.savingsPot || 0;
        const planned = this.calculatePlannedSavings();
        const remaining = this.calculateRemaining(); // remaining budget after fixed + planned savings - variable spent
        // Se vai in rosso, non aumentiamo il pot con un valore negativo
        return pot + planned + Math.max(0, remaining);
    }

    calculateRemaining() {
        const totalIncome = this.calculateTotalIncome();
        const totalFixed = this.calculateTotalFixedExpensesUnpaid();
        const savingsAmount = this.calculatePlannedSavings();
        const budget = totalIncome - totalFixed - savingsAmount;
        return budget - this.calculateTotalVariableExpenses();
    }

    calculateDailyBudget() {
        const remaining = this.calculateRemaining();
        const daysLeft = this.getDaysLeft();
        return daysLeft > 0 ? remaining / daysLeft : 0;
    }

    getDaysLeft() {
        const diff = new Date(this.data.periodEnd) - new Date();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    calculateSavingsProgress() {
        if (!this.data.savingsGoal) return 0;
        const saved = (this.calculateTotalIncome() * (this.data.savingsPercent || 0)) / 100;
        return (saved / this.data.savingsGoal) * 100;
    }

    getNextPaymentDate(day) {
        const today = new Date();
        let next = new Date(today.getFullYear(), today.getMonth(), day);
        if (next < today) next = new Date(today.getFullYear(), today.getMonth() + 1, day);
        return next.toISOString().split('T')[0];
    }

    // ========== ENTRATE ==========
    addIncome() {
        // Verifica limite transazioni
        if (!this.checkFreeLimits('addIncome')) return;
        
        const desc = document.getElementById('incomeDesc').value.trim();
        const amount = parseFloat(document.getElementById('incomeAmount').value);
        const dateInput = document.getElementById('incomeDate').value;
        
        const date = dateInput || new Date().toISOString().split('T')[0];
        
        if (!desc || !amount) {
            alert(this.t('fillFields'));
            return;
        }
        
        if (!Array.isArray(this.data.incomes) || this.data.incomes.length === 0) {
            const startDate = new Date(date);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 30);
            
            this.data.periodStart = startDate.toISOString().split('T')[0];
            this.data.periodEnd = endDate.toISOString().split('T')[0];
            
            console.log('📅 Nuovo periodo impostato da', this.data.periodStart, 'a', this.data.periodEnd);
        }
        
        if (!Array.isArray(this.data.incomes)) this.data.incomes = [];
        
        this.data.incomes.push({
            desc,
            amount,
            date: date,
            id: Date.now()
        });
        
        this.saveData();
        this.updateUI();
        this.updateTransactionCount();
        alert(this.t('incomeAdded'));
        
        document.getElementById('incomeDesc').value = '';
        document.getElementById('incomeAmount').value = '';
        document.getElementById('incomeDate').value = '';
    }

    deleteIncome(id) {
        if (!Array.isArray(this.data.incomes)) return;
        this.data.incomes = this.data.incomes.filter(inc => inc.id !== id);
        this.saveData();
        this.updateUI();
        this.updateTransactionCount();
        alert(this.t('incomeDeleted'));
    }

    // ========== SPESE FISSE ==========
    addFixedExpense() {
        // Verifica limite spese fisse
        if (!this.checkFreeLimits('addFixedExpense')) return;
        
        const name = document.getElementById('fixedName').value.trim();
        const amount = this.parseMoney(document.getElementById('fixedAmount').value);
        const day = parseInt(document.getElementById('fixedDay').value);
        const endDate = document.getElementById('fixedEndDate').value;

        if (!name || !amount || !day || !endDate) {
            alert(this.t('fillFields'));
            return;
        }
        if (day < 1 || day > 31) {
            alert(this.t('invalidDay'));
            return;
        }

        if (!Array.isArray(this.data.fixedExpenses)) this.data.fixedExpenses = [];

        this.data.fixedExpenses.push({ name, amount, day, endDate, id: Date.now() });
        this.saveData();
        this.updateUI();
        this.updateTransactionCount();

        const status = new Date(endDate) >= new Date() ? '🟢' : '🔴';
        this.showToast(`💰 ${name} ${this.formatCurrency(amount)} – giorno ${day} (scad. ${endDate}) ${status}`, 'success');
        this.highlightField('fixedName');
        this.highlightField('fixedAmount');
        this.highlightField('fixedDay');
        this.highlightField('fixedEndDate');

        document.getElementById('fixedName').value = '';
        document.getElementById('fixedAmount').value = '';
        document.getElementById('fixedDay').value = '';
        document.getElementById('fixedEndDate').value = '';
    }

    deleteFixedExpense(id) {
        if (!Array.isArray(this.data.fixedExpenses)) return;
        this.data.fixedExpenses = this.data.fixedExpenses.filter(exp => exp.id !== id);
        this.saveData();
        this.updateUI();
        this.updateTransactionCount();
        alert(this.t('fixedDeleted'));
    }

    // ========== SPESE VARIABILI ==========
    addVariableExpense() {
        // Verifica limite transazioni
        if (!this.checkFreeLimits('addVariableExpense')) return;
        
        const date = this.normalizeIsoDate(document.getElementById('expenseDate').value);
        const name = document.getElementById('expenseName').value.trim();
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const category = document.getElementById('expenseCategory').value;

        if (!name || !amount) {
            alert(this.t('fillFields'));
            return;
        }

        if (!this.data.variableExpenses || typeof this.data.variableExpenses !== 'object') {
            this.data.variableExpenses = {};
        }
        if (!this.data.variableExpenses[date]) this.data.variableExpenses[date] = [];

        this.data.variableExpenses[date].push({ name, amount, category, id: Date.now() });
        
        // Apprendimento categorie solo in premium
        if (!this.license?.isFeatureLocked?.('categoryLearning')) {
            this.learnCategory(name, category);
        }

        this.saveData();
        this.updateUI();
        this.updateChart();
        this.updateTransactionCount();

        const categoryEmoji = this.getCategoryEmoji(category);
        this.showToast(`${categoryEmoji} ${name} ${this.formatCurrency(amount)} aggiunto!`, 'success');
        this.highlightField('expenseName');
        this.highlightField('expenseAmount');

        document.getElementById('expenseName').value = '';
        document.getElementById('expenseAmount').value = '';
        this.checkThreshold(date);
    }

    deleteVariableExpense(date, id) {
        if (!this.data.variableExpenses || !this.data.variableExpenses[date]) return;
        this.data.variableExpenses[date] = this.data.variableExpenses[date].filter(exp => exp.id !== id);
        if (this.data.variableExpenses[date].length === 0) delete this.data.variableExpenses[date];
        this.saveData();
        this.updateUI();
        this.updateChart();
        this.updateTransactionCount();
        alert(this.t('expenseDeleted'));
    }

    resetDay() {
        const date = document.getElementById('expenseDate').value;
        if (this.data.variableExpenses && this.data.variableExpenses[date]) {
            delete this.data.variableExpenses[date];
            this.saveData();
            this.updateUI();
            this.updateChart();
            this.updateTransactionCount();
            alert(this.t('dayReset'));
        }
    }

    resetVariablePeriod() {
        if (!this.data.variableExpenses || typeof this.data.variableExpenses !== 'object') {
            alert(this.t('noVariablePeriodToReset'));
            return;
        }

        if (!confirm(this.t('confirmResetVariablePeriod'))) return;

        const start = new Date(this.normalizeIsoDate(this.data.periodStart));
        const end = new Date(this.normalizeIsoDate(this.data.periodEnd));
        let removed = 0;

        for (const dateKey of Object.keys(this.data.variableExpenses)) {
            const d = new Date(this.normalizeIsoDate(dateKey));
            if (d >= start && d <= end) {
                delete this.data.variableExpenses[dateKey];
                removed++;
            }
        }

        if (removed === 0) {
            alert(this.t('noVariablePeriodToReset'));
            return;
        }

        this.saveData();
        this.updateUI();
        this.updateChart();
        this.updateTransactionCount();
        alert(this.t('variablePeriodReset'));
    }

    checkThreshold(date) {
        const today = new Date().toISOString().split('T')[0];
        if (date !== today) return;
        const totalSpent = this.calculateTotalVariableExpenses();
        if (totalSpent > this.data.threshold) {
            alert(this.t('thresholdExceeded') + this.formatCurrency(this.data.threshold));
        }
    }

    applySavings() {
        const percent = parseFloat(document.getElementById('savePercent').value) || 0;
        
        // Verifica limite percentuale
        if (!this.checkFreeLimits('savePercent', percent)) {
            // Ripristina al valore precedente
            document.getElementById('savePercent').value = this.data.savingsPercent;
            document.getElementById('percentageValue').textContent = this.data.savingsPercent + '%';
            return;
        }
        
        const goal = parseFloat(document.getElementById('saveGoal').value) || 0;
        const pot = parseFloat(document.getElementById('savingsPotInput')?.value) || 0;
        this.data.savingsPercent = percent;
        this.data.savingsGoal = goal;
        this.data.savingsPot = pot;
        this.saveData();
        this.updateUI();
        this.updateSavingsWidget();
        alert(this.t('savingsApplied'));
    }

    // ========== WIDGET RISPARMIO MIGLIORATO ==========
    updateSavingsWidget() {
        const percent = this.data.savingsPercent || 0;
        const goal = this.data.savingsGoal || 0;
        const currentSavings = this.data.savingsPot || 0;
        
        // Limita percentuale in free
        const maxPercent = this.license?.getMaxSavingsPercent?.() || 15;
        if (!this.license?.hasFullPremiumAccess?.() && percent > maxPercent) {
            this.data.savingsPercent = maxPercent;
        }
        
        // Aggiorna slider e valore percentuale
        const slider = document.getElementById('savePercent');
        const percentageValue = document.getElementById('percentageValue');
        if (slider && percentageValue) {
            slider.value = this.data.savingsPercent;
            percentageValue.textContent = this.data.savingsPercent + '%';
        }
        
        // Aggiorna input obiettivo e fondo iniziale
        const goalInput = document.getElementById('saveGoal');
        const potInput = document.getElementById('savingsPotInput');
        if (goalInput) goalInput.value = goal || '';
        if (potInput) potInput.value = currentSavings || '';
        
        // Calcola e aggiorna i messaggi
        this.updateSavingsMessages(this.data.savingsPercent, goal, currentSavings);
        
        // Aggiusta l'anello di progresso
        this.updateProgressRing(currentSavings, goal);
    }

    updateSavingsMessages(percent, goal, currentSavings) {
        if (!goal || goal <= 0) return;
        
        // Calcola entrate mensili medie
        const monthlyIncome = this.calculateAverageMonthlyIncome();
        if (monthlyIncome <= 0) return;
        
        const monthlySavings = (monthlyIncome * percent) / 100;
        const remaining = goal - currentSavings;
        const monthsToGoal = monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : Infinity;
        
        // Calcola data target
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + monthsToGoal);
        
        const currentLang = this.data.language || 'it';
        const locale = LOCALE_MAP[currentLang] || 'it-IT';

        const dateStr = targetDate.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Aggiorna messaggi
        const targetDateEl = document.getElementById('targetDate');
        const currentPlanEl = document.getElementById('currentPlanMessage');
        const suggestionEl = document.getElementById('suggestionMessage');
        
        if (targetDateEl) {
            targetDateEl.textContent = monthsToGoal === Infinity ? this.t('never') : dateStr;
        }
        
        if (currentPlanEl) {
            currentPlanEl.innerHTML = monthsToGoal === Infinity
                ? this.t('goalNotReachable')
                : this.t('currentPaceReachOn').replace('{date}', `<strong>${dateStr}</strong>`);
        }
        
        // Calcola suggerimento (solo premium)
        if (!this.license?.isFeatureLocked?.('aiAssistant')) {
            this.updateSavingsSuggestion(percent, monthsToGoal, monthlyIncome, remaining);
        } else {
            const suggestionCard = document.getElementById('suggestionCard');
            if (suggestionCard) suggestionCard.style.display = 'none';
        }
    }

    updateSavingsSuggestion(currentPercent, currentMonths, monthlyIncome, remaining) {
        const suggestionEl = document.getElementById('suggestionMessage');
        const suggestionCard = document.getElementById('suggestionCard');
        const applyBtn = document.getElementById('applySuggestionBtn');
        
        if (!suggestionEl || currentMonths === Infinity || currentMonths <= 1) {
            if (suggestionCard) suggestionCard.style.display = 'none';
            return;
        }
        
        // Trova la percentuale migliore per ridurre i mesi
        let bestPercent = currentPercent;
        let bestMonths = currentMonths;
        
        const maxPercent = this.license?.getMaxSavingsPercent?.() || 30;
        
        for (let p = currentPercent + 1; p <= Math.min(currentPercent + 10, maxPercent); p++) {
            const monthlySavings = (monthlyIncome * p) / 100;
            const months = monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : Infinity;
            
            if (months < bestMonths && months < currentMonths - 1) {
                bestMonths = months;
                bestPercent = p;
            }
        }
        
        if (bestPercent > currentPercent && bestMonths < currentMonths) {
            const monthsSaved = currentMonths - bestMonths;
            const key = monthsSaved === 1 ? 'increaseToPercentToArriveEarlier_one' : 'increaseToPercentToArriveEarlier';
            suggestionEl.innerHTML = this.t(key)
                .replace('{percent}', `<strong>${bestPercent}</strong>`)
                .replace('{months}', `<strong>${monthsSaved}</strong>`);
            
            if (applyBtn) {
                applyBtn.textContent = this.t('applySuggestion');
                applyBtn.onclick = () => this.applySavingsSuggestion(bestPercent);
                applyBtn.style.display = 'inline-block';
            }
            if (suggestionCard) suggestionCard.style.display = 'block';
        } else {
            if (suggestionCard) suggestionCard.style.display = 'none';
        }
    }

    applySavingsSuggestion(newPercent) {
        const slider = document.getElementById('savePercent');
        const percentageValue = document.getElementById('percentageValue');
        
        if (slider && percentageValue) {
            slider.value = newPercent;
            percentageValue.textContent = newPercent + '%';
            this.data.savingsPercent = newPercent;
            this.saveData();
            this.updateSavingsWidget();
            this.showToast(this.t('suggestionAppliedToast').replace('{percent}', newPercent), 'success');
        }
    }

    updateProgressRing(current, goal) {
        const progressCircle = document.getElementById('progressCircle');
        const progressPercentage = document.getElementById('progressPercentage');
        
        if (!progressCircle || !progressPercentage || goal <= 0) return;
        
        const percentage = Math.min((current / goal) * 100, 100);
        const offset = 157 - (157 * percentage) / 100;
        
        progressCircle.style.strokeDashoffset = offset;
        progressPercentage.textContent = Math.round(percentage) + '%';
    }

    calculateAverageMonthlyIncome() {
        if (!this.data.incomes || this.data.incomes.length === 0) return 0;
        
        const totalIncome = this.data.incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
        const months = this.calculateMonthsCovered();
        
        return months > 0 ? totalIncome / months : 0;
    }

    calculateMonthsCovered() {
        if (!this.data.incomes || this.data.incomes.length === 0) return 0;
        
        const dates = this.data.incomes.map(income => new Date(income.date));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        
        const months = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + 
                      (maxDate.getMonth() - minDate.getMonth()) + 1;
        
        return Math.max(months, 1);
    }

    setupSavingsWidgetListeners() {
        // Slider interattivo
        const slider = document.getElementById('savePercent');
        const percentageValue = document.getElementById('percentageValue');
        
        if (slider && percentageValue) {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                percentageValue.textContent = value + '%';
                
                // Verifica limite percentuale
                if (!this.checkFreeLimits('savePercent', parseFloat(value))) {
                    // Ripristina al valore precedente
                    slider.value = this.data.savingsPercent;
                    percentageValue.textContent = this.data.savingsPercent + '%';
                    return;
                }
                
                this.data.savingsPercent = parseFloat(value);
                this.updateSavingsWidget();
            });
        }
        
        // Input obiettivo e fondo iniziale
        const goalInput = document.getElementById('saveGoal');
        const potInput = document.getElementById('savingsPotInput');
        
        if (goalInput) {
            goalInput.addEventListener('input', (e) => {
                this.data.savingsGoal = parseFloat(e.target.value) || 0;
                this.updateSavingsWidget();
            });
        }
        
        if (potInput) {
            potInput.addEventListener('input', (e) => {
                this.data.savingsPot = parseFloat(e.target.value) || 0;
                this.updateSavingsWidget();
            });
        }
    }

    getLast7DaysData() {
        const today = new Date();
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            let daySpent = 0;
            if (this.data.variableExpenses && this.data.variableExpenses[dateStr] && Array.isArray(this.data.variableExpenses[dateStr])) {
                daySpent = this.data.variableExpenses[dateStr].reduce((sum, exp) => sum + (exp.amount || 0), 0);
            }
            data.push(daySpent);
        }
        return data;
    }

    getLast7DaysBudget() {
        const dailyBudget = this.calculateDailyBudget();
        const data = [];
        for (let i = 6; i >= 0; i--) data.push(dailyBudget);
        return data;
    }

    drawSparkline(canvasId, data, color = '#0ea5e9') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        if (data.length === 0 || data.every(v => v === 0)) return;
        const max = Math.max(...data, 1);
        const min = Math.min(...data, 0);
        const range = max - min || 1;
        const points = data.map((v, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((v - min) / range) * height;
            return { x, y };
        });
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.fillStyle = color;
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    setupEventListeners() {
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('addIncomeBtn').addEventListener('click', () => this.addIncome());
        document.getElementById('addFixedBtn').addEventListener('click', () => this.addFixedExpense());
        document.getElementById('addExpenseBtn').addEventListener('click', () => this.addVariableExpense());
        document.getElementById('resetDayBtn').addEventListener('click', () => this.resetDay());
        const resetPeriodBtn = document.getElementById('resetPeriodVariableBtn');
        if (resetPeriodBtn) resetPeriodBtn.addEventListener('click', () => this.resetVariablePeriod());
        document.getElementById('expenseDate').valueAsDate = new Date();
        document.getElementById('expenseDate').addEventListener('change', () => this.updateVariableExpensesList());

        const showAllToggle = document.getElementById('showAllExpensesToggle');
        if (showAllToggle) {
            showAllToggle.checked = !!this.showAllExpenses;
            showAllToggle.addEventListener('change', (e) => {
                this.showAllExpenses = !!e.target.checked;
                localStorage.setItem('budgetwise-show-all-expenses', this.showAllExpenses ? 'true' : 'false');
                this.updateVariableExpensesList();
            });
        }
        document.getElementById('applySaveBtn').addEventListener('click', () => this.applySavings());
        
        // Setup widget risparmio migliorato
        this.setupSavingsWidgetListeners();
        this.updateSavingsWidget();

        const loadDemoBtn = document.getElementById('loadDemoBtn');
        if (loadDemoBtn) loadDemoBtn.addEventListener('click', () => this.loadDemoData());
        document.getElementById('backupBtn').addEventListener('click', () => this.backupData());
        document.getElementById('restoreBtn').addEventListener('click', () => document.getElementById('restoreFile').click());
        document.getElementById('restoreFile').addEventListener('change', (e) => this.restoreData(e));
        document.getElementById('resetAllBtn').addEventListener('click', () => this.resetAll());
        document.getElementById('exportCalendarBtn').addEventListener('click', () => this.exportToCalendar());
        document.getElementById('sendChatBtn').addEventListener('click', () => this.handleChatInput());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleChatInput();
        });
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.getElementById('chatInput').value = chip.dataset.question;
                this.handleChatInput();
            });
        });
        document.getElementById('thresholdInput').addEventListener('change', (e) => {
            this.data.threshold = parseFloat(e.target.value) || 50;
            this.saveData();
        });
        document.getElementById('savePercent').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 0;
            if (this.checkFreeLimits('savePercent', value)) {
                this.data.savingsPercent = value;
                this.saveData();
            } else {
                e.target.value = this.data.savingsPercent;
            }
        });
        document.getElementById('saveGoal').addEventListener('input', (e) => {
            this.data.savingsGoal = parseFloat(e.target.value) || 0;
            this.saveData();
        });
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.data.language = e.target.value;
            this.saveData();
            this.applyLanguage();
            this.updateUI();
            this.updateChart();
        });
        const closeDetailBtn = document.getElementById('closeDetailBtn');
        if (closeDetailBtn) {
            closeDetailBtn.addEventListener('click', () => {
                document.getElementById('categoryDetail').style.display = 'none';
            });
        }
        
        const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
        if (manageCategoriesBtn) {
            manageCategoriesBtn.addEventListener('click', () => {
                if (this.checkFreeLimits('customCategory')) {
                    this.showCategoryManager();
                }
            });
        }
        const saveCategoryBtn = document.getElementById('saveCategoryBtn');
        if (saveCategoryBtn) {
            saveCategoryBtn.addEventListener('click', () => this.saveCategory());
        }
        const closeCategoryManager = document.getElementById('closeCategoryManager');
        if (closeCategoryManager) {
            closeCategoryManager.addEventListener('click', () => this.hideCategoryManager());
            
        }     
       // ===== TOGGLE FISSE IN HOME =====
const toggleFixedBtn = document.getElementById('toggleFixedHome');
if (toggleFixedBtn) {
    toggleFixedBtn.addEventListener('click', () => {
        this.showFixedInHome = !this.showFixedInHome;
        localStorage.setItem('budgetwise-show-fixed-home', this.showFixedInHome);
        this.updateUI();
        
        this.showToast(
            this.showFixedInHome ? '📌 Sezione fisse visibile' : '📌 Sezione fisse nascosta',
            'info'
        );
    });
}
        // ===== TOGGLE FISSE NEL TAB =====
const toggleFixedListBtn = document.getElementById('toggleFixedList');
if (toggleFixedListBtn) {
    toggleFixedListBtn.addEventListener('click', () => {
        this.showFixedList = !this.showFixedList;
        localStorage.setItem('budgetwise-show-fixed-list', this.showFixedList);
        this.updateFixedExpensesList();
        
        this.showToast(
            this.showFixedList ? '📌 Lista fisse visibile' : '📌 Lista fisse nascosta',
            'info'
        );
    });
}
        // ===== TOGGLE FORMATO DATE SPESE FISSE =====
        const daysRadio = document.getElementById('dateFormatDays');
        const monthsRadio = document.getElementById('dateFormatMonths');
        
        if (daysRadio && monthsRadio) {
            // Imposta lo stato iniziale
            daysRadio.checked = this.fixedDateFormat === 'days';
            monthsRadio.checked = this.fixedDateFormat === 'months';
            
            daysRadio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.fixedDateFormat = 'days';
                    localStorage.setItem('budgetwise-fixed-date-format', 'days');
                    this.updateFixedExpensesList();
                    this.updateFixedStatusHome();
                }
            });
            
            monthsRadio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (!this.checkFreeLimits('fixedDateFormat', 'months')) {
                        daysRadio.checked = true;
                        return;
                    }
                    this.fixedDateFormat = 'months';
                    localStorage.setItem('budgetwise-fixed-date-format', 'months');
                    this.updateFixedExpensesList();
                    this.updateFixedStatusHome();
                }
            });
        }
        
        this.setupAiActions();
                // ===== NUOVI LISTENER PER LA RICERCA =====
        const searchInput = document.getElementById('searchExpenses');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.updateVariableExpensesList();
            });
        }

        const searchCategory = document.getElementById('searchCategory');
        if (searchCategory) {
            searchCategory.addEventListener('change', (e) => {
                this.searchCategoryFilter = e.target.value;
                this.updateVariableExpensesList();
            });
        }

        const resetSearchBtn = document.getElementById('resetSearchBtn');
        if (resetSearchBtn) {
            resetSearchBtn.addEventListener('click', () => {
                this.resetSearch();
            });
        }
    }

    updateUI() {
        // Allinea automaticamente il periodo all'ultimo stipendio (se presente)
        this.ensureSalaryPeriod();
        document.getElementById('dailyBudget').textContent = this.formatCurrency(this.calculateDailyBudget());
        document.getElementById('remaining').textContent = this.formatCurrency(this.calculateRemaining());
        document.getElementById('daysLeft').textContent = this.getDaysLeft();

        // Piano risparmi (fondo separato dal budget)
        const potEl = document.getElementById('savingsPot');
        const projEl = document.getElementById('savingsProjected');
        if (potEl) potEl.textContent = this.formatCurrency(this.data.savingsPot || 0);
                if (projEl) projEl.textContent = `${this.t('endPeriod')}: ${this.formatCurrency(this.calculateProjectedSavingsEnd())}`;


        const remainingStatus = document.getElementById('remainingStatus');
        const remainingTrend = document.getElementById('remainingTrend');
        const remaining = this.calculateRemaining();
        if (remainingStatus) {
            remainingStatus.textContent = remaining >= 0 ? '✅' : '⚠️';
            remainingStatus.title = remaining >= 0 ? this.t('positiveBalance') : this.t('negativeBalance');
        }
        if (remainingTrend) {
            remainingTrend.textContent = this.t('vsYesterday0');
        }

        this.updatePeriodInfo();
        this.updateIncomeList();
        this.updateFixedExpensesList();
        this.updateVariableExpensesList();

        document.getElementById('savePercent').value = this.data.savingsPercent || 0;
        document.getElementById('saveGoal').value = this.data.savingsGoal || 0;
        const potInput = document.getElementById('savingsPotInput');
        if (potInput) potInput.value = this.data.savingsPot || 0;
        document.getElementById('thresholdInput').value = this.data.threshold || 50;

        // Usa il nuovo widget risparmio migliorato
        this.updateSavingsWidget();
        
        // Aggiorna contatore transazioni
        this.updateTransactionCount();

        document.getElementById('guideMessage').style.display = (!this.data.incomes || this.data.incomes.length === 0) ? 'block' : 'none';

        const last7Days = this.getLast7DaysData();
        const last7DaysBudget = this.getLast7DaysBudget();
        this.drawSparkline('budgetSparkline', last7DaysBudget, '#0ea5e9');
        const remainingColor = this.calculateRemaining() >= 0 ? '#2dc653' : '#ef233c';
        this.drawSparkline('remainingSparkline', last7Days, remainingColor);

        this.generateAiSuggestion();
       // ===== TOGGLE FISSE IN HOME =====
    const fixedSection = document.getElementById('fixedStatusHome');
    const toggleBtn = document.getElementById('toggleFixedHome');

    if (fixedSection && toggleBtn) {
        const sectionContent = fixedSection.querySelector('.section-content');
        if (sectionContent) {
            sectionContent.style.display = this.showFixedInHome ? 'block' : 'none';
        }
        
        toggleBtn.classList.toggle('hidden', !this.showFixedInHome);
        toggleBtn.title = this.showFixedInHome ? 'Nascondi sezione' : 'Mostra sezione';
    }
}  


    // ========== FUNZIONI DI VISUALIZZAZIONE LISTE ==========
    
    updateIncomeList() {
        const container = document.getElementById('incomeList');
        if (!container) return;

        if (!this.data.incomes || this.data.incomes.length === 0) {
            container.innerHTML = `<p class="chart-note">${this.t('noIncome')}</p>`;
        } else {
            container.innerHTML = this.data.incomes.map(inc => `
                <div class="expense-item" data-income-id="${inc.id}">
                    <div class="expense-info">
                        <span class="expense-name">${inc.desc || '?'}</span>
                        <span class="expense-category">${inc.date || ''}</span>
                    </div>
                    <span class="expense-amount" style="color: var(--success)">+${this.formatCurrency(inc.amount || 0)}</span>
                    <div class="expense-actions">
                        <button class="delete-income-btn" data-id="${inc.id}">🗑️</button>
                    </div>
                </div>
            `).join('');
        }

        document.querySelectorAll('.delete-income-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.currentTarget.dataset.id);
                this.deleteIncome(id);
            });
        });

        const totalDisplay = document.getElementById('totalIncomeDisplay');
        if (totalDisplay) {
            totalDisplay.textContent = this.formatCurrency(this.calculateTotalIncome());
        }
    }

    updateFixedExpensesList() {
        const container = document.getElementById('fixedExpensesList');
        if (!container) return;
        
        if (!this.data.fixedExpenses || this.data.fixedExpenses.length === 0) {
            container.innerHTML = `<p class="chart-note">${this.t('noFixed')}</p>`;
            return;
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        container.innerHTML = this.data.fixedExpenses.map(exp => {
            const endDate = new Date(exp.endDate);
            endDate.setHours(0, 0, 0, 0);
            const diffTime = endDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let statusClass = '', badgeClass = '';
            if (diffDays < 0) { statusClass = 'expired'; badgeClass = 'expired'; }
            else if (diffDays <= 3) { statusClass = 'warning'; badgeClass = 'warning'; }
            else { statusClass = 'future'; badgeClass = 'future'; }
            
                       // Formatta il testo dei giorni in base alla preferenza
let daysText = '';
if (diffDays < 0) {
    daysText = this.t('daysAgo').replace('{days}', Math.abs(diffDays));
} else if (diffDays === 0) {
    daysText = this.t('dueToday');
} else {
    if (this.fixedDateFormat === 'months') {
        daysText = this.formatDaysToYearsMonthsDays(diffDays);
    } else {
        daysText = this.t('inDays').replace('{days}', diffDays);
    }
}
            
            return `
                <div class="expense-item fixed-expense-item ${statusClass}">
                    <div class="expense-info">
                        <span class="expense-name">${exp.name || '?'}</span>
                        <span class="expense-category">
                            📅 ${this.t('dayLabel')} ${exp.day || '?'} · ${this.t('endDateLabel')}: ${exp.endDate || '?'}
                            <span class="days-badge ${badgeClass}">${daysText}</span>
                        </span>
                    </div>
                    <span class="expense-amount">${this.formatCurrency(exp.amount || 0)}</span>
                    <div class="expense-actions">
                        <button class="delete-fixed-btn" data-id="${exp.id}">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.delete-fixed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.currentTarget.dataset.id);
                this.deleteFixedExpense(id);
            });
        });
        // ===== TOGGLE FISSE NEL TAB =====   <--- DENTRO la funzione, PRIMA della chiusura
    const fixedSection = document.getElementById('fixedSectionContent');
    const toggleBtn = document.getElementById('toggleFixedList');
    
    if (fixedSection && toggleBtn) {
        fixedSection.style.display = this.showFixedList ? 'block' : 'none';
        toggleBtn.classList.toggle('hidden', !this.showFixedList);
        toggleBtn.title = this.showFixedList ? 'Nascondi lista' : 'Mostra lista';
    }
}
    
        // ========== FORMATTA GIORNI IN ANNI, MESI E GIORNI ==========
formatDaysToYearsMonthsDays(days) {
    // This formatter is used when fixedDateFormat === 'months'
    // Localized output: "1 year, 3 months and 6 days" / "1 año y 3 meses" / etc.
    if (days < 0) return this.t('daysAgo').replace('{days}', Math.abs(days));
    if (days === 0) return this.t('today');

    const years = Math.floor(days / 365);
    let remainingDays = days % 365;

    const months = Math.floor(remainingDays / 30);
    remainingDays = remainingDays % 30;

    const daysPart = remainingDays;

    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? this.t('yearSing') : this.t('yearPlur')}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? this.t('monthSing') : this.t('monthPlur')}`);
    if (daysPart > 0) parts.push(`${daysPart} ${daysPart === 1 ? this.t('daySing') : this.t('dayPlur')}`);

    if (parts.length === 0) return this.t('today');
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts.join(` ${this.t('andConj')} `);
    return parts.slice(0, -1).join(', ') + ` ${this.t('andConj')} ` + parts.slice(-1);
}
    updateVariableExpensesList() {
    const container = document.getElementById('variableExpensesList');
    if (!container) return;

    const selectedDateRaw = document.getElementById('expenseDate')?.value || '';
    const selectedDate = this.normalizeIsoDate(selectedDateRaw);

    let view = [];
    if (this.showAllExpenses) {
        const entries = (this.data.variableExpenses && typeof this.data.variableExpenses === 'object')
            ? Object.entries(this.data.variableExpenses)
            : [];

        for (const [d, dayExpenses] of entries) {
            if (!Array.isArray(dayExpenses)) continue;
            for (const exp of dayExpenses) view.push({ date: this.normalizeIsoDate(d), exp });
        }

        view.sort((a, b) => {
            const da = new Date(a.date);
            const db = new Date(b.date);
            if (db - da !== 0) return db - da;
            return (b.exp?.id || 0) - (a.exp?.id || 0);
        });
    } else {
        const expenses = (this.data.variableExpenses && this.data.variableExpenses[selectedDate]) || [];
        if (Array.isArray(expenses)) view = expenses.map(exp => ({ date: selectedDate, exp }));
    }

    // APPLICA FILTRO DI RICERCA
    const totalCount = view.length;
    let filteredView = view;
    
    if (this.searchTerm || this.searchCategoryFilter !== 'all') {
        filteredView = this.filterExpenses(view);
    }
    
    // Aggiorna contatore
    this.updateSearchResultsCount(filteredView.length, totalCount);

    if (!filteredView || filteredView.length === 0) {
        if (totalCount > 0 && filteredView.length === 0) {
            container.innerHTML = `<p class="chart-note">🔍 Nessuna spesa corrisponde ai filtri selezionati</p>`;
        } else {
            container.innerHTML = `<p class="chart-note">${this.t('noVariable')}</p>`;
        }
        return;
    }

    container.innerHTML = filteredView.map(({ date, exp }) => {
        const cat = exp.category || 'Altro';
        const catDisplay = this.getAllCategories().includes(cat) ? cat : 'Altro';
        const dateBadge = this.showAllExpenses ? `<span class="expense-category">📅 ${date}</span>` : '';
        return `
            <div class="expense-item">
                <div class="expense-info">
                    <span class="expense-name">${exp.name || '?'}</span>
                    <span class="expense-category">${this.getCategoryDisplay(catDisplay)}</span>
                    ${dateBadge}
                </div>
                <span class="expense-amount">${this.formatCurrency(exp.amount || 0)}</span>
                <div class="expense-actions">
                    <button class="edit-variable-btn" title="${this.t('edit')}" data-id="${exp.id}" data-date="${date}">✏️</button>
                    <button class="delete-variable-btn" data-id="${exp.id}" data-date="${date}">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    // Riapplica gli event listener
    document.querySelectorAll('.edit-variable-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(e.currentTarget.dataset.id);
            const date = e.currentTarget.dataset.date;
            this.editVariableExpense(date, id);
        });
    });

    document.querySelectorAll('.delete-variable-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(e.currentTarget.dataset.id);
            const date = e.currentTarget.dataset.date;
            this.deleteVariableExpense(date, id);
        });
    });
}
    // ========== FUNZIONI DI RICERCA ==========

    // Filtra le spese in base ai criteri di ricerca
    filterExpenses(expenses) {
        if (!expenses || expenses.length === 0) return [];
        
        const term = this.searchTerm.toLowerCase().trim();
        const categoryFilter = this.searchCategoryFilter;
        
        return expenses.filter(item => {
            const exp = item.exp || item; // Supporta sia formato {date, exp} che {name, category, amount}
            const name = (exp.name || '').toLowerCase();
            const category = (exp.category || '').toLowerCase();
            const amount = exp.amount || 0;
            
            // Filtro per categoria
            if (categoryFilter !== 'all' && category !== categoryFilter.toLowerCase()) {
                return false;
            }
            
            // Filtro per termine di ricerca
            if (term === '') return true;
            
            // Cerca in descrizione
            if (name.includes(term)) return true;
            
            // Cerca in categoria
            if (category.includes(term)) return true;
            
            // Cerca in importo (conversione a stringa)
            if (amount.toString().includes(term)) return true;
            
            return false;
        });
    }

    // Aggiorna il contatore dei risultati
    updateSearchResultsCount(filteredCount, totalCount) {
    const countEl = document.getElementById('searchResultsCount');
    if (!countEl) return;
    
    if (this.searchTerm || this.searchCategoryFilter !== 'all') {
        const lang = this.data.language || 'it';
        if (lang === 'it') {
            countEl.textContent = `📊 Mostrando ${filteredCount} di ${totalCount} spese`;
        } else if (lang === 'en') {
            countEl.textContent = `📊 Showing ${filteredCount} of ${totalCount} expenses`;
        } else if (lang === 'es') {
            countEl.textContent = `📊 Mostrando ${filteredCount} de ${totalCount} gastos`;
        } else if (lang === 'fr') {
            countEl.textContent = `📊 Affichage ${filteredCount} sur ${totalCount} dépenses`;
        }
    } else {
        countEl.textContent = '';
    }
}
    // Popula il select delle categorie
    populateCategoryFilter() {
        const select = document.getElementById('searchCategory');
        if (!select) return;
        
        const categories = this.getAllCategories();
        let options = `<option value="all">${this.t('allCategories')}</option>`;
        
        categories.forEach(cat => {
            options += `<option value="${cat}">${this.getCategoryDisplay(cat)}</option>`;
        });
        
        select.innerHTML = options;
        select.value = this.searchCategoryFilter;
    }

    // Resetta tutti i filtri
    resetSearch() {
        this.searchTerm = '';
        this.searchCategoryFilter = 'all';
        
        const searchInput = document.getElementById('searchExpenses');
        const categorySelect = document.getElementById('searchCategory');
        
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = 'all';
        
        this.updateVariableExpensesList();
    }
    editVariableExpense(date, id) {
        date = this.normalizeIsoDate(date);
        if (!this.data.variableExpenses || !this.data.variableExpenses[date]) return;
        const idx = this.data.variableExpenses[date].findIndex(e => e.id === id);
        if (idx === -1) return;

        const exp = this.data.variableExpenses[date][idx];

        const newName = prompt(this.data.language === 'it' ? 'Descrizione' : 'Description', exp.name || '');
        if (newName === null) return;

        const newAmountStr = prompt(this.data.language === 'it' ? 'Importo (€)' : 'Amount (€)', String(exp.amount ?? ''));
        if (newAmountStr === null) return;
        const newAmount = parseFloat(String(newAmountStr).replace(',', '.'));
        if (!isFinite(newAmount) || newAmount <= 0) {
            alert(this.t('fillFields'));
            return;
        }

        const cats = this.getAllCategories();
        const catHint = cats.join(', ');
        const newCategory = prompt(
            this.data.language === 'it' ? `Categoria (es. ${catHint})` : `Category (e.g. ${catHint})`,
            exp.category || 'Altro'
        );
        if (newCategory === null) return;
        const trimmedCat = String(newCategory).trim() || 'Altro';

        if (!this.getAllCategories().includes(trimmedCat)) {
            // Categorie personalizzate solo in premium
            if (!this.checkFreeLimits('customCategory')) {
                alert('Le categorie personalizzate sono disponibili in Premium!');
                return;
            }
            this.customCategories.push(trimmedCat);
            this.saveCustomCategories();
            this.updateAllCategorySelects();
        }

        exp.name = String(newName).trim() || exp.name;
        exp.amount = newAmount;
        exp.category = trimmedCat;

        this.data.variableExpenses[date][idx] = exp;
        this.saveData();
        this.updateUI();
        this.updateChart();
        this.showToast(this.data.language === 'it' ? '✅ Spesa aggiornata' : '✅ Expense updated', 'success');
    }

    updateChart() {
        const categories = {};
        const categoryExpenses = {};

        if (this.data.variableExpenses && typeof this.data.variableExpenses === 'object') {
            Object.entries(this.data.variableExpenses).forEach(([date, dayExpenses]) => {
                if (!Array.isArray(dayExpenses)) return;
                dayExpenses.forEach(expense => {
                    const cat = expense.category || 'Altro';
                    const amt = Number(expense.amount || 0) || 0;
                    categories[cat] = (categories[cat] || 0) + amt;

                    if (!categoryExpenses[cat]) categoryExpenses[cat] = [];
                    categoryExpenses[cat].push({
                        name: expense.name || '?',
                        amount: amt,
                        date: date
                    });
                });
            });
        }

        const chartNote = document.getElementById('chartNote');
        const categoryDetail = document.getElementById('categoryDetail');

        const chartContainer = document.querySelector('.chart-container');
        const legendEl = document.getElementById('chartLegend');

        if (Object.keys(categories).length === 0) {
            if (chartNote) chartNote.style.display = 'block';
            if (categoryDetail) categoryDetail.style.display = 'none';
            if (chartContainer) chartContainer.style.display = 'none';
            if (legendEl) { legendEl.innerHTML = ''; legendEl.style.display = 'none'; }
            if (this.chart) this.chart.destroy();
            this.chart = null;
            this.categoryExpenses = {};
            return;
        }

        if (chartNote) chartNote.style.display = 'none';
        if (chartContainer) chartContainer.style.display = '';
        if (legendEl) legendEl.style.display = '';

        if (this.chart) this.chart.destroy();
        this.chart = null;

        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const labels = Object.keys(categories);
        const values = Object.values(categories);
        const totalExpenses = values.reduce((a, b) => a + b, 0);
        const colors = ['#0ea5e9', '#38bdf8', '#22c55e', '#f59e0b', '#ef4444', '#0284c7', '#8b5cf6', '#ec4899'];

        const bw = this;
        const centerTextPlugin = {
            id: 'centerText',
            afterDraw: (chart) => {
                const { ctx, chartArea } = chart;
                if (!chartArea || chart.config.type !== 'doughnut') return;
                const centerX = (chartArea.left + chartArea.right) / 2;
                const centerY = (chartArea.top + chartArea.bottom) / 2;
                const textColor = (getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') || '#94a3b8').trim();
                const textColorBold = (getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#f8fafc').trim();
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '13px Inter, system-ui, sans-serif';
                ctx.fillStyle = textColor;
                ctx.fillText(bw.t('chartTotalLabel'), centerX, centerY - 14);
                ctx.font = 'bold 22px Inter, system-ui, sans-serif';
                ctx.fillStyle = textColorBold;
                ctx.fillText(bw.formatCurrency(totalExpenses), centerX, centerY + 6);
                ctx.restore();
            }
        };

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                    borderColor: 'transparent',
                    hoverOffset: 4
                }]
            },
            options: {
                cutout: '70%',
                responsive: true,
                maintainAspectRatio: true,
                layout: { padding: 8 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                                const catName = labels[context.dataIndex];
                                const count = (categoryExpenses[catName] || []).length;
                                const nTrans = bw.data.language === 'it' ? 'transazioni' : 'transactions';
                                return [
                                    `${label}: ${bw.formatCurrency(value)}`,
                                    `${percentage}%`,
                                    `${count} ${nTrans}`
                                ];
                            }
                        }
                    }
                },
                onClick: (event, items) => {
                    if (items && items.length > 0) {
                        const index = items[0].index;
                        const categoryName = this.chart.data.labels[index];
                        this.showCategoryDetail(categoryName, categoryExpenses[categoryName] || []);
                    }
                }
            },
            plugins: [centerTextPlugin]
        });

        if (legendEl) {
            legendEl.innerHTML = labels.map((label, i) => {
    const amt = values[i] || 0;
    const pct = totalExpenses > 0 ? ((amt / totalExpenses) * 100).toFixed(0) : '0';
    const col = colors[i % colors.length];
    // Tronca il nome a 12 caratteri massimo
    const shortLabel = label.length > 12 ? label.substring(0, 12) + '…' : label;

    return `<div class="chart-legend-item" data-index="${i}" role="button" tabindex="0">
        <span class="chart-legend-dot" style="background:${col};"></span>
        <span class="chart-legend-label" title="${label}">${shortLabel}</span>
        <span class="chart-legend-value">${this.formatCurrency(amt)} (${pct}%)</span>
    </div>`;
}).join('');
            
            legendEl.querySelectorAll('.chart-legend-item').forEach((el, i) => {
                el.addEventListener('click', () => {
                    const catName = labels[i];
                    this.showCategoryDetail(catName, categoryExpenses[catName] || []);
                });
            });
        }

        this.categoryExpenses = categoryExpenses;
    }

    showCategoryDetail(categoryName, expenses) {
        const detailContainer = document.getElementById('categoryDetail');
        const titleEl = document.getElementById('detailCategoryTitle');
        const totalEl = document.getElementById('detailTotal');
        const comparisonEl = document.getElementById('detailComparison');
        const listEl = document.getElementById('detailExpensesList');
        if (!detailContainer) return;
        const total = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        const lastMonthTotal = total * 0.85;
        const difference = total - lastMonthTotal;
        const percentChange = ((difference / lastMonthTotal) * 100).toFixed(1);
        const trend = difference >= 0 ? '📈' : '📉';
        const comparisonText = this.data.language === 'it'
            ? `${trend} ${Math.abs(percentChange)}% ${difference >= 0 ? 'in più' : 'in meno'} rispetto al mese scorso`
            : `${trend} ${Math.abs(percentChange)}% ${difference >= 0 ? 'more' : 'less'} than last month`;
        titleEl.textContent = categoryName;
        totalEl.textContent = this.t('detailTotal', { total: this.formatCurrency(total) });
        comparisonEl.textContent = comparisonText;
        if (expenses.length === 0) {
            listEl.innerHTML = `<p class="chart-note">${this.t('noExpensesShort')}</p>`;
        } else {
            listEl.innerHTML = expenses.map(exp => `
                <div class="detail-expense-item">
                    <span class="expense-name">${exp.name || '?'}</span>
                    <span class="expense-amount">${this.formatCurrency(exp.amount || 0)}</span>
                </div>
            `).join('');
        }
        detailContainer.style.display = 'block';
    }

    formatCurrency(amount) {
        const value = Number(amount || 0);
        const lang = this.data.language || 'it';
        const localeMap = { it: 'it-IT', en: 'en-GB', es: 'es-ES', fr: 'fr-FR' };
        const locale = localeMap[lang] || 'it-IT';
        try {
            return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(value);
        } catch {
            return `${value.toFixed(2)} €`;
        }
    }

    highlightField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        field.style.transition = 'background-color 0.3s ease';
        field.style.backgroundColor = '#d4edda';
        field.style.borderColor = '#28a745';
        setTimeout(() => {
            field.style.backgroundColor = '';
            field.style.borderColor = '';
        }, 800);
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.background = type === 'success' ? '#2dc653' : '#ef233c';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    handleChatInput() {
        const input = document.getElementById('chatInput');
        const question = input.value.trim();
        if (!question) return;
        this.addChatMessage('user', question);
        input.value = '';
        setTimeout(() => {
            const answer = this.generateAnswer(question);
            this.addChatMessage('bot', answer);
        }, 500);
    }

    addChatMessage(sender, text) {
        const container = document.getElementById('chatMessages');
        const div = document.createElement('div');
        div.className = `chat-message ${sender}`;
        div.innerHTML = `<span class="message-sender">${sender === 'bot' ? '🤖 ' + this.t('assistantName') : '👤 ' + (this.data.language === 'it' ? 'Tu' : 'You')}:</span> <span class="message-text">${text}</span>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    generateAnswer(question) {
        const q = question.toLowerCase();
        const remaining = this.calculateRemaining();
        const dailyBudget = this.calculateDailyBudget();
        const totalSpent = this.calculateTotalVariableExpenses();
        const totalFixed = this.calculateTotalFixedExpensesUnpaid();
        const daysLeft = this.getDaysLeft();
        if (q.includes('risparmi') || q.includes('risparmiare') || q.includes('save')) {
            const match = q.match(/(\d+)/);
            if (match) {
                const target = parseInt(match[0]);
                const daily = dailyBudget;
                if (daily * daysLeft >= target) {
                    return `✅ ${this.data.language === 'it' ? 'Sì! Puoi risparmiare' : 'Yes! You can save'} ${target}€. ${this.data.language === 'it' ? 'Ti basterebbe risparmiare' : 'You would need to save'} ${(target/daysLeft).toFixed(2)}€ ${this.data.language === 'it' ? 'al giorno' : 'per day'}.`;
                } else {
                    return `⚠️ ${this.data.language === 'it' ? 'Con l\'attuale budget' : 'With your current budget'} ${this.formatCurrency(daily)} ${this.data.language === 'it' ? 'al giorno' : 'per day'}, ${this.data.language === 'it' ? 'in' : 'in'} ${daysLeft} ${this.data.language === 'it' ? 'giorni avrai' : 'days you\'ll have'} ${this.formatCurrency(daily * daysLeft)}.`;
                }
            }
        }
        if (q.includes('categoria') || q.includes('category') || q.includes('spendo di più') || q.includes('spend most')) {
            const categories = {};
            if (this.data.variableExpenses && typeof this.data.variableExpenses === 'object') {
                Object.values(this.data.variableExpenses).forEach(day => {
                    if (Array.isArray(day)) {
                        day.forEach(exp => {
                            const catName = exp.category || 'Altro';
                            categories[catName] = (categories[catName] || 0) + (exp.amount || 0);
                        });
                    }
                });
            }
            if (Object.keys(categories).length === 0) return this.t('noExpenses');
            const top = Object.entries(categories).sort((a,b) => b[1] - a[1])[0];
            return `📊 ${this.data.language === 'it' ? 'La categoria in cui spendi di più è' : 'The category where you spend the most is'} "${top[0]}" ${this.data.language === 'it' ? 'con' : 'with'} ${this.formatCurrency(top[1])}.`;
        }
        if (q.includes('obiettivo') || q.includes('goal')) {
            const goal = this.data.savingsGoal;
            const percent = this.data.savingsPercent;
            const income = this.calculateTotalIncome();
            if (!goal || !percent) return this.t('noGoal');
            const savedPerMonth = (income * percent) / 100;
            const monthsNeeded = Math.ceil(goal / savedPerMonth);
            return `🎯 ${this.data.language === 'it' ? 'Raggiungerai l\'obiettivo in' : 'You\'ll reach your goal in'} ${monthsNeeded} ${this.data.language === 'it' ? 'mesi' : 'months'}.`;
        }
        return this.getContextualAdvice();
    }

    getContextualAdvice() {
        const remaining = this.calculateRemaining();
        const dailyBudget = this.calculateDailyBudget();
        if (remaining < 0) {
            return this.t("adviceRed");
        } else if (remaining < dailyBudget * 7) {
            return this.t("adviceLowRemaining", { remaining: this.formatCurrency(remaining) });
        } else {
            return this.t("adviceGood", { remaining: this.formatCurrency(remaining) });
        }
    }

    toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? '' : 'dark');
        document.getElementById('themeToggle').textContent = isDark ? '🌙' : '☀️';
        localStorage.setItem('budgetwise-theme', isDark ? 'light' : 'dark');
        const nowTheme = isDark ? 'light' : 'dark';
        if (nowTheme === 'dark') {
            // Ensure dark mode is not overridden by inline custom colors
            this.clearThemeInlineOverrides();
        }
        // Riapplica eventuali colori custom (senza bloccare la dark mode)
        if (localStorage.getItem('budgetwise-custom-colors')) {
            if (nowTheme === 'dark') {
                this.applyAccentOnlyFromCustomColors();
            } else {
                this.applyCustomColors();
            }
        } else {
            this.clearThemeInlineOverrides();
        }
        this.updateChart();
    }

    applyTheme() {
        if (localStorage.getItem('budgetwise-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            const t = document.getElementById('themeToggle');
            if (t) t.textContent = '☀️';
            // Avoid inline overrides freezing light colors in dark mode
            this.clearThemeInlineOverrides();
            if (localStorage.getItem('budgetwise-custom-colors')) {
                this.applyAccentOnlyFromCustomColors();
            }
        }
    }

    getCurrentTheme() {
        // Source of truth: data-theme attribute (html), fallback to localStorage
        const attr = document.documentElement.getAttribute('data-theme');
        if (attr === 'dark') return 'dark';
        const saved = localStorage.getItem('budgetwise-theme');
        return saved === 'dark' ? 'dark' : 'light';
    }
getCurrentThemeColors() {
        const style = getComputedStyle(document.documentElement);
        return {
            accent: style.getPropertyValue('--accent').trim() || '#0ea5e9',
            accentLight: style.getPropertyValue('--accent-light').trim() || '#38bdf8',
            cardBg: style.getPropertyValue('--card-bg').trim() || '#ffffff',
            textPrimary: style.getPropertyValue('--text-primary').trim() || '#0f172a',
            textSecondary: style.getPropertyValue('--text-secondary').trim() || '#334155',
            bg: style.getPropertyValue('--bg-color').trim() || '#f8fafc',
            success: style.getPropertyValue('--success').trim() || '#10b981',
            danger: style.getPropertyValue('--danger').trim() || '#ef4444',
            warning: style.getPropertyValue('--warning').trim() || '#f59e0b',
            border: style.getPropertyValue('--border').trim() || '#e2e8f0'
        };
    }

    applyCustomColors() {
        // Apply ONLY if user has custom colors saved.
        if (!this.customColors) return;
        const currentTheme = this.getCurrentTheme ? this.getCurrentTheme() : (localStorage.getItem('budgetwise-theme') === 'dark' ? 'dark' : 'light');
        const savedTheme = this.customColorsTheme || localStorage.getItem('budgetwise-custom-colors-theme') || 'light';
        const crossTheme = savedTheme !== currentTheme;
        // Se i colori sono stati salvati in LIGHT, non devono bloccare la DARK mode.
        const lockSensitive = crossTheme && currentTheme === 'dark';
        document.documentElement.style.setProperty('--accent', this.customColors.accent);
        document.documentElement.style.setProperty('--accent-light', this.customColors.accentLight);
        if (!lockSensitive) document.documentElement.style.setProperty('--card-bg', this.customColors.cardBg);
        if (!lockSensitive) document.documentElement.style.setProperty('--text-primary', this.customColors.textPrimary);
        if (!lockSensitive) document.documentElement.style.setProperty('--text-secondary', this.customColors.textSecondary);
        if (!lockSensitive) document.documentElement.style.setProperty('--bg-color', this.customColors.bg);
document.documentElement.style.setProperty('--success', this.customColors.success);
        document.documentElement.style.setProperty('--danger', this.customColors.danger);
        document.documentElement.style.setProperty('--warning', this.customColors.warning);
        if (!lockSensitive) document.documentElement.style.setProperty('--border', this.customColors.border);
document.documentElement.style.setProperty('--accent-gradient', 
            `linear-gradient(135deg, ${this.customColors.accent}, ${this.customColors.accentLight})`);
        
        this.syncColorPickers();
    }

    
    applyAccentOnlyFromCustomColors() {
        if (!this.customColors) return;
        document.documentElement.style.setProperty('--accent', this.customColors.accent);
        document.documentElement.style.setProperty('--accent-light', this.customColors.accentLight);
        document.documentElement.style.setProperty('--success', this.customColors.success);
        document.documentElement.style.setProperty('--danger', this.customColors.danger);
        document.documentElement.style.setProperty('--warning', this.customColors.warning);
        document.documentElement.style.setProperty('--accent-gradient',
            `linear-gradient(135deg, ${this.customColors.accent}, ${this.customColors.accentLight})`);
    }


    clearThemeInlineOverrides() {
        const props = [
            '--accent', '--accent-light', '--card-bg', '--text-primary', '--text-secondary',
            '--bg-color', '--success', '--danger', '--warning', '--border', '--accent-gradient'
        ];
        props.forEach(p => document.documentElement.style.removeProperty(p));
    }

    syncColorPickers() {
        const setField = (id, value) => {
            const input = document.getElementById(id);
            if (!input) return;

            // <input type="color"> accetta solo #RRGGBB. Se troviamo valori tipo rgb/rgba li normalizziamo.
            const normalizeToHex = (v) => {
                if (!v) return '';
                v = String(v).trim();

                // già #RRGGBB
                if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;

                // #RGB -> #RRGGBB
                const short = v.match(/^#([0-9a-fA-F]{3})$/);
                if (short) {
                    const s = short[1];
                    return '#' + s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
                }

                // rgb()/rgba() -> #RRGGBB (ignora alpha)
                const rgb = v.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i);
                if (rgb) {
                    const r = Math.max(0, Math.min(255, parseInt(rgb[1], 10)));
                    const g = Math.max(0, Math.min(255, parseInt(rgb[2], 10)));
                    const b = Math.max(0, Math.min(255, parseInt(rgb[3], 10)));
                    const toHex = (n) => n.toString(16).padStart(2, '0');
                    return '#' + toHex(r) + toHex(g) + toHex(b);
                }

                return '';
            };

            // Se il campo è un color picker, settiamo solo valori validi
            if (input.type === 'color') {
                const hex = normalizeToHex(value);
                if (hex) input.value = hex;
                return;
            }

            // altrimenti set normale
            input.value = value ?? '';
        };
        setField('colorAccent', this.customColors.accent);
        setField('colorAccentLight', this.customColors.accentLight);
        setField('colorCardBg', this.customColors.cardBg);
        setField('colorTextPrimary', this.customColors.textPrimary);
        setField('colorTextSecondary', this.customColors.textSecondary);
        setField('colorBg', this.customColors.bg);
        setField('colorSuccess', this.customColors.success);
        setField('colorDanger', this.customColors.danger);
        setField('colorWarning', this.customColors.warning);
        setField('colorBorder', this.customColors.border);
    }

    saveCustomColors() {
        localStorage.setItem('budgetwise-custom-colors', JSON.stringify(this.customColors));
        const currentTheme = this.getCurrentTheme ? this.getCurrentTheme() : (localStorage.getItem('budgetwise-theme') === 'dark' ? 'dark' : 'light');
        localStorage.setItem('budgetwise-custom-colors-theme', currentTheme);
        this.customColorsTheme = currentTheme;
    }

    setupColorPickers() {
        // Blocca in free
        if (!this.checkFreeLimits('colorCustomization')) {
            document.querySelectorAll('#colorAccent, #colorAccentLight, #colorCardBg, #colorTextPrimary, #colorTextSecondary, #colorBg, #colorSuccess, #colorDanger, #colorWarning, #colorBorder, #resetColorsBtn').forEach(el => {
                if (el) el.disabled = true;
            });
            return;
        }
        
        const colorInputs = [
            'colorAccent', 'colorAccentLight', 'colorCardBg', 
            'colorTextPrimary', 'colorTextSecondary', 'colorBg',
            'colorSuccess', 'colorDanger', 'colorWarning', 'colorBorder'
        ];
        
        colorInputs.forEach(id => {
            const picker = document.getElementById(id);
            if (picker) {
                picker.addEventListener('input', (e) => {
                    const value = e.target.value;
                    // First time the user touches a picker, initialize from current theme defaults.
                    if (!this.customColors) {
                        this.customColors = this.getCurrentThemeColors();
                    }
                    const propName = id.replace('color', '').charAt(0).toLowerCase() + id.replace('color', '').slice(1);
                    this.customColors[propName] = value;
                    this.applyCustomColors();
                    this.saveCustomColors();
                });
            }
        });
        
        const resetBtn = document.getElementById('resetColorsBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Reset to theme defaults and remove inline overrides.
                this.customColors = null;
                localStorage.removeItem('budgetwise-custom-colors');
                localStorage.removeItem('budgetwise-custom-colors-theme');
                this.customColorsTheme = null;
                this.clearThemeInlineOverrides();
                this.syncColorPickers();
                this.showToast(this.t('resetColors') || 'Colori ripristinati', 'success');
            });
        }
    }

    saveData() {
        localStorage.setItem('budgetwise-data', JSON.stringify(this.data));
    }

    loadData() {
        const saved = localStorage.getItem('budgetwise-data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                
                if (parsed.incomes && parsed.incomes.length > 0 && !parsed.periodStart) {
                    const firstIncome = parsed.incomes.sort((a, b) => 
                        new Date(a.date) - new Date(b.date)
                    )[0];
                    
                    const startDate = new Date(firstIncome.date);
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 30);
                    
                    parsed.periodStart = startDate.toISOString().split('T')[0];
                    parsed.periodEnd = endDate.toISOString().split('T')[0];
                }
                
                if (parsed.income !== undefined && !parsed.incomes) {
                    parsed.incomes = [{
                        desc: this.data.language === 'it' ? 'Stipendio' : 'Salary',
                        amount: parsed.income,
                        date: new Date().toISOString().split('T')[0],
                        id: Date.now()
                    }];
                    delete parsed.income;
                }
                
                this.data = parsed;

                // Sanifica importi spese fisse (evita mismatch con import banca: es. "1.234,56")
                if (Array.isArray(this.data.fixedExpenses)) {
                    this.data.fixedExpenses = this.data.fixedExpenses.map(e => {
                        if (!e) return e;
                        const a = this.parseMoney(e.amount);
                        return { ...e, amount: a };
                    });
                }

                if (this.data.savingsPot === undefined) this.data.savingsPot = 0;
            } catch (e) {
                console.warn('Errore nel caricamento dati, reset automatico');
                this.resetAll();
            }
        }
    }

    backupData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = `budgetwise-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        alert(this.t('backupDownloaded'));
    }

    restoreData(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.data = JSON.parse(e.target.result);

                // Sanifica importi spese fisse (evita mismatch con import banca: es. "1.234,56")
                if (Array.isArray(this.data.fixedExpenses)) {
                    this.data.fixedExpenses = this.data.fixedExpenses.map(e => {
                        if (!e) return e;
                        const a = this.parseMoney(e.amount);
                        return { ...e, amount: a };
                    });
                }

                this.saveData();
                this.updateUI();
                this.updateChart();
                this.updateTransactionCount();
                this.applyLanguage();
                alert(this.t('dataRestored'));
            } catch {
                alert(this.t('invalidFile'));
            }
        };
        reader.readAsText(file);
    }

    resetAll() {
        if (confirm(this.t('confirmReset'))) {
            localStorage.clear();
            const today = new Date();
            const end = new Date(today);
            end.setDate(today.getDate() + 28);
            
            this.data = {
                incomes: [],
                fixedExpenses: [],
                variableExpenses: {},
                savingsPercent: 0,
                savingsGoal: 0,
            savingsPot: 0,
                threshold: 50,
                language: this.data.language,
                periodStart: today.toISOString().split('T')[0],
                periodEnd: end.toISOString().split('T')[0]
            };
            // Resetta anche i colori personalizzati
            this.customColors = this.getCurrentThemeColors();
            this.applyCustomColors();
            this.saveCustomColors();
            this.syncColorPickers();

            this.updateUI();
            this.updateChart();
            this.updateTransactionCount();
            this.applyLanguage();
            alert(this.t('resetCompleted'));
        }
    }

    exportToCalendar() {
        // Verifica limite esportazione
        if (!this.checkFreeLimits('calendarExport')) return;
        
        let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//BudgetWise//IT\n";
        if (Array.isArray(this.data.fixedExpenses)) {
            this.data.fixedExpenses.forEach(exp => {
                if (exp && exp.endDate && new Date(exp.endDate) >= new Date()) {
                    ics += "BEGIN:VEVENT\n";
                    ics += `SUMMARY:💰 ${exp.name || 'Spesa'}\n`;
                    ics += `DESCRIPTION:${this.t('fixedExpense')} ${this.formatCurrency(exp.amount || 0)} - ${this.t('everyMonthOnDay')} ${exp.day || '?'}\n`;
                    const nextDate = this.getNextPaymentDate(exp.day || 1);
                    ics += `DTSTART;VALUE=DATE:${nextDate.replace(/-/g, '')}\n`;
                    ics += `RRULE:FREQ=MONTHLY;UNTIL=${(exp.endDate || '').replace(/-/g, '')}\n`;
                    ics += "END:VEVENT\n";
                }
            });
        }
        if (this.data.variableExpenses && typeof this.data.variableExpenses === 'object') {
            Object.entries(this.data.variableExpenses).forEach(([date, expenses]) => {
                if (Array.isArray(expenses)) {
                    expenses.forEach(exp => {
                        ics += "BEGIN:VEVENT\n";
                        ics += `SUMMARY:🛒 ${exp.name || 'Spesa'}\n`;
                        ics += `DESCRIPTION:${exp.category || 'Altro'} - ${this.formatCurrency(exp.amount || 0)}\n`;
                        ics += `DTSTART;VALUE=DATE:${date.replace(/-/g, '')}\n`;
                        ics += "END:VEVENT\n";
                    });
                }
            });
        }
        ics += "END:VCALENDAR";
        const blob = new Blob([ics], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `budgetwise-${this.data.periodStart}.ics`;
        a.click();
        alert(this.t('calendarExported'));
    }

    // ========== IMPARARE CATEGORIE (AI locale) ==========
    /** Migra regole vecchie { keyword: "Cat" } → { keyword: { category, confidence } } */
    migrateCategoryRules(raw) {
        const migrated = {};
        for (const [key, val] of Object.entries(raw)) {
            if (typeof val === 'string') {
                migrated[key] = { category: val, confidence: 1 };
            } else if (val && typeof val.category === 'string') {
                migrated[key] = { category: val.category, confidence: Math.max(1, val.confidence || 1) };
            }
        }
        return migrated;
    }

    /** Normalizza descrizione: minuscole, rimozione numeri/codici, estrae token principali */
    normalizeDescriptionForLearning(description) {
        if (!description || typeof description !== 'string') return [];
        let s = description
            .toLowerCase()
            .replace(/[\u0300-\u036f]/g, '') // diacritics
            .replace(/\d+/g, ' ')            // numeri
            .replace(/[^a-z0-9\s]/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        const tokens = s.split(' ').filter(t => t.length >= 3);
        const seen = new Set();
        const out = [];
        for (const t of tokens) {
            if (!seen.has(t)) { seen.add(t); out.push(t); }
        }
        // Opzionale: IBAN/RID/SEPA per ricorrenti
        const lower = description.toLowerCase();
        if (/\bibb\b|iban|rid|sepa|addebito|sdd|abbonamento\b/i.test(lower)) {
            const ric = 'ricorrente';
            if (!seen.has(ric)) { seen.add(ric); out.push(ric); }
        }
        return out;
    }

    learnCategory(description, category) {
        // Apprendimento solo in premium
        if (this.license?.isFeatureLocked?.('categoryLearning')) return;
        
        if (!description || !category) return;
        const tokens = this.normalizeDescriptionForLearning(description);
        for (const keyword of tokens) {
            if (keyword.length < 3) continue;
            const existing = this.categoryRules[keyword];
            if (existing && existing.category === category) {
                existing.confidence = Math.min(10, (existing.confidence || 1) + 1);
            } else {
                this.categoryRules[keyword] = { category, confidence: 1 };
            }
        }
        localStorage.setItem('budgetwise-category-rules', JSON.stringify(this.categoryRules));
        console.log(`📌 Appreso: "${tokens.slice(0, 3).join(', ')}" → ${category}`);
    }

    /**
     * Suggerisce categoria da descrizione.
     * @returns {{ category: string, confidence: number }} category + confidenza (0 = nessun match)
     */
    suggestCategory(description) {
        const lowerDesc = description.toLowerCase();
        const isRicorrente = /\bibb\b|iban|rid|sepa|addebito|sdd|abbonamento\b/i.test(description || '');
        let best = { category: 'Altro', confidence: 0 };
        for (const [keyword, rule] of Object.entries(this.categoryRules)) {
            if (keyword.length < 3) continue;
            const matches = (keyword === 'ricorrente' && isRicorrente) || lowerDesc.includes(keyword);
            if (!matches) continue;
            const conf = (rule && rule.confidence) || 1;
            if (conf > best.confidence) {
                best = { category: (rule && rule.category) || 'Altro', confidence: conf };
            }
        }
        return best;
    }

    /** Per retrocompatibilità: restituisce solo la stringa categoria (come prima) */
    suggestCategoryString(description) {
        return this.suggestCategory(description).category;
    }

    // ========== GESTIONE CATEGORIE PERSONALIZZATE ==========
    getAllCategories() {
        return [...this.defaultCategories, ...this.customCategories];
    }
    
    saveCustomCategories() {
        localStorage.setItem('budgetwise-custom-categories', JSON.stringify(this.customCategories));
    }
    
    showCategoryManager() {
        const overlay = document.getElementById('categoryManagerOverlay');
        if (!overlay) return;
        this.refreshCategoryList();
        overlay.style.display = 'flex';
    }
    
    hideCategoryManager() {
        const overlay = document.getElementById('categoryManagerOverlay');
        if (overlay) overlay.style.display = 'none';
    }
    
    refreshCategoryList() {
        const defaultList = document.getElementById('defaultCategoriesList');
        const customList = document.getElementById('customCategoriesList');
        
        if (defaultList) {
            defaultList.innerHTML = this.defaultCategories.map(cat => {
                let translationKey = '';
                switch(cat) {
                    case 'Alimentari': translationKey = 'categoryAlimentari'; break;
                    case 'Trasporti': translationKey = 'categoryTrasporti'; break;
                    case 'Svago': translationKey = 'categorySvago'; break;
                    case 'Salute': translationKey = 'categorySalute'; break;
                    case 'Abbigliamento': translationKey = 'categoryAbbigliamento'; break;
                    case 'Altro': translationKey = 'categoryAltro'; break;
                    default: translationKey = cat;
                }
                const displayName = this.t(translationKey);
                return `<div class="category-item default"><span>${displayName}</span></div>`;
            }).join('');
        }
        
        if (customList) {
            if (this.customCategories.length === 0) {
                customList.innerHTML = `<p class="empty-message">${this.t('noCustomCategories')}</p>`;
            } else {
                customList.innerHTML = this.customCategories.map((cat, index) => `
                    <div class="category-item custom">
                        <span>${cat}</span>
                        <div>
                            <button class="edit-category-btn" data-index="${index}">✏️</button>
                            <button class="delete-category-btn" data-index="${index}">🗑️</button>
                        </div>
                    </div>
                `).join('');
                
                document.querySelectorAll('.edit-category-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = e.target.dataset.index;
                        this.editCategory(parseInt(index));
                    });
                });
                
                document.querySelectorAll('.delete-category-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = e.target.dataset.index;
                        this.deleteCategory(parseInt(index));
                    });
                });
            }
        }
    }
    
    editCategory(index) {
        const oldName = this.customCategories[index];
        const newName = prompt(this.t('categoryName'), oldName);
        if (!newName || newName.trim() === '') return;
        const trimmed = newName.trim();
        
        if (this.getAllCategories().includes(trimmed) && trimmed !== oldName) {
            alert(this.t('categoryAlreadyExists'));
            return;
        }
        
        this.customCategories[index] = trimmed;
        this.saveCustomCategories();
        this.refreshCategoryList();
        this.updateAllCategorySelects();
        alert(this.t('categoryUpdated'));
    }
    
    deleteCategory(index) {
        const cat = this.customCategories[index];
        if (!confirm(this.t('confirmDeleteCategory').replace('{name}', cat))) return;
        
        this.customCategories.splice(index, 1);
        this.saveCustomCategories();
        this.refreshCategoryList();
        this.updateAllCategorySelects();
        alert(this.t('categoryDeleted'));
    }
    
    saveCategory() {
        if (!this.checkFreeLimits('customCategory')) return;
        
        const input = document.getElementById('newCategoryName');
        if (!input) return;
        const newCat = input.value.trim();
        if (!newCat) return;
        
        if (this.getAllCategories().includes(newCat)) {
            alert(this.t('categoryAlreadyExists'));
            return;
        }
        
        this.customCategories.push(newCat);
        this.saveCustomCategories();
        input.value = '';
        this.refreshCategoryList();
        this.updateAllCategorySelects();
        alert(this.t('categoryAdded'));
    }
    
    updateAllCategorySelects() {
        const categories = this.getAllCategories();
        const optionsHtml = categories.map(cat => 
            `<option value="${cat}">${this.getCategoryDisplay(cat)}</option>`
        ).join('');
        
        const mainSelect = document.getElementById('expenseCategory');
        if (mainSelect) {
            mainSelect.innerHTML = optionsHtml;
        }
    }
    
    getCategoryEmoji(category) {
        const emojiMap = {
            'Alimentari': '🍎',
            'Trasporti': '🚗',
            'Svago': '🎮',
            'Salute': '💊',
            'Abbigliamento': '👕',
            'Altro': '📦'
        };
        return emojiMap[category] || '📌';
    }
    getCategoryDisplay(category) {
        const map = {
            'Alimentari': 'categoryAlimentari',
            'Trasporti': 'categoryTrasporti',
            'Svago': 'categorySvago',
            'Salute': 'categorySalute',
            'Abbigliamento': 'categoryAbbigliamento',
            'Altro': 'categoryAltro'
        };

        const key = map[category];
        if (key) return this.t(key);

        // Se è una categoria personalizzata, mantieni emoji + testo
        return `${this.getCategoryEmoji(category)} ${category}`;
    }


// ========== REVISIONE IMPORT CSV CON CREAZIONE CATEGORIE E AUTO-COMPLETAMENTO ==========
showImportReview(importedExpenses) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('importReviewOverlay');
        const listEl = document.getElementById('importReviewList');
        
        if (!overlay || !listEl) {
            resolve(importedExpenses);
            return;
        }
        
        // Funzione per generare le opzioni del select (include "Nuova categoria")
        const getCategoryOptions = (selectedCat, allCats) => {
            let options = allCats.map(cat => 
                `<option value="${cat}" ${cat === selectedCat ? 'selected' : ''}>${this.getCategoryEmoji(cat)} ${cat}</option>`
            ).join('');
            
            // Aggiungi l'opzione per nuova categoria
            options += `<option value="__NEW__" style="color: var(--accent); font-weight: bold;">➕ Nuova categoria...</option>`;
            
            return options;
        };
        
        // Ottieni tutte le categorie all'inizio
        let currentCategories = [...this.getAllCategories()];
        
        // Genera l'HTML per ogni spesa
        listEl.innerHTML = importedExpenses.map((exp, index) => {
            const hint = exp._suggested
                ? this.t('importSuggested').replace('{cat}', exp._suggested)
                : this.t('importLearn');
            
            // Se c'è un suggerimento con alta confidenza, preselezionalo
            let selectedCat = exp.category || 'Altro';
            if (exp._suggested && !exp.category) {
                selectedCat = exp._suggested;
            }
            
            return `
                <div class="review-item" data-index="${index}">
                    <div class="review-info">
                        <span class="review-date">${exp.date}</span>
                        <span class="review-name">${exp.name}</span>
                        <span class="review-amount">${this.formatCurrency(exp.amount)}</span>
                    </div>
                    <div class="review-category">
                        <select class="review-select" data-index="${index}" data-description="${exp.name.replace(/"/g, '&quot;')}">
                            ${getCategoryOptions(selectedCat, currentCategories)}
                        </select>
                        <small class="review-hint">${hint}</small>
                    </div>
                </div>
            `;
        }).join('');
        
        // Funzione per aggiornare le opzioni di TUTTI i select MANTENENDO i valori correnti
        const refreshAllSelects = () => {
            const allCats = this.getAllCategories();
            
            document.querySelectorAll('.review-select').forEach(select => {
                const index = select.dataset.index;
                const currentValue = select.value; // Salva il valore corrente
                const currentExpCat = importedExpenses[index]?.category || 'Altro';
                
                // Determina quale valore mantenere (priorità: valore corrente, categoria importata, Altro)
                let valueToKeep = currentValue;
                if (valueToKeep === '__NEW__' || !valueToKeep) {
                    valueToKeep = currentExpCat;
                }
                
                // Rigenera le opzioni
                let options = allCats.map(cat => 
                    `<option value="${cat}" ${cat === valueToKeep ? 'selected' : ''}>${this.getCategoryEmoji(cat)} ${cat}</option>`
                ).join('');
                options += `<option value="__NEW__" style="color: var(--accent); font-weight: bold;">➕ Nuova categoria...</option>`;
                
                // Aggiorna il select mantenendo il valore
                select.innerHTML = options;
                select.value = valueToKeep;
                
                // Aggiorna anche importedExpenses per sicurezza
                if (valueToKeep !== '__NEW__') {
                    importedExpenses[index].category = valueToKeep;
                }
            });
        };
        
               // Funzione per auto-completare SOLO le righe con descrizione IDENTICA
const autoCompleteIdentical = (startIndex, newCategory, description) => {
    // Normalizza la descrizione corrente per il confronto
    const normalizedCurrent = this.normalizeDescriptionForLearning(description);
    if (normalizedCurrent.length < 3) return;
    
    console.log('🔍 Descrizione normalizzata:', normalizedCurrent);
    
    // Cerca SOLO le righe successive con descrizione IDENTICA
    for (let i = startIndex + 1; i < importedExpenses.length; i++) {
        const otherExp = importedExpenses[i];
        const normalizedOther = this.normalizeDescriptionForLearning(otherExp.name);
        
        // CONFRONTO ESATTO, non parziale
        if (normalizedOther === normalizedCurrent) {
            console.log(`✅ Riga ${i} IDENTICA a ${startIndex}: ${otherExp.name}`);
            const otherSelect = document.querySelector(`.review-select[data-index="${i}"]`);
            if (otherSelect && otherSelect.value !== newCategory && otherSelect.value !== '__NEW__') {
                // Applica la categoria
                otherSelect.value = newCategory;
                importedExpenses[i].category = newCategory;
                
                // Feedback visivo
                otherSelect.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                setTimeout(() => {
                    otherSelect.style.backgroundColor = '';
                }, 500);
                
                // Impara anche per questa riga (solo premium)
                if (!this.license?.isFeatureLocked?.('categoryLearning')) {
                    this.learnCategory(otherExp.name, newCategory);
                }
            }
        } else {
            console.log(`❌ Riga ${i} DIVERSA: ${otherExp.name} - NON modificata`);
        }
    }
};
        
        // Gestione della creazione nuove categorie
        document.querySelectorAll('.review-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const selectEl = e.target;
                const index = parseInt(selectEl.dataset.index);
                const description = selectEl.dataset.description || '';
                
                if (selectEl.value === '__NEW__') {
                    // Chiedi all'utente il nome della nuova categoria
                    const newCategory = prompt('Inserisci il nome della nuova categoria:', '');
                    
                    if (newCategory && newCategory.trim() !== '') {
                        const catName = newCategory.trim();
                        
                        // Verifica se esiste già
                        if (!this.getAllCategories().includes(catName)) {
                            // Aggiungi alle categorie personalizzate (solo premium)
                            if (!this.checkFreeLimits('customCategory')) {
                                alert('Le categorie personalizzate sono disponibili in Premium!');
                                selectEl.value = importedExpenses[index].category || 'Altro';
                                return;
                            }
                            this.customCategories.push(catName);
                            this.saveCustomCategories();
                            
                            // Mostra feedback
                            this.showToast(`✅ Categoria "${catName}" creata!`, 'success');
                        }
                        
                        // Aggiorna la categoria per questa riga
                        importedExpenses[index].category = catName;
                        
                        // AGGIORNA TUTTI I SELECT MANTENENDO I VALORI
                        refreshAllSelects();
                        
                        // Assicurati che il select corrente abbia il valore giusto
                        const currentSelect = document.querySelector(`.review-select[data-index="${index}"]`);
                        if (currentSelect) {
                            currentSelect.value = catName;
                        }
                        
                        // Apprendimento immediato (solo premium)
                        if (!this.license?.isFeatureLocked?.('categoryLearning')) {
                            this.learnCategory(description, catName);
                        }
                        
                        // AUTO-COMPLETAMENTO: applica SOLO a righe con descrizione IDENTICA
                        autoCompleteIdentical(index, catName, description);
                        
                    } else {
                        // Se annulla, ripristina il valore precedente
                        selectEl.value = importedExpenses[index].category || 'Altro';
                    }
                } else {
                    // Cambio categoria normale
                    const newCategory = selectEl.value;
                    importedExpenses[index].category = newCategory;
                    
                    // Apprendimento (solo premium)
                    if (!this.license?.isFeatureLocked?.('categoryLearning')) {
                        this.learnCategory(description, newCategory);
                    }
                    
                    // AUTO-COMPLETAMENTO: applica SOLO a righe con descrizione IDENTICA
                    autoCompleteIdentical(index, newCategory, description);
                }
            });
        });
        
        overlay.style.display = 'flex';
        
        const confirmBtn = document.getElementById('confirmImportBtn');
        const cancelBtn = document.getElementById('cancelImportBtn');
        
        const onConfirm = () => {
            const selects = document.querySelectorAll('.review-select');
            selects.forEach(select => {
                const index = select.dataset.index;
                if (select.value !== '__NEW__') {
                    const newCategory = select.value;
                    importedExpenses[index].category = newCategory;
                    
                    // Apprendimento (solo premium)
                    if (!this.license?.isFeatureLocked?.('categoryLearning')) {
                        this.learnCategory(importedExpenses[index].name, newCategory);
                    }
                }
            });
            
            cleanup();
            resolve(importedExpenses);
        };
        
        const onCancel = () => {
            cleanup();
            resolve([]);
        };
        
        const cleanup = () => {
            overlay.style.display = 'none';
            confirmBtn.removeEventListener('click', onConfirm);
            cancelBtn.removeEventListener('click', onCancel);
        };
        
        // Clona i bottoni per evitare listener duplicati
        const newConfirm = confirmBtn.cloneNode(true);
        const newCancel = cancelBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
        cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
        
        newConfirm.addEventListener('click', onConfirm);
        newCancel.addEventListener('click', onCancel);
    });
}
    // ========== IMPORT CSV CON MAPPATURA E REVISIONE ==========
    async parseCSV(file, delimiter, dateFormat, skipRows = 0, headerRow = 1) {
        // Verifica limite import
        if (!this.checkFreeLimits('csvImport')) return { cancelled: true, added: 0, incomes: 0 };
        
        console.log('📥 Inizio import CSV:', file.name, 'delimiter:', delimiter, 'dateFormat:', dateFormat, 'skipRows:', skipRows, 'headerRow:', headerRow);

        const mapping = await this.showMappingDialog(file, delimiter, skipRows, headerRow);
        if (!mapping) {
            alert(this.t('importCancelled'));
            return { cancelled: true, added: 0, incomes: 0 };
        }

        return await new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const text = e.target.result;
                    const allLines = String(text).split('\n').filter(line => line.trim() !== '');

                    // Salta le righe iniziali
                    const startLine = Math.min(skipRows, allLines.length - 1);

                    // Determina dove iniziano i dati (dopo l'intestazione)
                    let dataStartLine = startLine;
                    if (headerRow > 0) {
                        dataStartLine = startLine + headerRow; // Salta anche l'intestazione
                    }

                    const lines = allLines.slice(dataStartLine);
                    const importedExpenses = [];
                    const tempIncomes = [];

                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (!line) continue;

                        const parts = line.split(delimiter);
                        if (parts.length <= Math.max(mapping.dateCol, mapping.descCol, mapping.amountCol)) continue;

                        let dateStr = parts[mapping.dateCol] ? parts[mapping.dateCol].trim() : '';
                        let description = parts[mapping.descCol] ? parts[mapping.descCol].trim() : '';
                        let amountStr = parts[mapping.amountCol] ? parts[mapping.amountCol].trim() : '';
                        let category = mapping.categoryCol !== -1 && parts[mapping.categoryCol] ? parts[mapping.categoryCol].trim() : '';

                        if (!dateStr || !description || !amountStr) continue;

                        if (dateFormat === 'DD/MM/YYYY') {
                            const parts = dateStr.split(/[\/\-]/);
                            if (parts.length === 3) {
                                const [d, m, y] = parts;
                                if (d && m && y) dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                else continue;
                            } else continue;
                        } else if (dateFormat === 'MM/DD/YYYY') {
                            const parts = dateStr.split(/[\/\-]/);
                            if (parts.length === 3) {
                                const [m, d, y] = parts;
                                if (m && d && y) dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                else continue;
                            } else continue;
                        }

                        dateStr = this.normalizeIsoDate(dateStr);
                        if (!dateStr) continue;

                        let amount = parseFloat(String(amountStr).replace(',', '.').replace(/[^0-9.-]/g, ''));
                        if (isNaN(amount)) continue;

                        let _suggested = null;
                        if (!category) {
                            // Suggerimento categorie (solo premium o base)
                            if (!this.license?.isFeatureLocked?.('categoryLearning')) {
                                const sug = this.suggestCategory(description);
                                category = sug.confidence >= this.CATEGORY_CONFIDENCE_THRESHOLD ? sug.category : 'Altro';
                                if (sug.confidence > 0 && sug.confidence < this.CATEGORY_CONFIDENCE_THRESHOLD) {
                                    _suggested = sug.category;
                                }
                            } else {
                                category = 'Altro';
                            }
                        }

                        if (amount > 0) {
                            tempIncomes.push({
                                desc: description,
                                amount: amount,
                                date: dateStr,
                                id: Date.now() + i
                            });
                        } else {
                            amount = Math.abs(amount);
                            const exp = { name: description, amount: amount, date: dateStr, category: category || 'Altro', id: Date.now() + i };
                            if (_suggested) exp._suggested = _suggested;
                            importedExpenses.push(exp);
                        }
                    }

                    let addedExpenses = 0;
                    let addedIncomes = 0;

                    if (importedExpenses.length > 0) {
                        const reviewed = await this.showImportReview(importedExpenses);

                        if (reviewed.length > 0) {
                            for (const exp of reviewed) {
                                if (!this.data.variableExpenses) this.data.variableExpenses = {};
                                if (!this.data.variableExpenses[exp.date]) this.data.variableExpenses[exp.date] = [];
                                this.data.variableExpenses[exp.date].push({
                                    name: exp.name,
                                    amount: exp.amount,
                                    category: exp.category,
                                    id: exp.id
                                });
                            }

                            addedExpenses = reviewed.length;

                            if (tempIncomes.length > 0) {
                                if (!this.data.incomes) this.data.incomes = [];
                                this.data.incomes.push(...tempIncomes);
                                addedIncomes = tempIncomes.length;
                            }

                            this.saveData();
                            this.updateUI();
                            this.updateChart();
                            this.updateTransactionCount();

                            const mostRecent = reviewed
                                .map(e => this.normalizeIsoDate(e.date))
                                .sort()
                                .slice(-1)[0];
                            const dateInput = document.getElementById('expenseDate');
                            if (dateInput && mostRecent) dateInput.value = mostRecent;
                            this.updateVariableExpensesList();

                            this.showToast(
                                this.data.language === 'it'
                                    ? `✅ Importate ${addedExpenses} spese${addedIncomes ? ` e ${addedIncomes} entrate` : ''}!`
                                    : `✅ Imported ${addedExpenses} expenses${addedIncomes ? ` and ${addedIncomes} incomes` : ''}!`,
                                'success'
                            );

                            resolve({ cancelled: false, added: addedExpenses, incomes: addedIncomes });
                            return;
                        } else {
                            alert(this.t('importCancelled'));
                            resolve({ cancelled: true, added: 0, incomes: 0 });
                            return;
                        }
                    } else if (tempIncomes.length > 0) {
                        if (!this.data.incomes) this.data.incomes = [];
                        this.data.incomes.push(...tempIncomes);
                        addedIncomes = tempIncomes.length;
                        this.saveData();
                        this.updateUI();
                        this.updateChart();
                        this.updateTransactionCount();

                        this.showToast(
                            this.data.language === 'it'
                                ? `✅ Importate ${addedIncomes} entrate!`
                                : `✅ Imported ${addedIncomes} incomes!`,
                            'success'
                        );

                        resolve({ cancelled: false, added: 0, incomes: addedIncomes });
                        return;
                    } else {
                        this.showToast(
                            this.data.language === 'it'
                                ? '⚠️ Nessun movimento valido trovato nel file'
                                : '⚠️ No valid transactions found in the file',
                            'info'
                        );
                        resolve({ cancelled: false, added: 0, incomes: 0 });
                        return;
                    }
                } catch (err) {
                    console.error('❌ Errore durante import CSV:', err);
                    alert(this.t('csvImportError'));
                    reject(err);
                }
            };

            reader.onerror = () => {
                console.error('❌ Errore lettura file');
                alert(this.t('fileReadError'));
                reject(new Error('File read error'));
            };

            reader.readAsText(file);
        });
    }
// ========== MAPPATURA CAMPI CSV ==========
async showMappingDialog(file, delimiter, skipRows = 0, headerRow = 1) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('csvMappingOverlay');
        const headersRow = document.getElementById('csvMappingHeaders');
        const previewBody = document.getElementById('csvMappingPreview');
        const fieldsDiv = document.getElementById('csvMappingFields');
        
        if (!overlay || !headersRow || !previewBody || !fieldsDiv) {
            console.error('Elementi mappatura non trovati');
            resolve(null);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            if (lines.length === 0) {
                resolve(null);
                return;
            }
            
            // Salta le righe iniziali
            const startLine = Math.min(skipRows, lines.length - 1);
            let headerLine = startLine;
            
            // Se headerRow è > 0, la riga di intestazione è startLine + (headerRow - 1)
            if (headerRow > 0) {
                headerLine = startLine + (headerRow - 1);
                if (headerLine >= lines.length) {
                    alert(`Riga intestazione ${headerRow} non trovata. Uso la prima riga disponibile.`);
                    headerLine = startLine;
                }
            }
            
            // Estrai intestazione
            let headers = [];
            if (headerRow > 0) {
                headers = lines[headerLine].split(delimiter).map(h => h.trim());
            } else {
                // Nessuna intestazione: crea colonne fittizie
                const sampleLine = lines[startLine] || '';
                headers = sampleLine.split(delimiter).map((_, i) => `Colonna ${i+1}`);
            }
            
            // Prepara dati per anteprima (dopo l'intestazione)
            const previewData = [];
            const dataStartLine = headerLine + 1;
            for (let i = dataStartLine; i < Math.min(dataStartLine + 5, lines.length); i++) {
                previewData.push(lines[i].split(delimiter).map(cell => cell.trim()));
            }
            
            overlay.style.display = 'flex';
            
            headersRow.innerHTML = headers.map(h => `<th>${h || '?'}</th>`).join('');
            
            previewBody.innerHTML = previewData.map(row => 
                `<tr>${row.map(cell => `<td class="preview-cell">${cell || ''}</td>`).join('')}</tr>`
            ).join('');
            
            const fieldOptions = [
                { value: 'date', label: this.t('csvFieldDate') },
                { value: 'description', label: this.t('csvFieldDescription') },
                { value: 'amount', label: this.t('csvFieldAmount') },
                { value: 'category', label: this.t('csvFieldCategory') },
                { value: 'ignore', label: this.t('csvFieldIgnore') }
            ];
            
            fieldsDiv.innerHTML = headers.map((header, index) => `
                <div style="display: flex; align-items: center; gap: 15px; background: var(--bg-color); padding: 12px; border-radius: 16px;">
                    <span style="min-width: 150px; font-weight: 600; color: var(--accent);">${this.t("csvColumnN", { n: (index + 1) })}: "${header || this.t("empty")}"</span>
                    <select id="mapping-${index}" class="csv-mapping-select" style="flex: 1;">
                        ${fieldOptions.map(opt => {
                            let selected = '';
                            if (opt.value === 'date' && index === 0) selected = 'selected';
                            else if (opt.value === 'description' && index === 1) selected = 'selected';
                            else if (opt.value === 'amount' && index === 2) selected = 'selected';
                            return `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
                        }).join('')}
                    </select>
                </div>
            `).join('');
            
            const confirmBtn = document.getElementById('confirmMappingBtn');
            const cancelBtn = document.getElementById('cancelMappingBtn');
            
            const onConfirm = () => {
                const mapping = {
                    dateCol: -1,
                    descCol: -1,
                    amountCol: -1,
                    categoryCol: -1
                };
                
                headers.forEach((_, index) => {
                    const select = document.getElementById(`mapping-${index}`);
                    if (select) {
                        const value = select.value;
                        if (value === 'date') mapping.dateCol = index;
                        else if (value === 'description') mapping.descCol = index;
                        else if (value === 'amount') mapping.amountCol = index;
                        else if (value === 'category') mapping.categoryCol = index;
                    }
                });
                
                if (mapping.dateCol === -1 || mapping.descCol === -1 || mapping.amountCol === -1) {
                    alert(this.t('csvMappingRequired'));
                    return;
                }
                
                overlay.style.display = 'none';
                resolve(mapping);
            };
            
            const onCancel = () => {
                overlay.style.display = 'none';
                resolve(null);
            };
            
            // Clona per evitare listener duplicati
            const newConfirm = confirmBtn.cloneNode(true);
            const newCancel = cancelBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
            cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
            
            newConfirm.addEventListener('click', onConfirm);
            newCancel.addEventListener('click', onCancel);
        };
        
        reader.onerror = () => {
            resolve(null);
        };
        
        reader.readAsText(file);
    });
}
    // ========== IMPORT EXCEL CON AUTO-RICONOSCIMENTO INTELLIGENTE ==========
async parseExcel(file, sheetIndex = 0, headerRow = -1) {
        // Verifica limite import
        if (!this.checkFreeLimits('csvImport')) return { cancelled: true, added: 0, incomes: 0 };
        
        const self = this; // 
    console.log('📥 Inizio import Excel con auto-riconoscimento:', file.name, 'foglio:', sheetIndex);

    // Legge Excel
    const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Errore durante la lettura del file'));
        reader.readAsArrayBuffer(file);
    });

    const data = new Uint8Array(arrayBuffer);
    
    // Leggi il file con cellDates: false per avere i valori originali
    const workbook = XLSX.read(data, { 
        type: 'array', 
        cellDates: false,
        raw: true
    });

    const safeSheetIndex = (sheetIndex >= 0 && sheetIndex < workbook.SheetNames.length) ? sheetIndex : 0;
    const sheetName = workbook.SheetNames[safeSheetIndex];
    const worksheet = workbook.Sheets[sheetName];

    // Converte il foglio in un array di array (righe x colonne)
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    if (!rows || rows.length === 0) throw new Error('Il file Excel è vuoto');

   // Funzione per convertire un numero seriale Excel in data ISO
const excelSerialToDate = (serial) => {
    // Excel considera il 1900-01-01 come giorno 1
    const excelEpoch = new Date(1900, 0, 1); // 1 gennaio 1900
    const date = new Date(excelEpoch.getTime() + (serial - 1) * 24 * 60 * 60 * 1000);
    
    // Gestione del bug Excel (considera il 1900 come anno bisestile)
    if (serial > 60) {
        date.setDate(date.getDate() - 1);
    }
    
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

    // Funzione per convertire una cella in stringa
const cellToString = (cell, isDateColumn = false, isAmountColumn = false) => {
    if (cell === null || cell === undefined) return '';
    
    // Se è un numero e dovrebbe essere una data (colonna Data)
    if (typeof cell === 'number' && isFinite(cell) && isDateColumn) {
        // Se il numero è nell'intervallo di date Excel (40000-50000 sono anni 2009-2036)
        if (cell > 40000 && cell < 50000) {
            return excelSerialToDate(cell);
        }
        // Se è un numero piccolo, probabilmente è un importo
        return cell.toString();
    }
    
    // Se è un numero e siamo in una colonna importo
    if (typeof cell === 'number' && isFinite(cell) && isAmountColumn) {
        // Mantieni il numero così com'è (con virgola come separatore decimale)
        return cell.toString().replace('.', ',');
    }
    
    // Se è un numero ma non sappiamo cosa sia
    if (typeof cell === 'number' && isFinite(cell)) {
        return cell.toString();
    }
    
    // Stringa normale
    return String(cell).replace(/[\t ]+/g, ' ').trim();
};

    // ===== AUTO-RICONOSCIMENTO RIGA INTESTAZIONE =====
    let headerRowIndex = -1;
    let headerRowContent = [];

    // Parole chiave per riconoscere l'intestazione (in diverse lingue)
    const headerKeywords = [
        'data', 'date', 'fecha', 'datum',
        'descrizione', 'description', 'descripción', 'descrição',
        'importo', 'amount', 'importe', 'montant',
        'entrate', 'entradas', 'income', 'revenue',
        'uscite', 'spese', 'expenses', 'gastos',
        'categoria', 'category', 'categoría', 'catégorie'
    ];

    // Scansiona le prime 20 righe per trovare l'intestazione
    for (let i = 0; i < Math.min(20, rows.length); i++) {
        const row = rows[i] || [];
        const rowText = row.map(cell => String(cell || '').toLowerCase()).join(' ');
        
        let keywordCount = 0;
        for (const keyword of headerKeywords) {
            if (rowText.includes(keyword)) {
                keywordCount++;
            }
        }
        
        if (keywordCount >= 2) {
            headerRowIndex = i;
            headerRowContent = row;
            console.log(`✅ Riga intestazione auto-riconosciuta alla riga ${i + 1}:`, headerRowContent);
            break;
        }
    }

    if (headerRowIndex === -1) {
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].some(cell => String(cell || '').trim() !== '')) {
                headerRowIndex = i;
                headerRowContent = rows[i];
                console.log(`⚠️ Nessuna intestazione riconosciuta, uso riga ${i + 1} come intestazione`);
                break;
            }
        }
    }

    if (headerRowIndex === -1) {
        this.showToast('Impossibile trovare riga di intestazione nel file', 'error');
        return { cancelled: true, added: 0, incomes: 0 };
    }

    // Identifichiamo quali colonne sono date e quali sono importi
const headerNames = headerRowContent.map(cell => String(cell || '').toLowerCase());
const dateColumnIndices = [];
const amountColumnIndices = [];

headerNames.forEach((name, index) => {
    const lowerName = name.toLowerCase();
    
    // Colonne data
    if (lowerName.includes('data') || lowerName.includes('date') || 
        lowerName.includes('fecha') || lowerName.includes('datum') ||
        lowerName.includes('data_operazione') || lowerName.includes('data_valuta')) {
        dateColumnIndices.push(index);
    }
    
    // Colonne importo (entrate/uscite)
    if (lowerName.includes('entrate') || lowerName.includes('uscite') ||
        lowerName.includes('importo') || lowerName.includes('amount') ||
        lowerName.includes('income') || lowerName.includes('revenue') ||
        lowerName.includes('expense') || lowerName.includes('gastos') ||
        lowerName.includes('entradas') || lowerName.includes('debit') ||
        lowerName.includes('credit') || lowerName.includes('accrediti') ||
        lowerName.includes('addebiti')) {
        amountColumnIndices.push(index);
    }
});

console.log('📅 Colonne data:', dateColumnIndices);
console.log('💰 Colonne importo:', amountColumnIndices);

   // Crea un CSV virtuale con le righe dall'intestazione in poi
const relevantRows = rows.slice(headerRowIndex);
const allLines = relevantRows.map((row, rowIndex) => 
    row.map((cell, colIndex) => {
        const isDateCol = dateColumnIndices.includes(colIndex);
        const isAmountCol = amountColumnIndices.includes(colIndex);
        return cellToString(cell, isDateCol, isAmountCol);
    }).join('\t')
).join('\n');
    
    const virtualFile = new File(
        [allLines],
        file.name.replace(/\.[^/.]+$/, '') + '_converted.tsv',
        { type: 'text/tab-separated-values' }
    );

    // Mostra il dialogo di mappatura (l'utente può ancora correggere se necessario)
    const mapping = await self.showMappingDialog(virtualFile, '\t', 0, 1); 
    if (!mapping) {
        alert(this.t('importCancelled'));
        return { cancelled: true, added: 0, incomes: 0 };
    }

    // --- Processa i dati ---
    const lines = allLines.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
        alert(this.t('csvEmpty'));
        return { cancelled: true, added: 0, incomes: 0 };
    }

    const dataStartLine = 1;
    
    const importedExpenses = [];
    const tempIncomes = [];

    for (let i = dataStartLine; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split('\t');

        const dateStr = (mapping.dateCol !== -1 && parts[mapping.dateCol]) ? parts[mapping.dateCol].trim() : '';
        const description = (mapping.descCol !== -1 && parts[mapping.descCol]) ? parts[mapping.descCol].trim() : '';
        let amountStr = (mapping.amountCol !== -1 && parts[mapping.amountCol]) ? parts[mapping.amountCol].trim() : '';
        let category = (mapping.categoryCol !== -1 && parts[mapping.categoryCol]) ? parts[mapping.categoryCol].trim() : '';

        if (!dateStr || !description || !amountStr) continue;

        // Pulisci l'importo
        amountStr = amountStr.replace(/,/g, '.').replace(/[^0-9.-]/g, '');
        if (!amountStr) continue;
        
        let amount = parseFloat(amountStr);
        if (isNaN(amount)) continue;

        // Suggerisci categoria se mancante (solo premium)
        let _suggested = null;
        if (!category) {
            if (!this.license?.isFeatureLocked?.('categoryLearning')) {
                const sug = this.suggestCategory(description);
                category = sug.confidence >= this.CATEGORY_CONFIDENCE_THRESHOLD ? sug.category : 'Altro';
                if (sug.confidence > 0 && sug.confidence < this.CATEGORY_CONFIDENCE_THRESHOLD) {
                    _suggested = sug.category;
                }
            } else {
                category = 'Altro';
            }
        }

        if (amount > 0) {
            tempIncomes.push({
                desc: description,
                amount: amount,
                date: dateStr,
                id: Date.now() + i
            });
        } else {
            amount = Math.abs(amount);
            const exp = { 
                name: description, 
                amount: amount, 
                date: dateStr, 
                category: category || 'Altro', 
                id: Date.now() + i 
            };
            if (_suggested) exp._suggested = _suggested;
            importedExpenses.push(exp);
        }
    }

    // Revisione e salvataggio
    let addedExpenses = 0;
    let addedIncomes = 0;

    if (importedExpenses.length > 0) {
        const reviewed = await this.showImportReview(importedExpenses);

        if (reviewed.length > 0) {
            for (const exp of reviewed) {
                if (!this.data.variableExpenses) this.data.variableExpenses = {};
                if (!this.data.variableExpenses[exp.date]) this.data.variableExpenses[exp.date] = [];
                this.data.variableExpenses[exp.date].push({
                    name: exp.name,
                    amount: exp.amount,
                    category: exp.category,
                    id: exp.id
                });
            }
            addedExpenses = reviewed.length;
        } else {
            alert(this.t('importCancelled'));
            return { cancelled: true, added: 0, incomes: 0 };
        }
    }

    if (tempIncomes.length > 0) {
        if (!this.data.incomes) this.data.incomes = [];
        this.data.incomes.push(...tempIncomes);
        addedIncomes = tempIncomes.length;
    }

    if (addedExpenses === 0 && addedIncomes === 0) {
        this.showToast('⚠️ Nessun movimento valido trovato nel file', 'info');
        return { cancelled: false, added: 0, incomes: 0 };
    }

    this.saveData();

// Forza l'aggiornamento del periodo
if (tempIncomes.length > 0) {
    const salaryIncome = tempIncomes.find(inc => this.isSalaryIncome(inc));
    if (salaryIncome) {
        this.data.periodStart = this.normalizeIsoDate(salaryIncome.date);
        this.data.periodEnd = this.addMonthsClamp(this.data.periodStart, 1);
    } else {
        const dates = tempIncomes.map(inc => new Date(inc.date));
        const minDate = new Date(Math.min(...dates));
        this.data.periodStart = minDate.toISOString().split('T')[0];
        this.data.periodEnd = this.addMonthsClamp(this.data.periodStart, 1);
    }
    this.saveData();
}

this.updateUI();
this.updateChart();
this.updateTransactionCount();

    if (addedExpenses > 0) {
        const mostRecent = importedExpenses
            .map(e => this.normalizeIsoDate(e.date))
            .sort()
            .slice(-1)[0];
        const dateInput = document.getElementById('expenseDate');
        if (dateInput && mostRecent) dateInput.value = mostRecent;
        this.updateVariableExpensesList();
    }

    this.showToast(
        this.data.language === 'it'
            ? `✅ Importate ${addedExpenses} spese${addedIncomes ? ` e ${addedIncomes} entrate` : ''}!`
            : `✅ Imported ${addedExpenses} expenses${addedIncomes ? ` and ${addedIncomes} incomes` : ''}!`,
        'success'
    );

    return { cancelled: false, added: addedExpenses, incomes: addedIncomes };
}

    // ========== ONBOARDING GUIDATO ==========
    startOnboarding() {
        if (localStorage.getItem('budgetwise-onboarding-completed') === 'true') return;
        if (!this.isFirstRun()) return;

        const steps = [
            { text: this.t('onboardingStep1'), highlight: "#addIncomeBtn" },
            { text: this.t('onboardingStep2'), highlight: "#addFixedBtn" },
            { text: this.t('onboardingStep3'), highlight: "#addExpenseBtn" },
            { text: this.t('onboardingStep4'), highlight: ".summary-card" },
            { text: this.t('onboardingStep5'), highlight: "#chatInput" },
            { text: this.t('onboardingStep6'), highlight: "#importCsvBtn" }
        ];

        let stepIndex = 0;

        const overlay = document.createElement('div');
        overlay.id = 'onboarding-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
            pointer-events: auto;
        `;

        const card = document.createElement('div');
        card.style.cssText = `
            background: var(--card-bg, #ffffff);
            padding: 30px 25px;
            border-radius: 28px;
            max-width: 450px;
            width: 100%;
            text-align: center;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
            animation: onboardingSlideUp 0.5s ease;
            border: 2px solid var(--accent);
            margin-bottom: 30px;
            box-sizing: border-box;
            pointer-events: auto;
        `;

        card.innerHTML = `
            <div style="font-size: 3.5rem; margin-bottom: 10px;">✨</div>
            <h3 style="margin: 0 0 5px; color: var(--accent); font-size: 2rem; font-weight: 800;">${this.t('onboardingWelcome')}</h3>
            <p style="color: var(--text-secondary); font-size: 1rem; margin-bottom: 25px; opacity: 0.9;">${this.t('onboardingSubtitle')}</p>

            <div style="background: var(--bg-color); padding: 15px; border-radius: 16px; margin-bottom: 25px; border-left: 4px solid var(--accent); text-align: left;">
                <p id="onboarding-description" style="margin: 0; color: var(--text-primary); font-size: 1.1rem; font-weight: 500;"></p>
            </div>

            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-bottom: 14px;">
                <button id="onboarding-next" class="btn-primary" style="padding: 14px 32px; font-size: 1.1rem; border-radius: 50px; min-width: 140px; font-weight: 700;">
                    ${this.t('onboardingNext')}
                </button>
                <button id="onboarding-skip" class="btn-secondary" style="padding: 14px 32px; font-size: 1.1rem; border-radius: 50px; min-width: 140px; background: transparent; border: 2px solid var(--border);">
                    ✕ ${this.t('onboardingSkip')}
                </button>
            </div>

            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-bottom: 14px;">
                <button id="onboarding-demo" class="btn-secondary" style="padding: 12px 20px; border-radius: 50px; min-width: 180px;">
                    ${this.t('onboardingDemo')}
                </button>
                <button id="onboarding-empty" class="btn-text" style="padding: 12px 14px;">
                    ${this.t('onboardingEmpty')}
                </button>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                <span style="font-size: 0.9rem; color: var(--text-secondary); min-width: 40px;"><span id="onboarding-counter" style="font-weight: 700; color: var(--accent);">1</span>/${steps.length}</span>
                <div style="flex: 1; height: 6px; background: var(--border); border-radius: 6px; overflow: hidden;">
                    <div id="onboarding-progress" style="width: ${(1/steps.length)*100}%; height: 100%; background: linear-gradient(90deg, var(--accent-light), var(--accent)); transition: width 0.4s ease;"></div>
                </div>
            </div>
        `;

        overlay.appendChild(card);
        document.body.appendChild(overlay);

        if (!document.getElementById('onboarding-style')) {
            const style = document.createElement('style');
            style.id = 'onboarding-style';
            style.textContent = `
                @keyframes onboardingSlideUp {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .onboarding-highlight {
                    animation: targetGlow 2s infinite !important;
                    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.8), 0 0 30px rgba(124, 58, 237, 0.6) !important;
                }
                @keyframes targetGlow {
                    0% { box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.8), 0 0 30px rgba(124, 58, 237, 0.6); }
                    50% { box-shadow: 0 0 0 8px rgba(124, 58, 237, 1), 0 0 50px rgba(124, 58, 237, 0.9); }
                    100% { box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.8), 0 0 30px rgba(124, 58, 237, 0.6); }
                }
            `;
            document.head.appendChild(style);
        }

        const closeOnboarding = () => {
            localStorage.setItem('budgetwise-onboarding-completed', 'true');
            this.markFirstRunSeen();
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 250);
            document.querySelectorAll('.onboarding-highlight').forEach(el => el.classList.remove('onboarding-highlight'));
        };

        const showStep = () => {
            const step = steps[stepIndex];
            const descEl = document.getElementById('onboarding-description');
            if (descEl) descEl.textContent = step.text;

            const counterEl = document.getElementById('onboarding-counter');
            if (counterEl) counterEl.innerText = String(stepIndex + 1);

            const progress = ((stepIndex + 1) / steps.length) * 100;
            const progressBar = document.getElementById('onboarding-progress');
            if (progressBar) progressBar.style.width = progress + '%';

            document.querySelectorAll('.onboarding-highlight').forEach(el => el.classList.remove('onboarding-highlight'));

            const target = document.querySelector(step.highlight);
            if (target) {
                target.classList.add('onboarding-highlight');
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        const nextBtn = document.getElementById('onboarding-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stepIndex++;
                if (stepIndex < steps.length) showStep();
                else closeOnboarding();
            });
        }

        const skipBtn = document.getElementById('onboarding-skip');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => closeOnboarding());
        }

        const demoBtn = document.getElementById('onboarding-demo');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                this.loadDemoData();
                closeOnboarding();
            });
        }

        const emptyBtn = document.getElementById('onboarding-empty');
        if (emptyBtn) {
            emptyBtn.addEventListener('click', () => closeOnboarding());
        }

        showStep();
    }

    setupVoice() {
        // Blocca in free
        if (!this.checkFreeLimits('voiceRecognition')) {
            const micFixed = document.getElementById('micFixedBtn');
            const voiceBtn = document.getElementById('voiceBtn');
            const chatVoice = document.getElementById('chatVoiceBtn');
            
            if (micFixed) {
                micFixed.disabled = true;
                micFixed.title = '🔒 Funzione Premium';
                micFixed.style.opacity = '0.5';
            }
            if (voiceBtn) {
                voiceBtn.disabled = true;
                voiceBtn.title = '🔒 Funzione Premium';
                voiceBtn.style.opacity = '0.5';
            }
            if (chatVoice) {
                chatVoice.disabled = true;
                chatVoice.title = '🔒 Funzione Premium';
                chatVoice.style.opacity = '0.5';
            }
            return;
        }
        
        console.log('Setup voice...');
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Riconoscimento vocale non supportato');
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) {
                voiceBtn.disabled = true;
                voiceBtn.innerHTML = '🎤 ' + (this.data.language === 'it' ? 'Non supportato' : 'Not supported');
            }
            return;
        }
        console.log('✅ Riconoscimento vocale supportato');
        const micFixed = document.getElementById('micFixedBtn');
        if (micFixed) micFixed.addEventListener('click', () => this.startVoiceInput('fixed'));
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) voiceBtn.addEventListener('click', () => this.startVoiceInput('variable'));
        const chatVoice = document.getElementById('chatVoiceBtn');
        if (chatVoice) chatVoice.addEventListener('click', () => this.startVoiceInput('chat'));
    }

    startVoiceInput(type = 'variable') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        const localeMap = { it: 'it-IT', en: 'en-US', es: 'es-ES', fr: 'fr-FR' };
        recognition.lang = localeMap[this.data.language] || 'it-IT';
        recognition.interimResults = true;

        let button, statusElement;
        let timeoutDuration = 8000;

        if (type === 'fixed') {
            button = document.getElementById('micFixedBtn');
            statusElement = document.getElementById('fixedVoiceStatus');
            timeoutDuration = 15000;
        } else {
            button = document.getElementById('voiceBtn');
            statusElement = document.getElementById('voiceStatus');
        }

        if (!button) return;

        button.classList.add('listening');
        statusElement.textContent = '🎤 ' + this.t('voiceSpeak');

        recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1];
            const transcript = result[0].transcript.trim();
            if (result.isFinal) {
                if (type === 'fixed') this.processFixedVoiceCommand(transcript);
                else this.processVoiceCommand(transcript);
                statusElement.textContent = '🎤 ' + this.t('voiceTap');
            } else {
                statusElement.textContent = `🔊 ${transcript}...`;
            }
        };

        recognition.onerror = () => {
            button.classList.remove('listening');
            statusElement.textContent = '❌ ' + this.t('error');
            setTimeout(() => {
                statusElement.textContent = '🎤 ' + this.t('voiceTap');
            }, 2000);
        };

        recognition.onend = () => {
            button.classList.remove('listening');
        };

        recognition.start();

        setTimeout(() => {
            recognition.stop();
            button.classList.remove('listening');
            statusElement.textContent = '🎤 ' + this.t('voiceTap');
        }, timeoutDuration);
    }

    processVoiceCommand(transcript) {
        const amountMatch = transcript.match(/(\d+[.,]?\d*)/);
        if (amountMatch) {
            const amount = parseFloat(amountMatch[0].replace(',', '.'));
            let description = transcript.replace(amountMatch[0], '').replace(/euro|€|euros/gi, '').trim();
            document.getElementById('expenseName').value = description || (this.data.language === 'it' ? 'Spesa' : 'Expense');
            document.getElementById('expenseAmount').value = amount;
            alert(this.t('voiceDetected', { desc: (description || this.t('genericExpense')), amount: amount }));
        }
    }

    processFixedVoiceCommand(transcript) {
        const words = transcript.split(' ');
        let name = words[0] || (this.data.language === 'it' ? 'Spesa' : 'Expense');
        if (name.length > 20) name = name.substring(0, 20);
        const amountMatch = transcript.match(/(\d+[.,]?\d*)/);
        const amount = amountMatch ? parseFloat(amountMatch[0].replace(',', '.')) : 0;
        const dayMatch = transcript.match(/(\d{1,2})/g);
        let day = 1;
        if (dayMatch && dayMatch.length > 0) {
            for (let d of dayMatch) {
                const candidate = parseInt(d);
                if (candidate >= 1 && candidate <= 31 && candidate !== Math.round(amount)) {
                    day = candidate;
                    break;
                }
            }
        }
        const dateMatch = transcript.match(/(\d{1,2})[\/\s](\d{1,2})[\/\s](\d{4})/);
        let endDate = '';
        if (dateMatch) {
            endDate = `${dateMatch[3]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`;
        } else {
            const d = new Date();
            d.setFullYear(d.getFullYear() + 10);
            endDate = d.toISOString().split('T')[0];
        }
        document.getElementById('fixedName').value = name;
        document.getElementById('fixedAmount').value = amount;
        document.getElementById('fixedDay').value = day;
        document.getElementById('fixedEndDate').value = endDate;
        alert(this.t('voiceFixedDetected', { name, amount: amount, day }));
    }

    // ========== AI WIDGET ==========
generateAiSuggestion() {
    const suggestions = [];
    const language = this.data.language;
    
    const categoryTotals = {};
    if (this.data.variableExpenses && typeof this.data.variableExpenses === 'object') {
        Object.values(this.data.variableExpenses).forEach(day => {
            if (Array.isArray(day)) {
                day.forEach(exp => {
                    const cat = exp.category || 'Altro';
                    categoryTotals[cat] = (categoryTotals[cat] || 0) + (exp.amount || 0);
                });
            }
        });
    }

    if (Object.keys(categoryTotals).length === 0) {
        document.getElementById('aiWidget').style.display = 'none';
        return;
    }

    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    const topCatName = topCategory[0];

    if (topCategory[1] > 100) {
        const reduction = Math.round(topCategory[1] * 0.1);
        suggestions.push({
            message: this.t('aiSuggestionReduce', {
                amount: this.formatCurrency(topCategory[1]),
                category: topCatName,
                reduction: this.formatCurrency(reduction)
            }),
            action: this.t('aiActionSetGoal'),
            actionType: 'reduce',
            category: topCategory[0],
            amount: reduction
        });
    }

    if (categoryTotals.Trasporti && categoryTotals.Trasporti > 50) {
        const potentialSave = Math.round(categoryTotals.Trasporti * 0.2);
        suggestions.push({
            message: this.t('aiSuggestionTransport', {
                amount: this.formatCurrency(categoryTotals.Trasporti),
                potential: this.formatCurrency(potentialSave)
            }),
            action: this.t('aiActionLearnHow'),
            actionType: 'transport',
            amount: potentialSave
        });
    }

    if (categoryTotals.Svago && categoryTotals.Svago > 80) {
        const potentialSave = Math.round(categoryTotals.Svago * 0.15);
        suggestions.push({
            message: this.t('aiSuggestionLeisure', {
                amount: this.formatCurrency(categoryTotals.Svago),
                potential: this.formatCurrency(potentialSave)
            }),
            action: this.t('aiActionPlan'),
            actionType: 'leisure',
            amount: potentialSave
        });
    }

    if (suggestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * suggestions.length);
        this.showAiSuggestion(suggestions[randomIndex]);
    } else {
        document.getElementById('aiWidget').style.display = 'none';
    }
}

    showAiSuggestion(suggestion) {
        const widget = document.getElementById('aiWidget');
        const messageEl = document.getElementById('aiMessage');
        const actionEl = document.getElementById('aiAction');
        const actionBtn = document.getElementById('applyAiSuggestion');
        
        messageEl.textContent = suggestion.message;
        actionBtn.textContent = suggestion.action;
        
        actionBtn.dataset.type = suggestion.actionType;
        actionBtn.dataset.amount = suggestion.amount || 0;
        actionBtn.dataset.category = suggestion.category || '';
        
        widget.style.display = 'block';
        actionEl.style.display = 'flex';
    }

    setupAiActions() {
        const applyBtn = document.getElementById('applyAiSuggestion');
        const dismissBtn = document.getElementById('dismissAiSuggestion');
        const aiAction = document.getElementById('aiAction');
        const aiWidget = document.getElementById('aiWidget');

        if (!applyBtn) return;

        const cleanApplyBtn = applyBtn.cloneNode(true);
        applyBtn.parentNode.replaceChild(cleanApplyBtn, applyBtn);

        if (dismissBtn) {
            const cleanDismissBtn = dismissBtn.cloneNode(true);
            dismissBtn.parentNode.replaceChild(cleanDismissBtn, dismissBtn);
            cleanDismissBtn.addEventListener('click', () => {
                if (aiWidget) aiWidget.style.display = 'none';
            });
        }

        cleanApplyBtn.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.type || '';
            const amount = parseFloat(e.currentTarget.dataset.amount || '0');

            const bumpGoal = (extra) => {
                const currentGoal = this.data.savingsGoal || 0;
                const newGoal = currentGoal + (extra || 0);
                const goalInput = document.getElementById('saveGoal');
                if (goalInput) goalInput.value = newGoal;

                this.showToast(
                    this.data.language === 'it'
                        ? `🎯 Obiettivo aumentato a ${this.formatCurrency(newGoal)}`
                        : `🎯 Goal increased to ${this.formatCurrency(newGoal)}`,
                    'success'
                );
            };

            if (type === 'reduce' && amount > 0) {
                bumpGoal(amount);
            } else if (type === 'transport' && amount > 0) {
                const message = this.data.language === 'it'
                    ? `🚗 Prova a usare mezzi pubblici o car pooling per risparmiare ${this.formatCurrency(amount)} al mese. Vuoi fissare un obiettivo?`
                    : `🚗 Try using public transport or car pooling to save ${this.formatCurrency(amount)} per month. Want to set a goal?`;

                if (confirm(message)) bumpGoal(amount);
            } else if (type === 'leisure' && amount > 0) {
                const message = this.data.language === 'it'
                    ? `🎮 Limitando le uscite a 2 a settimana, potresti risparmiare ${this.formatCurrency(amount)}. Vuoi fissare un obiettivo?`
                    : `🎮 Limiting to 2 outings per week could save you ${this.formatCurrency(amount)}. Want to set a goal?`;

                if (confirm(message)) bumpGoal(amount);
            } else {
                this.showToast(this.t('featureInDev'), 'info');
            }

            if (aiAction) aiAction.style.display = 'none';
            setTimeout(() => {
                if (aiWidget) aiWidget.style.display = 'none';
            }, 2000);
        });
    }
}

// ============================================
// INIZIALIZZAZIONE - UNA SOLA VOLTA
// ============================================

// Rendi l'app accessibile globalmente
window.BudgetWiseApp = null;

function initApp() {
    try {
        window.BudgetWiseApp = new BudgetWise();
        window.appInitialized = true;
        // Rende disponibile anche 'app' per comodità
        window.app = window.BudgetWiseApp;
        console.log('✅ BudgetWise inizializzato correttamente');
        console.log('👉 Nella console puoi usare: window.app o window.BudgetWiseApp');
    } catch (error) {
        console.error('❌ Errore inizializzazione:', error);
    }
}

// Assicuriamoci che l'app venga inizializzata una sola volta
if (!window.appInitialized) {
    console.log('🚀 Avvio BudgetWise...');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        // Piccolo ritardo per garantire che tutto sia caricato
        setTimeout(initApp, 100);
    }
}

// ============================================
// GESTIONE IMPORT CSV/EXCEL (UNA SOLA VOLTA)
// ============================================
function setupImportHandlers() {
    const btn = document.getElementById('importCsvBtn');
    const fileInput = document.getElementById('csvFile');
    const fileNameSpan = document.getElementById('csvFileName');
    const skipRowsInput = document.getElementById('skipRows');
    const headerRowInput = document.getElementById('headerRowManual');
    const sheetSelect = document.getElementById('excelSheet');
    const excelHeaderSelect = document.getElementById('excelHeaderRow');
    const advancedToggle = document.getElementById('importAdvancedToggle');
    const advancedWrap = document.getElementById('importAdvanced');
    
    if (!btn || !fileInput || !window.app) {
        console.error('Elementi import non trovati');
        return;
    }

    // Variabile per tenere traccia del file Excel in attesa
    window._pendingExcelFile = null;

            // Toggle opzioni avanzate (default: nascoste)
    if (advancedToggle && advancedWrap) {
        // Rimuovi eventuali listener precedenti
        advancedToggle.replaceWith(advancedToggle.cloneNode(true));
        const newAdvancedToggle = document.getElementById('importAdvancedToggle');
        
        // Imposta il testo iniziale in base alla lingua corrente
        newAdvancedToggle.textContent = window.app ? window.app.t('advancedOptions') : '⚙️ Opzioni avanzate';
        
        newAdvancedToggle.addEventListener('click', () => {
            const isOpen = advancedWrap.style.display !== 'none';
            advancedWrap.style.display = isOpen ? 'none' : 'block';
            // Usa la traduzione corretta in base allo stato
            newAdvancedToggle.textContent = isOpen 
                ? (window.app ? window.app.t('advancedOptions') : '⚙️ Opzioni avanzate')
                : (window.app ? window.app.t('hideOptions') : '✕ Nascondi opzioni');
        });
    }
    
    // Gestione cambio file
    fileInput.replaceWith(fileInput.cloneNode(true));
    const newFileInput = document.getElementById('csvFile');
    
    newFileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        fileNameSpan.textContent = file.name;
        
        const fileExt = file.name.split('.').pop().toLowerCase();
        const isExcel = ['xls', 'xlsx'].includes(fileExt);
        
        if (isExcel) {
            if (sheetSelect) {
                sheetSelect.innerHTML = '<option value="">Caricamento...</option>';
                sheetSelect.disabled = true;
            }
            
            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        
                        if (sheetSelect) {
                            sheetSelect.innerHTML = workbook.SheetNames.map((name, index) => 
                                `<option value="${index}">${index+1}. ${name}</option>`
                            ).join('');
                            sheetSelect.disabled = false;
                            sheetSelect.value = '0';
                        }
                        
                        window._pendingExcelFile = file;
                        
                    } catch (err) {
                        alert('❌ Errore nella lettura del file Excel: ' + err.message);
                    }
                };
                reader.readAsArrayBuffer(file);
                
            } catch (error) {
                alert('❌ Errore nella lettura del file Excel: ' + error.message);
            }
        } else {
            if (sheetSelect) {
                sheetSelect.innerHTML = '<option value="">Carica un file Excel</option>';
                sheetSelect.disabled = true;
            }
            window._pendingExcelFile = null;
        }
    });

    // Gestione click pulsante Importa
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', async function() {
        const file = newFileInput.files[0];
        const pendingFile = window._pendingExcelFile;
        
        if (!file && !pendingFile) {
            // Apri il file picker se non è stato selezionato niente
            newFileInput.click();
            return;
        }
        
        const fileToImport = pendingFile || file;
        const fileExt = fileToImport.name.split('.').pop().toLowerCase();
        const isExcel = ['xls', 'xlsx'].includes(fileExt);
        
        try {
            if (isExcel) {
                const sheetIndex = (sheetSelect && !sheetSelect.disabled && sheetSelect.value !== '')
                    ? parseInt(sheetSelect.value)
                    : 0;
                const headerRow = excelHeaderSelect
                    ? parseInt(excelHeaderSelect.value || '-1')
                    : -1;
                
                newBtn.textContent = '⏳ Importazione...';
                newBtn.disabled = true;
                
                await window.app.parseExcel(fileToImport, sheetIndex, headerRow);
                
                window._pendingExcelFile = null;
                newFileInput.value = '';
                fileNameSpan.textContent = 'Nessun file selezionato';
                if (sheetSelect) {
                    sheetSelect.innerHTML = '<option value="">Carica un file Excel</option>';
                    sheetSelect.disabled = true;
                }
                
            } else {
                const delimiter = document.getElementById('csvSeparator').value;
                const dateFormat = document.getElementById('csvDelimiter').value;
                const skipRows = parseInt(skipRowsInput?.value || '0');
                const headerRow = parseInt(headerRowInput?.value || '1');
                
                newBtn.textContent = '⏳ Importazione...';
                newBtn.disabled = true;
                
                await window.app.parseCSV(fileToImport, delimiter, dateFormat, skipRows, headerRow);
                
                newFileInput.value = '';
                fileNameSpan.textContent = 'Nessun file selezionato';
            }
            
        } catch (error) {
            alert('❌ Errore durante l\'import: ' + (error?.message || String(error)));
            console.error(error);
        } finally {
            try {
                newBtn.innerHTML = window.app?.t ? window.app.t('csvImportBtn') : '📥 Importa CSV / Excel';
            } catch {
                newBtn.textContent = '📥 Importa CSV / Excel';
            }
            newBtn.disabled = false;
        }
    });
    
    // ========== METODI PREMIUM ==========
    if (window.app && !window.app.premiumSetupDone) {
        window.app.updateLicenseStatus = () => {
            if (!window.app.license) {
                console.warn('⚠️ License system non disponibile');
                return;
            }
            
            const licenseStatus = document.getElementById('licenseStatus');
            if (!licenseStatus) return;
            
            const planInfo = window.app.license.getPlanInfo();
            
            const badge = licenseStatus.querySelector('.license-badge');
            if (badge) {
                licenseStatus.className = `license-status ${planInfo.name.toLowerCase()}`;
                badge.textContent = planInfo.name;
            }
        };

        window.app.showPremiumModal = () => {
            const modal = document.getElementById('premiumModal');
            if (modal) {
                modal.style.display = 'flex';
                modal.classList.add('active');
            }
        };

        window.app.hidePremiumModal = () => {
            const modal = document.getElementById('premiumModal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
            }
        };

        window.app.showLicenseModal = () => {
            window.app.hidePremiumModal();
            const modal = document.getElementById('licenseModal');
            if (modal) {
                modal.style.display = 'flex';
                modal.classList.add('active');
            }
        };

        window.app.hideLicenseModal = () => {
            const modal = document.getElementById('licenseModal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
            }
        };

        window.app.startTrial = async () => {
            if (window.app.license.startTrial()) {
                window.app.showToast('🎁 Prova Premium attivata! 7 giorni gratuiti');
                window.app.updateLicenseStatus();
                window.app.hidePremiumModal();
                window.app.enablePremiumFeatures();
            } else {
                window.app.showToast('⚠️ Prova già utilizzata');
            }
        };

        window.app.activateLicense = async () => {
            const email = document.getElementById('licenseEmail').value;
            const key = document.getElementById('licenseKey').value;
            
            if (!email || !key) {
                window.app.showToast('⚠️ Compila tutti i campi');
                return;
            }
            
            if (await window.app.license.activateLicense(email, key)) {
                window.app.showToast('✅ Licenza Premium attivata!');
                window.app.updateLicenseStatus();
                window.app.hideLicenseModal();
                window.app.enablePremiumFeatures();
            } else {
                window.app.showToast('❌ Licenza non valida');
            }
        };

        window.app.enablePremiumFeatures = () => {
            document.querySelectorAll('.feature-locked').forEach(el => {
                el.classList.remove('feature-locked');
            });
            
            const banner = document.getElementById('premiumBanner');
            if (banner) {
                banner.style.display = 'block';
            }
            
            // Ricarica UI per sbloccare feature
            window.app.applyFreeLimitsToUI();
        };

        window.app.showPremiumBannerIfNeeded = () => {
            if (!window.app.license) {
                console.warn('⚠️ License system non disponibile - banner non mostrato');
                return;
            }
            
            const banner = document.getElementById('premiumBanner');
            if (banner && !window.app.license.hasFullPremiumAccess()) {
                banner.style.display = 'block';
            }
        };

        window.app.setupPremiumEventListeners = () => {
            // Upgrade button
            const upgradeBtn = document.getElementById('upgradeBtn');
            if (upgradeBtn) {
                upgradeBtn.replaceWith(upgradeBtn.cloneNode(true));
                const newUpgradeBtn = document.getElementById('upgradeBtn');
                newUpgradeBtn.addEventListener('click', () => window.app.showPremiumModal());
            }
            
            // Premium modal buttons
            const startTrialBtn = document.getElementById('startTrialBtn');
            if (startTrialBtn) {
                startTrialBtn.replaceWith(startTrialBtn.cloneNode(true));
                const newStartTrialBtn = document.getElementById('startTrialBtn');
                newStartTrialBtn.addEventListener('click', () => window.app.startTrial());
            }
            
            const activateLicenseBtn = document.getElementById('activateLicenseBtn');
            if (activateLicenseBtn) {
                activateLicenseBtn.replaceWith(activateLicenseBtn.cloneNode(true));
                const newActivateLicenseBtn = document.getElementById('activateLicenseBtn');
                newActivateLicenseBtn.addEventListener('click', () => window.app.showLicenseModal());
            }
            
            const closePremiumBtn = document.getElementById('closePremiumBtn');
            if (closePremiumBtn) {
                closePremiumBtn.replaceWith(closePremiumBtn.cloneNode(true));
                const newClosePremiumBtn = document.getElementById('closePremiumBtn');
                newClosePremiumBtn.addEventListener('click', () => window.app.hidePremiumModal());
            }
            
            // License modal buttons
            const confirmLicenseBtn = document.getElementById('confirmLicenseBtn');
            if (confirmLicenseBtn) {
                confirmLicenseBtn.replaceWith(confirmLicenseBtn.cloneNode(true));
                const newConfirmLicenseBtn = document.getElementById('confirmLicenseBtn');
                newConfirmLicenseBtn.addEventListener('click', () => window.app.activateLicense());
            }
            
            const cancelLicenseBtn = document.getElementById('cancelLicenseBtn');
            if (cancelLicenseBtn) {
                cancelLicenseBtn.replaceWith(cancelLicenseBtn.cloneNode(true));
                const newCancelLicenseBtn = document.getElementById('cancelLicenseBtn');
                newCancelLicenseBtn.addEventListener('click', () => window.app.hideLicenseModal());
            }
        };

        window.app.setupPremiumSystem = () => {
            window.app.updateLicenseStatus();
            window.app.setupPremiumEventListeners();
            window.app.showPremiumBannerIfNeeded();
            window.app.premiumSetupDone = true;
        };

        // Avvia Premium system
        setTimeout(() => {
            if (window.app && typeof window.app.setupPremiumSystem === "function") {
                window.app.setupPremiumSystem();
            }
        }, 150);
    }
}

// Esegui setup dopo l'inizializzazione dell'app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImportHandlers);
} else {
    setTimeout(setupImportHandlers, 100);
}
