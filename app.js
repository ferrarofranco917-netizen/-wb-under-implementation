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
                wisescoreTitle: "WiseScore™",
                wisescoreTimeline: "Andamento WiseScore",
                pillarStability: "Stabilità",
                pillarDiscipline: "Disciplina",
                pillarResilience: "Resilienza",
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
                    csvImport: '❌ Importazione CSV',
                    aiAssistant: '❌ Assistente AI',
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
                wisescoreTitle: "WiseScore™",
                wisescoreTimeline: "WiseScore trend",
                pillarStability: "Stability",
                pillarDiscipline: "Discipline",
                pillarResilience: "Resilience",
                upgradeBanner: '🚀 Upgrade to Premium',
                upgradeBannerText: 'Unlock unlimited features and AI assistant!',
                upgrade: 'Upgrade',
                free: '🆓 Free',
                premium: '💎 Premium',
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
                    csvImport: '❌ CSV Import',
                    aiAssistant: '❌ AI Assistant',
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
                // (Qui dovresti inserire le tue traduzioni spagnole complete, per brevità le ometto ma nel file finale vanno incluse)
            },
            fr: {
                // (Qui dovresti inserire le tue traduzioni francesi complete, per brevità le ometto ma nel file finale vanno incluse)
            }
        };

        // === Report overlay i18n (safety net) ===
        try {
            this.translations = this.translations || {};
            this.translations.it = this.translations.it || {};
            if (!this.translations.it.reportTitle) this.translations.it.reportTitle = 'Report Premium';
            if (!this.translations.it.reportDownloadPdf) this.translations.it.reportDownloadPdf = '⬇️ PDF';
            if (!this.translations.it.print) this.translations.it.print = 'Stampa';
            this.translations.en = this.translations.en || {};
            if (!this.translations.en.reportTitle) this.translations.en.reportTitle = 'Premium Report';
            if (!this.translations.en.reportDownloadPdf) this.translations.en.reportDownloadPdf = '⬇️ PDF';
            if (!this.translations.en.print) this.translations.en.print = 'Print';
        } catch(e) {}

        this.init();
    }

    // ========== INIZIALIZZAZIONE SISTEMA LICENZE ==========
    initializeLicenseSystem() {
        if (typeof BudgetWiseLicense !== 'undefined') {
            this.license = new BudgetWiseLicense();
            console.log('✅ Sistema licenze inizializzato correttamente');
        } else {
            console.warn('⚠️ BudgetWiseLicense non disponibile, uso fallback');
            this.license = {
                isPremium: true,
                hasFullPremiumAccess: () => true,
                getCurrentLimits: () => ({
                    maxTransactions: Infinity,
                    maxFixedExpenses: Infinity,
                    maxSavingsPercent: 50,
                    maxGoals: Infinity,
                    customCategories: true,
                    csvImport: true,
                    aiAssistant: 'advanced',
                    voiceRecognition: true,
                    cloudSync: false,
                    colorCustomization: true,
                    dateFormatCustom: true,
                    calendarExport: true,
                    categoryLearning: true,
                    advancedFixedFormat: true
                }),
                canUseFeature: () => true,
                getMaxSavingsPercent: () => 50,
                getUpgradeMessage: () => '',
                isFeatureLocked: () => false
            };
        }
        try {
            this.updateUI();
            this.applyLanguage();
            this.updateChart();
        } catch (e) {
            console.warn('UI refresh after license init skipped:', e);
        }
    }

    // ========== SISTEMA LIMITI FREE/PREMIUM ==========
    calculateMonthlyTransactions() {
        let count = 0;
        if (this.data.variableExpenses) {
            Object.values(this.data.variableExpenses).forEach(day => {
                count += day?.length || 0;
            });
        }
        count += this.data.fixedExpenses?.length || 0;
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
        const message = this.license?.getUpgradeMessage?.(feature) || 'Questa funzionalità è disponibile nella versione Premium! 💎';
        const prompt = document.createElement('div');
        prompt.className = 'upgrade-prompt';
        prompt.innerHTML = `
            <h4>🔒 Versione Free</h4>
            <p>${message}</p>
            <button onclick="window.app?.showPremiumModal()">💎 Scopri Premium</button>
        `;
        const container = document.querySelector('.container');
        if (container) {
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
        if (isFree) {
            if (!limits.customCategories) {
                document.querySelectorAll('[data-premium="custom-categories"], #manageCategoriesBtn, #categoryManagerOverlay').forEach(el => {
                    if (el) el.classList.add('feature-locked');
                });
            }
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
            if (!limits.csvImport) {
                const importSection = document.querySelector('[data-tab="tools"] .section-card:has(#csvTitle)');
                if (importSection) {
                    importSection.classList.add('feature-locked');
                }
            }
            if (!limits.colorCustomization) {
                const colorSection = document.querySelector('[data-tab="tools"] .section-card:has(#colorsTitle)');
                if (colorSection) {
                    colorSection.classList.add('feature-locked');
                }
                document.querySelectorAll('#colorAccent, #colorAccentLight, #colorCardBg, #colorTextPrimary, #colorTextSecondary, #colorBg, #colorSuccess, #colorDanger, #colorWarning, #colorBorder, #resetColorsBtn').forEach(el => {
                    if (el) el.disabled = true;
                });
            }
            if (!limits.advancedFixedFormat) {
                const monthsRadio = document.getElementById('dateFormatMonths');
                if (monthsRadio) {
                    monthsRadio.disabled = true;
                    const monthsLabel = document.querySelector('label[for="dateFormatMonths"]');
                    if (monthsLabel) monthsLabel.classList.add('feature-locked-sm');
                }
            }
            if (!limits.calendarExport) {
                const exportBtn = document.getElementById('exportCalendarBtn');
                if (exportBtn) {
                    exportBtn.disabled = true;
                    exportBtn.title = '🔒 Funzione Premium';
                }
            }
            const savePercentSlider = document.getElementById('savePercent');
            if (savePercentSlider) {
                savePercentSlider.max = limits.maxSavingsPercent;
            }
        }
    }

    init() {
        this.initializeLicenseSystem();
        this.loadData();
        this.setupEventListeners();
        this.applyTheme();
        if (localStorage.getItem('budgetwise-custom-colors')) {
            this.applyCustomColors();
        } else {
            this.clearThemeInlineOverrides();
        }
        this.initReportBindings();
        this.setupColorPickers();
        this.updateUI();
        this.updateChart();
        this.setupVoice();
        this.applyLanguage();
        this.startOnboarding();
        this.updateAllCategorySelects();
        this.initTabs();
        this.applyFreeLimitsToUI();

        const toggle = document.getElementById('showAllExpensesToggle');
        if (toggle) toggle.checked = !!this.showAllExpenses;
        try { this.renderWiseScoreHome(); } catch(e) { console.warn('WiseScore Home render skipped', e); }
        this.populateCategoryFilter();
    }

    getDefaultPeriodStart() {
        const salary = this.findLastSalaryIncome();
        if (salary && salary.date) return this.normalizeIsoDate(salary.date);
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    getDefaultPeriodEnd() {
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

    parseMoney(value) {
        if (typeof value === 'number' && isFinite(value)) return value;
        if (value === null || value === undefined) return 0;
        let s = String(value).trim();
        if (!s) return 0;
        s = s.replace(/\s/g, '');
        if (s.includes('.') && s.includes(',')) {
            s = s.replace(/\./g, '').replace(',', '.');
        } else if (s.includes(',') && !s.includes('.')) {
            s = s.replace(',', '.');
        }
        s = s.replace(/[^0-9.\-]/g, '');
        const n = parseFloat(s);
        return isFinite(n) ? n : 0;
    }

    isSalaryIncome(inc) {
        if (!inc) return false;
        const desc = String(inc.desc || '').toLowerCase();
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
        const lastSalary = this.findLastSalaryIncome();
        if (lastSalary && lastSalary.date) {
            const start = this.normalizeIsoDate(lastSalary.date);
            const nextSalary = this.addMonthsClamp(start, 1);
            this.data.periodStart = start;
            this.data.periodEnd = nextSalary;
            console.log('📅 Periodo basato su stipendio:', start, '→', nextSalary);
            return;
        }
        if (this.data.incomes && this.data.incomes.length > 0) {
            const sorted = [...this.data.incomes].sort((a, b) => new Date(a.date) - new Date(b.date));
            const start = this.normalizeIsoDate(sorted[0].date);
            const nextSalary = this.addMonthsClamp(start, 1);
            this.data.periodStart = start;
            this.data.periodEnd = nextSalary;
            console.log('📅 Periodo basato su prima entrata:', start, '→', nextSalary);
            return;
        }
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
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;
            const val = this.t(key);
            const tag = (el.tagName || '').toUpperCase();
            if ((tag === 'INPUT' || tag === 'TEXTAREA') && el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', val);
                return;
            }
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
        const categorySelect = document.getElementById('expenseCategory');
        if (categorySelect) {
            const categories = [
                { value: 'Alimentari', key: 'categoryAlimentari' },
                { value: 'Trasporti', key: 'categoryTrasporti' },
                { value: 'Altro', key: 'categoryAltro' },
                { value: 'Svago', key: 'categorySvago' },
                { value: 'Salute', key: 'categorySalute' },
                { value: 'Abbigliamento', key: 'categoryAbbigliamento' }
            ];
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
        const tabButtons = document.querySelectorAll('.tab-btn');
        if (tabButtons.length >= 5) {
            tabButtons[0].textContent = this.t('tabHome');
            tabButtons[1].textContent = this.t('tabIncomes');
            tabButtons[2].textContent = this.t('tabFixed');
            tabButtons[3].textContent = this.t('tabVariable');
            tabButtons[4].textContent = this.t('tabTools');
        }
        const skipRowsLabel = document.getElementById('skipRowsLabel');
        if (skipRowsLabel) skipRowsLabel.textContent = this.t('skipRowsLabel');
        const headerRowManualLabel = document.getElementById('headerRowManualLabel');
        if (headerRowManualLabel) headerRowManualLabel.textContent = this.t('headerRowManualLabel');
        const skipHelp = document.getElementById('skipHelp');
        if (skipHelp) skipHelp.textContent = this.t('skipHelp');

        // NUOVE TRADUZIONI AGGIUNTIVE
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
        const fixedDaysLabel = document.querySelector('label[for="dateFormatDays"] span');
        if (fixedDaysLabel) fixedDaysLabel.textContent = this.t('fixedDateFormatDays');
        const fixedMonthsLabel = document.querySelector('label[for="dateFormatMonths"] span');
        if (fixedMonthsLabel) fixedMonthsLabel.textContent = this.t('fixedDateFormatMonths');
        const helpText = document.getElementById('fixedDateFormatHelp');
        if (helpText) helpText.textContent = this.t('fixedDateFormatHelp');
        const backupLabel = document.getElementById('backupLabel');
        if (backupLabel) backupLabel.textContent = this.t('backupLabel');
        const backupBtn = document.getElementById('backupBtn');
        if (backupBtn) backupBtn.innerHTML = this.t('backupButton');
        const restoreBtn = document.getElementById('restoreBtn');
        if (restoreBtn) restoreBtn.innerHTML = this.t('restoreButton');
        const searchInput = document.getElementById('searchExpenses');
        if (searchInput) searchInput.placeholder = this.t('searchPlaceholder');
        const allCategoriesOption = document.querySelector('#searchCategory option[value="all"]');
        if (allCategoriesOption) allCategoriesOption.textContent = this.t('allCategories');
        const resetSearchBtn = document.getElementById('resetSearchBtn');
        if (resetSearchBtn) resetSearchBtn.innerHTML = this.t('clearFilters');
        const savingsPotLabel = document.getElementById('savingsPotLabel');
        if (savingsPotLabel) savingsPotLabel.textContent = this.t('savingsPotLabel');
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
        const closePremiumBtn = document.getElementById('closePremiumBtn');
        if (closePremiumBtn) {
            closePremiumBtn.innerHTML = `✕ ${this.t('maybeLater')}`;
        }
        const addCategoryBtnText = document.getElementById('addCategoryBtnText');
        if (addCategoryBtnText) {
            addCategoryBtnText.textContent = this.t('add');
        }
        const excelHeaderSelectEl = document.getElementById('excelHeaderRow');
        if (excelHeaderSelectEl) {
            const options = excelHeaderSelectEl.options;
            if (options.length >= 4) {
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === "-1") {
                        options[i].text = this.t('rowNone');
                    }
                }
            }
        }
        const excelSheetPlaceholderOption = document.querySelector('#excelSheet option[value=""]');
        if (excelSheetPlaceholderOption) excelSheetPlaceholderOption.textContent = this.t('excelSheetPlaceholder');
        const excelHelpElement = document.getElementById('excelHelp');
        if (excelHelpElement) excelHelpElement.textContent = this.t('excelHelp');
        const backupButtonElement = document.getElementById('backupBtn');
        if (backupButtonElement) backupButtonElement.innerHTML = this.t('backupButton');
        const restoreButtonElement = document.getElementById('restoreBtn');
        if (restoreButtonElement) restoreButtonElement.innerHTML = this.t('restoreButton');
        const aiWidgetTitleElement = document.getElementById('aiWidgetTitle');
        if (aiWidgetTitleElement) aiWidgetTitleElement.textContent = this.t('aiSuggestionsTitle');
        const aiWidgetBadgeElement = document.getElementById('aiWidgetBadge');
        if (aiWidgetBadgeElement) aiWidgetBadgeElement.textContent = this.t('aiSmartBadge');
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

    calculateTotalIncome() {
        if (!this.data.incomes || !Array.isArray(this.data.incomes)) return 0;
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
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

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
        if (candidates.length === 1) return candidates[0];
        if (tokens.length > 0) {
            const best = candidates.find(c => {
                const cn = this.normalizeMatchText(c.name);
                return tokens.some(t => cn.includes(t));
            });
            if (best) return best;
        }
        candidates.sort((a, b) => {
            const ad = new Date(this.normalizeIsoDate(a.date));
            const bd = new Date(this.normalizeIsoDate(b.date));
            return Math.abs(ad - occDate) - Math.abs(bd - occDate);
        });
        return candidates[0];
    }

    calculateTotalFixedExpensesUnpaid() {
        if (!this.data.fixedExpenses || !Array.isArray(this.data.fixedExpenses)) return 0;
        const start = new Date(this.normalizeIsoDate(this.data.periodStart));
        const end = new Date(this.normalizeIsoDate(this.data.periodEnd));
        if ([start, end].some(d => isNaN(d.getTime()))) return 0;
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
                } else {
                    total += (exp.amount || 0);
                }
            }
        }
        return total;
    }

    getFixedOccurrencesInPeriod() {
        if (!this.data.fixedExpenses || !Array.isArray(this.data.fixedExpenses)) return [];
        const start = new Date(this.normalizeIsoDate(this.data.periodStart));
        const end = new Date(this.normalizeIsoDate(this.data.periodEnd));
        if ([start, end].some(d => isNaN(d.getTime()))) return [];
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
            const paidIcon = o.paid ? '✅ ' : '';
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
                </div>
            `;
        }).join('');
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
        const remaining = this.calculateRemaining();
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

    addIncome() {
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

    addFixedExpense() {
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

    addVariableExpense() {
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
        if (!this.checkFreeLimits('savePercent', percent)) {
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

    updateSavingsWidget() {
        const percent = this.data.savingsPercent || 0;
        const goal = this.data.savingsGoal || 0;
        const currentSavings = this.data.savingsPot || 0;
        const maxPercent = this.license?.getMaxSavingsPercent?.() || 15;
        if (!this.license?.hasFullPremiumAccess?.() && percent > maxPercent) {
            this.data.savingsPercent = maxPercent;
        }
        const slider = document.getElementById('savePercent');
        const percentageValue = document.getElementById('percentageValue');
        if (slider && percentageValue) {
            slider.value = this.data.savingsPercent;
            percentageValue.textContent = this.data.savingsPercent + '%';
        }
        const goalInput = document.getElementById('saveGoal');
        const potInput = document.getElementById('savingsPotInput');
        if (goalInput) goalInput.value = goal || '';
        if (potInput) potInput.value = currentSavings || '';
        this.updateSavingsMessages(this.data.savingsPercent, goal, currentSavings);
        this.updateProgressRing(currentSavings, goal);
    }

    updateSavingsMessages(percent, goal, currentSavings) {
        if (!goal || goal <= 0) return;
        const monthlyIncome = this.calculateAverageMonthlyIncome();
        if (monthlyIncome <= 0) return;
        const monthlySavings = (monthlyIncome * percent) / 100;
        const remaining = goal - currentSavings;
        const monthsToGoal = monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : Infinity;
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + monthsToGoal);
        const currentLang = this.data.language || 'it';
        const locale = LOCALE_MAP[currentLang] || 'it-IT';
        const dateStr = targetDate.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
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
        const slider = document.getElementById('savePercent');
        const percentageValue = document.getElementById('percentageValue');
        if (slider && percentageValue) {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                percentageValue.textContent = value + '%';
                if (!this.checkFreeLimits('savePercent', parseFloat(value))) {
                    slider.value = this.data.savingsPercent;
                    percentageValue.textContent = this.data.savingsPercent + '%';
                    return;
                }
                this.data.savingsPercent = parseFloat(value);
                this.updateSavingsWidget();
            });
        }
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

    initReportBindings() {
        if (this._reportBindingsDone) return;
        this._reportBindingsDone = true;
        const bind = () => {
            document.addEventListener('click', (e) => {
                const open = e.target.closest('#openReport');
                if (open) {
                    e.preventDefault();
                    this.openReport?.();
                    return;
                }
                const close = e.target.closest('#closeReport');
                if (close) {
                    e.preventDefault();
                    this.closeReport?.();
                    return;
                }
                const printBtn = e.target.closest('#printReport');
                if (printBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                    this.printReport?.();
                    return;
                }
                const dl = e.target.closest('#downloadReportPdf');
                if (dl) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                    this.downloadReportPdf?.();
                    return;
                }
            }, { passive: false });
            const overlay = document.getElementById('reportOverlay');
            if (overlay && !overlay._bwBound) {
                overlay._bwBound = true;
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) this.closeReport?.();
                });
            }
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bind, { once: true });
        } else {
            bind();
        }
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
        this.setupSavingsWidgetListeners();
        this.updateSavingsWidget();
        const loadDemoBtn = document.getElementById('loadDemoBtn');
        if (loadDemoBtn) loadDemoBtn.addEventListener('click', () => this.loadDemoData());
        document.getElementById('backupBtn').addEventListener('click', () => this.backupData());
        document.getElementById('restoreBtn').addEventListener('click', () => document.getElementById('restoreFile').click());
        document.getElementById('restoreFile').addEventListener('change', (e) => this.restoreData(e));
        document.getElementById('resetAllBtn').addEventListener('click', () => this.resetAll());
        document.getElementById('exportCalendarBtn').addEventListener('click', () => this.exportToCalendar());
        const bindOnce = (id, fn) => {
            const el = document.getElementById(id);
            if (!el || el._bwBound) return;
            el._bwBound = true;
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                try { fn(); } catch (err) { console.error('❌ Report binding error:', id, err); }
            }, { passive: false });
        };
        bindOnce('openReport', () => this.openReport?.());
        bindOnce('closeReport', () => this.closeReport?.());
        bindOnce('printReport', () => this.printReport?.());
        bindOnce('downloadReportPdf', () => this.downloadReportPdf?.());
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
        const daysRadio = document.getElementById('dateFormatDays');
        const monthsRadio = document.getElementById('dateFormatMonths');
        if (daysRadio && monthsRadio) {
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
        this.ensureSalaryPeriod();
        document.getElementById('dailyBudget').textContent = this.formatCurrency(this.calculateDailyBudget());
        document.getElementById('remaining').textContent = this.formatCurrency(this.calculateRemaining());
        document.getElementById('daysLeft').textContent = this.getDaysLeft();
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
        this.updateSavingsWidget();
        this.updateTransactionCount();
        document.getElementById('guideMessage').style.display = (!this.data.incomes || this.data.incomes.length === 0) ? 'block' : 'none';
        const last7Days = this.getLast7DaysData();
        const last7DaysBudget = this.getLast7DaysBudget();
        this.drawSparkline('budgetSparkline', last7DaysBudget, '#0ea5e9');
        const remainingColor = this.calculateRemaining() >= 0 ? '#2dc653' : '#ef233c';
        this.drawSparkline('remainingSparkline', last7Days, remainingColor);
        this.generateAiSuggestion();
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
        try { this.renderWiseScoreHome(); } catch(e) { /* no-op */ }
    }

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
        const fixedSection = document.getElementById('fixedSectionContent');
        const toggleBtn = document.getElementById('toggleFixedList');
        if (fixedSection && toggleBtn) {
            fixedSection.style.display = this.showFixedList ? 'block' : 'none';
            toggleBtn.classList.toggle('hidden', !this.showFixedList);
            toggleBtn.title = this.showFixedList ? 'Nascondi lista' : 'Mostra lista';
        }
    }

    formatDaysToYearsMonthsDays(days) {
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
        const totalCount = view.length;
        let filteredView = view;
        if (this.searchTerm || this.searchCategoryFilter !== 'all') {
            filteredView = this.filterExpenses(view);
        }
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

    filterExpenses(expenses) {
        if (!expenses || expenses.length === 0) return [];
        const term = this.searchTerm.toLowerCase().trim();
        const categoryFilter = this.searchCategoryFilter;
        return expenses.filter(item => {
            const exp = item.exp || item;
            const name = (exp.name || '').toLowerCase();
            const category = (exp.category || '').toLowerCase();
            const amount = exp.amount || 0;
            if (categoryFilter !== 'all' && category !== categoryFilter.toLowerCase()) {
                return false;
            }
            if (term === '') return true;
            if (name.includes(term)) return true;
            if (category.includes(term)) return true;
            if (amount.toString().includes(term)) return true;
            return false;
        });
    }

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
        if (typeof Chart === 'undefined') {
            console.warn('⚠️ Chart.js non disponibile: grafico disabilitato');
            return;
        }
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
            this.clearThemeInlineOverrides();
        }
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
            this.clearThemeInlineOverrides();
            if (localStorage.getItem('budgetwise-custom-colors')) {
                this.applyAccentOnlyFromCustomColors();
            }
        }
    }

    getCurrentTheme() {
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
        if (!this.customColors) return;
        const currentTheme = this.getCurrentTheme ? this.getCurrentTheme() : (localStorage.getItem('budgetwise-theme') === 'dark' ? 'dark' : 'light');
        const savedTheme = this.customColorsTheme || localStorage.getItem('budgetwise-custom-colors-theme') || 'light';
        const crossTheme = savedTheme !== currentTheme;
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
            const normalizeToHex = (v) => {
                if (!v) return '';
                v = String(v).trim();
                if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
                const short = v.match(/^#([0-9a-fA-F]{3})$/);
                if (short) {
                    const s = short[1];
                    return '#' + s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
                }
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
            if (input.type === 'color') {
                const hex = normalizeToHex(value);
                if (hex) input.value = hex;
                return;
            }
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
                    const firstIncome = parsed.incomes.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
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

    async restoreData(event) {
        const file = event?.target?.files?.[0];
        if (!file) return;
        try {
            let text = '';
            if (typeof file.text === 'function') {
                text = await file.text();
            } else {
                text = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e?.target?.result ?? '');
                    reader.onerror = () => reject(new Error('Errore FileReader'));
                    reader.readAsText(file);
                });
            }
            const parsed = JSON.parse(String(text || ''));
            const dataObj = (parsed && typeof parsed === 'object' && parsed.data && typeof parsed.data === 'object')
                ? parsed.data
                : parsed;
            this.data = dataObj;
            if (this.data.savingsPot === undefined) this.data.savingsPot = 0;
            this.saveData();
            try { this.updateUI(); } catch(e) {}
            try { this.updateChart(); } catch(e) {}
            try { this.applyLanguage(); } catch(e) {}
            alert(this.t('dataRestored') || '📂 Dati ripristinati!');
        } catch (e) {
            console.error('❌ Errore ripristino backup:', e);
            alert(this.t('fileReadError') || '❌ Errore durante la lettura del file');
        } finally {
            try { if (event?.target) event.target.value = ''; } catch(e) {}
        }
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

    normalizeDescriptionForLearning(description) {
        if (!description || typeof description !== 'string') return [];
        let s = description
            .toLowerCase()
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\d+/g, ' ')
            .replace(/[^a-z0-9\s]/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        const tokens = s.split(' ').filter(t => t.length >= 3);
        const seen = new Set();
        const out = [];
        for (const t of tokens) {
            if (!seen.has(t)) { seen.add(t); out.push(t); }
        }
        const lower = description.toLowerCase();
        if (/\bibb\b|iban|rid|sepa|addebito|sdd|abbonamento\b/i.test(lower)) {
            const ric = 'ricorrente';
            if (!seen.has(ric)) { seen.add(ric); out.push(ric); }
        }
        return out;
    }

    learnCategory(description, category) {
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

    suggestCategoryString(description) {
        return this.suggestCategory(description).category;
    }

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
        return `${this.getCategoryEmoji(category)} ${category}`;
    }

    // ========== METODI DI UTILITÀ PER IMPORT (NUOVI) ==========
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Errore lettura file'));
            reader.readAsText(file);
        });
    }

    escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    parseDate(dateStr, format) {
        if (!dateStr) return '';
        let s = String(dateStr).trim();
        if (format === 'DD/MM/YYYY') {
            const parts = s.split(/[\/\-]/);
            if (parts.length === 3) {
                const [d, m, y] = parts;
                if (d && m && y && y.length === 4) {
                    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                }
            }
        } else if (format === 'MM/DD/YYYY') {
            const parts = s.split(/[\/\-]/);
            if (parts.length === 3) {
                const [m, d, y] = parts;
                if (m && d && y && y.length === 4) {
                    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                }
            }
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
        return '';
    }

    parseAmount(amountStr) {
        if (!amountStr) return 0;
        let s = String(amountStr).trim();
        s = s.replace(/[€\s]/g, '');
        if (s.includes('.') && s.includes(',')) {
            s = s.replace(/\./g, '').replace(',', '.');
        } else {
            s = s.replace(',', '.');
        }
        const match = s.match(/-?[\d.]+/);
        if (match) {
            const num = parseFloat(match[0]);
            return isFinite(num) ? num : 0;
        }
        return 0;
    }

    parseExcelDate(cell) {
        if (cell === null || cell === undefined) return '';
        if (typeof cell === 'string') {
            const s = cell.trim();
            if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
            const parts = s.split(/[\/\-\.]/);
            if (parts.length === 3) {
                if (parts[2].length === 4) {
                    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
                if (parts[0].length === 4) {
                    return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
                }
            }
            return '';
        }
        if (typeof cell === 'number' && isFinite(cell)) {
            if (cell > 40000 && cell < 50000) {
                const excelEpoch = new Date(1900, 0, 1);
                const date = new Date(excelEpoch.getTime() + (cell - 1) * 24 * 60 * 60 * 1000);
                if (cell > 60) date.setDate(date.getDate() - 1);
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            }
        }
        return '';
    }

    parseExcelAmount(cell) {
        if (cell === null || cell === undefined) return 0;
        if (typeof cell === 'number' && isFinite(cell)) return cell;
        if (typeof cell === 'string') {
            let s = cell.trim();
            s = s.replace(/[€\s]/g, '');
            s = s.replace(',', '.');
            const match = s.match(/-?[\d.]+/);
            if (match) {
                const num = parseFloat(match[0]);
                return isFinite(num) ? num : 0;
            }
        }
        return 0;
    }

    // ========== DIALOG MAPPATURA CSV (NUOVO) ==========
    async showMappingDialog(file, delimiter, skipRows = 0, headerRow = 1) {
        return new Promise(async (resolve) => {
            let resolved = false;
            const safeResolve = (value) => {
                if (resolved) return;
                resolved = true;
                resolve(value);
            };

            const timeout = setTimeout(() => {
                console.warn('⏰ Mapping dialog timeout');
                safeResolve(null);
            }, 30000);

            try {
                const text = await this.readFileAsText(file);
                const lines = text.split('\n').filter(line => line.trim() !== '');
                
                if (lines.length === 0) {
                    safeResolve(null);
                    return;
                }

                const startLine = Math.min(skipRows, lines.length - 1);
                const relevantLines = lines.slice(startLine);
                
                if (relevantLines.length === 0) {
                    safeResolve(null);
                    return;
                }

                let headerLine = 0;
                if (headerRow > 0) {
                    headerLine = Math.min(headerRow - 1, relevantLines.length - 1);
                }
                
                const headerParts = relevantLines[headerLine].split(delimiter).map(h => h.trim());
                const headers = headerParts.map((h, idx) => h || `Colonna ${idx + 1}`);
                
                const previewData = [];
                const previewStart = headerLine + 1;
                for (let i = previewStart; i < Math.min(previewStart + 5, relevantLines.length); i++) {
                    const parts = relevantLines[i].split(delimiter).map(cell => cell.trim());
                    previewData.push(parts);
                }

                const overlay = document.getElementById('csvMappingOverlay');
                const headersRow = document.getElementById('csvMappingHeaders');
                const previewBody = document.getElementById('csvMappingPreview');
                const fieldsDiv = document.getElementById('csvMappingFields');
                
                if (!overlay || !headersRow || !previewBody || !fieldsDiv) {
                    console.error('❌ Elementi mapping non trovati');
                    safeResolve(null);
                    return;
                }

                headersRow.innerHTML = headers.map(h => `<th>${this.escapeHtml(h)}</th>`).join('');
                
                previewBody.innerHTML = previewData.map(row => {
                    const cells = headers.map((_, idx) => {
                        const cell = row[idx] || '';
                        return `<td class="preview-cell" title="${this.escapeHtml(cell)}">${this.escapeHtml(cell.substring(0, 30))}${cell.length > 30 ? '…' : ''}</td>`;
                    }).join('');
                    return `<tr>${cells}</tr>`;
                }).join('');

                const fieldOptions = [
                    { value: 'date', label: this.t('csvFieldDate') || '📅 Data', emoji: '📅' },
                    { value: 'description', label: this.t('csvFieldDescription') || '📝 Descrizione', emoji: '📝' },
                    { value: 'amount', label: this.t('csvFieldAmount') || '💰 Importo', emoji: '💰' },
                    { value: 'category', label: this.t('csvFieldCategory') || '🏷️ Categoria', emoji: '🏷️' },
                    { value: 'ignore', label: this.t('csvFieldIgnore') || '❌ Ignora', emoji: '❌' }
                ];

                fieldsDiv.innerHTML = headers.map((header, index) => {
                    let selectedDate = '', selectedDesc = '', selectedAmount = '', selectedCategory = '';
                    const lowerHeader = header.toLowerCase();
                    
                    if (lowerHeader.includes('data') || lowerHeader.includes('date') || lowerHeader.includes('fecha')) selectedDate = 'selected';
                    else if (lowerHeader.includes('desc') || lowerHeader.includes('caus') || lowerHeader.includes('operazione')) selectedDesc = 'selected';
                    else if (lowerHeader.includes('import') || lowerHeader.includes('amount') || lowerHeader.includes('€')) selectedAmount = 'selected';
                    else if (lowerHeader.includes('categ')) selectedCategory = 'selected';
                    
                    return `
                        <div style="display: flex; align-items: center; gap: 15px; background: var(--bg-color); padding: 15px; border-radius: 16px; border: 1px solid var(--border);">
                            <span style="min-width: 200px; font-weight: 600; color: var(--accent);">
                                ${this.t('csvColumnN', { n: index + 1 })}: "${this.escapeHtml(header)}"
                            </span>
                            <select id="mapping-${index}" class="csv-mapping-select" style="flex: 1; padding: 10px; border-radius: 12px;">
                                <option value="date" ${selectedDate}>📅 ${fieldOptions[0].label}</option>
                                <option value="description" ${selectedDesc}>📝 ${fieldOptions[1].label}</option>
                                <option value="amount" ${selectedAmount}>💰 ${fieldOptions[2].label}</option>
                                <option value="category" ${selectedCategory}>🏷️ ${fieldOptions[3].label}</option>
                                <option value="ignore">❌ ${fieldOptions[4].label}</option>
                            </select>
                        </div>
                    `;
                }).join('');

                overlay.style.display = 'flex';

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
                        alert(this.t('csvMappingRequired') || '❌ Devi mappare Data, Descrizione e Importo!');
                        return;
                    }

                    overlay.style.display = 'none';
                    clearTimeout(timeout);
                    safeResolve(mapping);
                };

                const onCancel = () => {
                    overlay.style.display = 'none';
                    clearTimeout(timeout);
                    safeResolve(null);
                };

                const newConfirm = confirmBtn.cloneNode(true);
                const newCancel = cancelBtn.cloneNode(true);
                confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
                cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

                newConfirm.addEventListener('click', onConfirm);
                newCancel.addEventListener('click', onCancel);

                const onKeyDown = (e) => {
                    if (e.key === 'Escape') {
                        onCancel();
                        document.removeEventListener('keydown', onKeyDown);
                    }
                };
                document.addEventListener('keydown', onKeyDown);

            } catch (error) {
                console.error('❌ Errore mapping dialog:', error);
                safeResolve(null);
            }
        });
    }

    // ========== IMPORT CSV (NUOVO) ==========
    async parseCSV(file, delimiter, dateFormat, skipRows = 0, headerRow = 1) {
        if (!this.checkFreeLimits('csvImport')) return { cancelled: true, added: 0, incomes: 0 };
        
        console.log('📥 Import CSV con mapping:', file.name);

        const mapping = await this.showMappingDialog(file, delimiter, skipRows, headerRow);
        if (!mapping) {
            this.showToast(this.t('importCancelled') || '⏸️ Import annullato', 'info');
            return { cancelled: true, added: 0, incomes: 0 };
        }

        try {
            const text = await this.readFileAsText(file);
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            const startLine = Math.min(skipRows, lines.length - 1);
            const relevantLines = lines.slice(startLine);
            
            const dataStartLine = headerRow > 0 ? headerRow : 0;
            const dataLines = relevantLines.slice(dataStartLine);

            const importedExpenses = [];
            const tempIncomes = [];

            for (let i = 0; i < dataLines.length; i++) {
                const line = dataLines[i].trim();
                if (!line) continue;

                const parts = line.split(delimiter);
                
                const dateStr = (mapping.dateCol !== -1 && parts[mapping.dateCol]) ? parts[mapping.dateCol].trim() : '';
                const description = (mapping.descCol !== -1 && parts[mapping.descCol]) ? parts[mapping.descCol].trim() : '';
                let amountStr = (mapping.amountCol !== -1 && parts[mapping.amountCol]) ? parts[mapping.amountCol].trim() : '';
                let category = (mapping.categoryCol !== -1 && parts[mapping.categoryCol]) ? parts[mapping.categoryCol].trim() : '';

                if (!dateStr || !description || !amountStr) continue;

                const parsedDate = this.parseDate(dateStr, dateFormat);
                if (!parsedDate) continue;

                let amount = this.parseAmount(amountStr);
                if (amount === 0) continue;

                if (!category) {
                    const sug = this.suggestCategory(description);
                    category = sug.confidence >= this.CATEGORY_CONFIDENCE_THRESHOLD ? sug.category : 'Altro';
                }

                if (amount > 0) {
                    tempIncomes.push({
                        desc: description,
                        amount: amount,
                        date: parsedDate,
                        id: Date.now() + i
                    });
                } else {
                    importedExpenses.push({
                        name: description,
                        amount: Math.abs(amount),
                        date: parsedDate,
                        category: category,
                        id: Date.now() + i
                    });
                }
            }

            let addedExpenses = 0;
            let addedIncomes = 0;

            if (importedExpenses.length > 0) {
                const reviewed = await this.showImportReview(importedExpenses);
                
                for (const exp of reviewed) {
                    if (!this.data.variableExpenses) this.data.variableExpenses = {};
                    if (!this.data.variableExpenses[exp.date]) this.data.variableExpenses[exp.date] = [];
                    this.data.variableExpenses[exp.date].push(exp);
                }
                addedExpenses = reviewed.length;
            }

            if (tempIncomes.length > 0) {
                if (!this.data.incomes) this.data.incomes = [];
                this.data.incomes.push(...tempIncomes);
                addedIncomes = tempIncomes.length;
            }

            if (addedExpenses === 0 && addedIncomes === 0) {
                this.showToast('⚠️ Nessun movimento valido', 'info');
                return { cancelled: false, added: 0, incomes: 0 };
            }

            this.saveData();
            this.updateUI();
            this.updateChart();
            this.updateTransactionCount();
            
            this.showToast(
                `✅ Importate ${addedExpenses} spese${addedIncomes ? ` e ${addedIncomes} entrate` : ''}`,
                'success'
            );

            return { cancelled: false, added: addedExpenses, incomes: addedIncomes };

        } catch (error) {
            console.error('❌ Errore parseCSV:', error);
            this.showToast('❌ Errore import CSV', 'error');
            return { cancelled: true, added: 0, incomes: 0 };
        }
    }

    // ========== IMPORT EXCEL (NUOVO) ==========
    async parseExcel(file, sheetIndex = 0, headerRow = -1, skipRows = 0) {
        if (!this.checkFreeLimits('csvImport')) return { cancelled: true, added: 0, incomes: 0 };
        
        console.log('📥 Import Excel:', { file: file.name, sheetIndex, headerRow, skipRows });

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            
            const safeSheetIndex = (sheetIndex >= 0 && sheetIndex < workbook.SheetNames.length) ? sheetIndex : 0;
            const sheetName = workbook.SheetNames[safeSheetIndex];
            const worksheet = workbook.Sheets[sheetName];
            
            const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
            if (!allRows || allRows.length === 0) throw new Error('File Excel vuoto');

            const startRow = Math.min(skipRows || 0, allRows.length - 1);
            const rowsAfterSkip = allRows.slice(startRow);
            
            if (rowsAfterSkip.length === 0) {
                throw new Error('Nessuna riga dopo skipRows');
            }

            let headerRowIndex = 0;
            let headers = [];

            if (headerRow >= 0) {
                headerRowIndex = Math.min(headerRow, rowsAfterSkip.length - 1);
                headers = rowsAfterSkip[headerRowIndex] || [];
            } else {
                for (let i = 0; i < Math.min(10, rowsAfterSkip.length); i++) {
                    const row = rowsAfterSkip[i] || [];
                    const rowText = row.map(c => String(c || '').toLowerCase()).join(' ');
                    
                    if (rowText.includes('data') || rowText.includes('date') || 
                        rowText.includes('fecha') || rowText.includes('desc') ||
                        rowText.includes('importo') || rowText.includes('amount')) {
                        headerRowIndex = i;
                        headers = row;
                        break;
                    }
                }
                
                if (headers.length === 0) {
                    for (let i = 0; i < rowsAfterSkip.length; i++) {
                        if (rowsAfterSkip[i].some(cell => String(cell || '').trim() !== '')) {
                            headerRowIndex = i;
                            headers = rowsAfterSkip[i];
                            break;
                        }
                    }
                }
            }

            console.log('📌 Intestazione trovata alla riga:', startRow + headerRowIndex + 1);
            
            const dataRows = rowsAfterSkip.slice(headerRowIndex + 1);
            
            if (dataRows.length === 0) {
                throw new Error('Nessuna riga dati dopo intestazione');
            }

            const headerTexts = headers.map(h => String(h || '').toLowerCase());
            
            let dateCol = headerTexts.findIndex(h => 
                h.includes('data') || h.includes('date') || h.includes('fecha') || h.includes('giorno'));
            let descCol = headerTexts.findIndex(h => 
                h.includes('desc') || h.includes('caus') || h.includes('operazione'));
            let amountCol = headerTexts.findIndex(h => 
                h.includes('import') || h.includes('amount') || h.includes('€') || h.includes('eur'));
            let categoryCol = headerTexts.findIndex(h => 
                h.includes('categoria') || h.includes('category'));

            if (dateCol === -1) dateCol = 0;
            if (descCol === -1) descCol = 1;
            if (amountCol === -1) amountCol = 2;

            const importedExpenses = [];
            const tempIncomes = [];

            for (let i = 0; i < dataRows.length; i++) {
                const row = dataRows[i];
                if (!row || row.length === 0) continue;
                
                if (row.every(cell => String(cell || '').trim() === '')) continue;

                let dateStr = '';
                if (dateCol >= 0 && dateCol < row.length) {
                    dateStr = this.parseExcelDate(row[dateCol]);
                }
                
                if (!dateStr) continue;

                let description = '';
                if (descCol >= 0 && descCol < row.length) {
                    description = String(row[descCol] || '').trim();
                }
                if (!description) continue;

                let amount = 0;
                if (amountCol >= 0 && amountCol < row.length) {
                    amount = this.parseExcelAmount(row[amountCol]);
                }
                
                if (amount === 0) continue;

                let category = 'Altro';
                if (categoryCol >= 0 && categoryCol < row.length) {
                    const catCell = String(row[categoryCol] || '').trim();
                    if (catCell) category = catCell;
                } else {
                    const sug = this.suggestCategory(description);
                    if (sug.confidence >= this.CATEGORY_CONFIDENCE_THRESHOLD) {
                        category = sug.category;
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
                    importedExpenses.push({
                        name: description,
                        amount: Math.abs(amount),
                        date: dateStr,
                        category: category,
                        id: Date.now() + i
                    });
                }
            }

            let addedExpenses = 0;
            let addedIncomes = 0;

            if (importedExpenses.length > 0) {
                const reviewed = await this.showImportReview(importedExpenses);
                
                for (const exp of reviewed) {
                    if (!this.data.variableExpenses) this.data.variableExpenses = {};
                    if (!this.data.variableExpenses[exp.date]) this.data.variableExpenses[exp.date] = [];
                    this.data.variableExpenses[exp.date].push(exp);
                }
                addedExpenses = reviewed.length;
            }

            if (tempIncomes.length > 0) {
                if (!this.data.incomes) this.data.incomes = [];
                this.data.incomes.push(...tempIncomes);
                addedIncomes = tempIncomes.length;
            }

            if (addedExpenses === 0 && addedIncomes === 0) {
                this.showToast('⚠️ Nessun movimento valido', 'info');
                return { cancelled: false, added: 0, incomes: 0 };
            }

            this.saveData();
            this.updateUI();
            this.updateChart();
            this.updateTransactionCount();
            
            this.showToast(
                `✅ Importate ${addedExpenses} spese${addedIncomes ? ` e ${addedIncomes} entrate` : ''}`,
                'success'
            );

            return { cancelled: false, added: addedExpenses, incomes: addedIncomes };

        } catch (error) {
            console.error('❌ Errore parseExcel:', error);
            this.showToast('❌ Errore import Excel: ' + error.message, 'error');
            return { cancelled: true, added: 0, incomes: 0 };
        }
    }

    // ========== REVISIONE IMPORT (NUOVO) ==========
    showImportReview(importedExpenses) {
        return new Promise(async (resolve) => {
            const overlay = document.getElementById('importReviewOverlay');
            const listEl = document.getElementById('importReviewList');
            
            if (!overlay || !listEl) {
                resolve(importedExpenses);
                return;
            }

            const getCategoryOptions = (selectedCat, allCats) => {
                let options = allCats.map(cat => 
                    `<option value="${cat}" ${cat === selectedCat ? 'selected' : ''}>${this.getCategoryEmoji(cat)} ${cat}</option>`
                ).join('');
                options += `<option value="__NEW__" style="color: var(--accent); font-weight: bold;">➕ Nuova categoria...</option>`;
                return options;
            };

            let currentCategories = [...this.getAllCategories()];

            listEl.innerHTML = importedExpenses.map((exp, index) => {
                const hint = exp._suggested
                    ? this.t('importSuggested').replace('{cat}', exp._suggested)
                    : this.t('importLearn');
                
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

            const refreshAllSelects = () => {
                const allCats = this.getAllCategories();
                
                document.querySelectorAll('.review-select').forEach(select => {
                    const index = select.dataset.index;
                    const currentValue = select.value;
                    const currentExpCat = importedExpenses[index]?.category || 'Altro';
                    
                    let valueToKeep = currentValue;
                    if (valueToKeep === '__NEW__' || !valueToKeep) {
                        valueToKeep = currentExpCat;
                    }
                    
                    let options = allCats.map(cat => 
                        `<option value="${cat}" ${cat === valueToKeep ? 'selected' : ''}>${this.getCategoryEmoji(cat)} ${cat}</option>`
                    ).join('');
                    options += `<option value="__NEW__" style="color: var(--accent); font-weight: bold;">➕ Nuova categoria...</option>`;
                    
                    select.innerHTML = options;
                    select.value = valueToKeep;
                    
                    if (valueToKeep !== '__NEW__') {
                        importedExpenses[index].category = valueToKeep;
                    }
                });
            };

            const autoCompleteIdentical = (startIndex, newCategory, description) => {
                const normalizedCurrent = this.normalizeDescriptionForLearning(description);
                if (normalizedCurrent.length < 3) return;
                
                for (let i = startIndex + 1; i < importedExpenses.length; i++) {
                    const otherExp = importedExpenses[i];
                    const normalizedOther = this.normalizeDescriptionForLearning(otherExp.name);
                    
                    if (normalizedOther === normalizedCurrent) {
                        const otherSelect = document.querySelector(`.review-select[data-index="${i}"]`);
                        if (otherSelect && otherSelect.value !== newCategory && otherSelect.value !== '__NEW__') {
                            otherSelect.value = newCategory;
                            importedExpenses[i].category = newCategory;
                            
                            otherSelect.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                            setTimeout(() => {
                                otherSelect.style.backgroundColor = '';
                            }, 500);
                            
                            if (!this.license?.isFeatureLocked?.('categoryLearning')) {
                                this.learnCategory(otherExp.name, newCategory);
                            }
                        }
                    }
                }
            };

            document.querySelectorAll('.review-select').forEach(select => {
                select.addEventListener('change', (e) => {
                    const selectEl = e.target;
                    const index = parseInt(selectEl.dataset.index);
                    const description = selectEl.dataset.description || '';
                    
                    if (selectEl.value === '__NEW__') {
                        const newCategory = prompt('Inserisci il nome della nuova categoria:', '');
                        
                        if (newCategory && newCategory.trim() !== '') {
                            const catName = newCategory.trim();
                            
                            if (!this.getAllCategories().includes(catName)) {
                                if (!this.checkFreeLimits('customCategory')) {
                                    alert('Le categorie personalizzate sono disponibili in Premium!');
                                    selectEl.value = importedExpenses[index].category || 'Altro';
                                    return;
                                }
                                this.customCategories.push(catName);
                                this.saveCustomCategories();
                                this.showToast(`✅ Categoria "${catName}" creata!`, 'success');
                            }
                            
                            importedExpenses[index].category = catName;
                            refreshAllSelects();
                            
                            const currentSelect = document.querySelector(`.review-select[data-index="${index}"]`);
                            if (currentSelect) {
                                currentSelect.value = catName;
                            }
                            
                            if (!this.license?.isFeatureLocked?.('categoryLearning')) {
                                this.learnCategory(description, catName);
                            }
                            
                            autoCompleteIdentical(index, catName, description);
                            
                        } else {
                            selectEl.value = importedExpenses[index].category || 'Altro';
                        }
                    } else {
                        const newCategory = selectEl.value;
                        importedExpenses[index].category = newCategory;
                        
                        if (!this.license?.isFeatureLocked?.('categoryLearning')) {
                            this.learnCategory(description, newCategory);
                        }
                        
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

            const newConfirm = confirmBtn.cloneNode(true);
            const newCancel = cancelBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
            cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

            newConfirm.addEventListener('click', onConfirm);
            newCancel.addEventListener('click', onCancel);
        });
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
} // Fine della classe BudgetWise

// ============================================
// INIZIALIZZAZIONE - UNA SOLA VOLTA
// ============================================

window.BudgetWiseApp = null;

function initApp() {
    try {
        window.BudgetWiseApp = new BudgetWise();
        window.appInitialized = true;
        window.app = window.BudgetWiseApp;
        
        (function ensurePremiumTranslations(){
            let tries = 0;
            const tick = () => {
                tries++;
                try {
                    if (window.app && window.app.mergeTranslations && window.app.getPremiumModuleTranslations) {
                        window.app.mergeTranslations(window.app.getPremiumModuleTranslations());
                        return;
                    }
                } catch (_) {}
                if (tries < 50) setTimeout(tick, 100);
            };
            setTimeout(tick, 0);
        })();
        
        console.log('✅ BudgetWise inizializzato correttamente');
        console.log('👉 Nella console puoi usare: window.app o window.BudgetWiseApp');
    } catch (error) {
        console.error('❌ Errore inizializzazione:', error);
    }
}

if (!window.appInitialized) {
    console.log('🚀 Avvio BudgetWise...');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        setTimeout(initApp, 100);
    }
}

// ============================================
// GESTIONE IMPORT CSV/EXCEL (NUOVO)
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
        console.error('❌ Elementi import non trovati');
        return;
    }

    window._currentImportFile = null;
    window._isExcelFile = false;

    if (advancedToggle && advancedWrap) {
        const newToggle = advancedToggle.cloneNode(true);
        advancedToggle.parentNode.replaceChild(newToggle, advancedToggle);
        
        newToggle.addEventListener('click', () => {
            const isOpen = advancedWrap.style.display !== 'none';
            advancedWrap.style.display = isOpen ? 'none' : 'block';
            newToggle.textContent = isOpen 
                ? (window.app.t('advancedOptions') || '⚙️ Opzioni avanzate')
                : (window.app.t('hideOptions') || '✕ Nascondi opzioni');
        });
    }

    const newFileInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(newFileInput, fileInput);

    newFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) {
            fileNameSpan.textContent = window.app.t('csvNoFile') || 'Nessun file selezionato';
            return;
        }
        
        fileNameSpan.textContent = file.name;
        window._currentImportFile = file;
        
        const ext = file.name.split('.').pop().toLowerCase();
        window._isExcelFile = ['xls', 'xlsx'].includes(ext);
        
        if (window._isExcelFile) {
            if (sheetSelect) {
                sheetSelect.innerHTML = '<option value="">⏳ Caricamento...</option>';
                sheetSelect.disabled = true;
            }
            
            const reader = new FileReader();
            reader.onload = (re) => {
                try {
                    const data = new Uint8Array(re.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    if (sheetSelect) {
                        sheetSelect.innerHTML = workbook.SheetNames.map((name, idx) => 
                            `<option value="${idx}">${idx+1}. ${name}</option>`
                        ).join('');
                        sheetSelect.disabled = false;
                        sheetSelect.value = '0';
                    }
                } catch (err) {
                    alert('❌ Errore lettura Excel: ' + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            if (sheetSelect) {
                sheetSelect.innerHTML = '<option value="" disabled selected>📄 File CSV</option>';
                sheetSelect.disabled = true;
            }
        }
    });

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', async function() {
        const file = window._currentImportFile || newFileInput.files[0];
        
        if (!file) {
            alert('📁 Seleziona prima un file');
            newFileInput.click();
            return;
        }

        newBtn.textContent = '⏳ Importazione...';
        newBtn.disabled = true;

        try {
            const isExcel = window._isExcelFile || ['xls', 'xlsx'].includes(file.name.split('.').pop().toLowerCase());
            
            if (isExcel) {
                const sheetIndex = (sheetSelect && !sheetSelect.disabled && sheetSelect.value) 
                    ? parseInt(sheetSelect.value) 
                    : 0;
                const headerRow = excelHeaderSelect ? parseInt(excelHeaderSelect.value || '-1') : -1;
                const skipRows = parseInt(skipRowsInput?.value || '0');
                
                await window.app.parseExcel(file, sheetIndex, headerRow, skipRows);
            } else {
                const delimiter = document.getElementById('csvSeparator').value;
                const dateFormat = document.getElementById('csvDelimiter').value;
                const skipRows = parseInt(skipRowsInput?.value || '0');
                const headerRow = parseInt(headerRowInput?.value || '1');
                
                await window.app.parseCSV(file, delimiter, dateFormat, skipRows, headerRow);
            }
            
            newFileInput.value = '';
            fileNameSpan.textContent = window.app.t('csvNoFile') || 'Nessun file selezionato';
            window._currentImportFile = null;
            window._isExcelFile = false;
            
        } catch (error) {
            console.error('❌ Errore import:', error);
            alert('❌ Errore durante import: ' + (error.message || 'Errore sconosciuto'));
        } finally {
            newBtn.textContent = window.app.t('csvImportBtn') || '📥 Importa CSV / Excel';
            newBtn.disabled = false;
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImportHandlers);
} else {
    setTimeout(setupImportHandlers, 100);
}

// ===== PREMIUM MODULE HELPERS (WiseScore, Report, PDF, ecc.) =====
// Questi metodi sono esattamente quelli della seconda repo, li riporto per completezza.

BudgetWise.prototype.clamp100 = function(x) {
    return Math.max(0, Math.min(100, x));
}

BudgetWise.prototype.getWiseScoreModel = function() {
    const income = this.calculateTotalIncome?.() ?? 0;
    const fixed = this.calculateTotalFixedExpenses?.() ?? 0;
    const fixedUnpaid = this.calculateTotalFixedExpensesUnpaid?.() ?? 0;
    const variable = this.calculateTotalVariableExpenses?.() ?? 0;

    const spend = fixed + variable;
    const net = income - spend;

    const target = (this.data.savingsPercent || 0) / 100;
    const savingsRate = income > 0 ? Math.max(0, net / income) : 0;

    // Pillars (0..100)
    let stability = income > 0 ? (1 - (fixed / income)) * 100 : 0;
    stability = this.clamp100(stability - (income > 0 ? (fixedUnpaid / income) * 120 : 0));

    const targetBase = Math.max(0.05, target || 0.10);
    let discipline = (savingsRate / targetBase) * 100;
    discipline = this.clamp100(discipline);

    const savingsPot = Number(this.data.savingsPot || 0);
    const months = spend > 0 ? (savingsPot / spend) : (savingsPot > 0 ? 3 : 0);
    let resilience = this.clamp100((months / 3) * 100);

    // Overall
    let score = 0.45 * stability + 0.35 * discipline + 0.20 * resilience;
    if (net < 0) score -= 8;
    score = Math.round(this.clamp100(score));

    const insightKey =
        score >= 85 ? 'wisescoreInsightExcellent' :
        score >= 70 ? 'wisescoreInsightGood' :
        score >= 50 ? 'wisescoreInsightOk' :
        'wisescoreInsightBad';

    return {
        income, fixed, fixedUnpaid, variable, spend, net, savingsRate, target,
        savingsPot, months,
        pillars: {
            stability: Math.round(stability),
            discipline: Math.round(discipline),
            resilience: Math.round(resilience)
        },
        score,
        insight: this.t(insightKey),
        timeline: this.buildWiseScoreTimeline({ income, fixedUnpaid, variable, savingsRate, target })
    };
}

BudgetWise.prototype.buildWiseScoreTimeline = function({ income, fixedUnpaid, variable, savingsRate, target }) {
    const items = [];
    const start = this.normalizeIsoDate?.(this.data.periodStart) || this.data.periodStart;
    const end = this.normalizeIsoDate?.(this.data.periodEnd) || this.data.periodEnd;

    if (start) items.push({ ico:'📍', title:this.t('eventPeriodStart'), meta:start, desc:'' });

    if (income > 0) items.push({
        ico:'🏦',
        title:this.t('eventIncome'),
        meta:this.formatCurrency?.(income) ?? income,
        desc:''
    });

    if (fixedUnpaid > 0) items.push({
        ico:'⚠️',
        title:this.t('eventUnpaidFixed'),
        meta:this.formatCurrency?.(fixedUnpaid) ?? fixedUnpaid,
        desc:''
    });

    const peak = this.getPeakVariableDay?.();
    if (peak && peak.amount > 0) items.push({
        ico:'🧾',
        title:this.t('eventPeakSpend'),
        meta:`${peak.date} · ${this.formatCurrency?.(peak.amount) ?? peak.amount}`,
        desc: peak.topName ? peak.topName : ''
    });

    if (income > 0) {
        const t = Math.max(0.05, target || 0.10);
        const pace = savingsRate >= t ? '✅' : (savingsRate >= t*0.6 ? '➖' : '❌');
        items.push({
            ico: pace,
            title:this.t('eventSavings'),
            meta:`${Math.round(savingsRate*100)}%`,
            desc:''
        });
    }

    if (end) items.push({ ico:'🏁', title:this.t('eventPeriodEnd'), meta:end, desc:'' });

    return items;
}

BudgetWise.prototype.getPeakVariableDay = function() {
    if (!this.data.variableExpenses || typeof this.data.variableExpenses !== 'object') return null;
    let best = { date:'', amount:0, topName:'' };
    for (const [date, arr] of Object.entries(this.data.variableExpenses)) {
        const d = this.normalizeIsoDate?.(date);
        if (!d || !this.isDateInPeriod?.(d)) continue;
        if (!Array.isArray(arr) || arr.length === 0) continue;
        const sum = arr.reduce((s,e)=>s+(e.amount||0),0);
        if (sum > best.amount) {
            const top = [...arr].sort((a,b)=>(b.amount||0)-(a.amount||0))[0];
            best = { date:d, amount:sum, topName: top?.name ? `${top.name}` : '' };
        }
    }
    return best.amount>0 ? best : null;
}

BudgetWise.prototype.renderWiseScoreHome = function() {
    const card = document.getElementById('wiseScoreCardHome');
    if (!card) return;

    const m = this.getWiseScoreModel();
    const hasData = (m.income + m.fixed + m.variable) > 0;

    if (!hasData) { card.style.display = 'none'; return; }
    card.style.display = '';

    const scoreEl = document.getElementById('wiseScoreValue');
    const subEl = document.getElementById('wiseScoreSub');
    const pillEl = document.getElementById('wiseScorePill');

    if (scoreEl) scoreEl.textContent = String(m.score);
    if (subEl) subEl.textContent = m.insight;

    if (pillEl) {
        const label = m.score >= 85 ? 'A' : m.score >= 70 ? 'B' : m.score >= 50 ? 'C' : 'D';
        pillEl.textContent = `Grade ${label}`;
    }

    const setPillar = (fillId, valId, value) => {
        const fill = document.getElementById(fillId);
        const val = document.getElementById(valId);
        if (fill) fill.style.width = `${this.clamp100(value)}%`;
        if (val) val.textContent = `${this.clamp100(value)}%`;
    };
    setPillar('pillarStabilityFill','pillarStabilityVal', m.pillars.stability);
    setPillar('pillarDisciplineFill','pillarDisciplineVal', m.pillars.discipline);
    setPillar('pillarResilienceFill','pillarResilienceVal', m.pillars.resilience);

    const tl = document.getElementById('wiseScoreTimeline');
    if (tl) {
        tl.innerHTML = (m.timeline || []).map(it => `
            <div class="timeline-item">
                <div class="timeline-ico">${it.ico || '•'}</div>
                <div>
                    <div class="timeline-title">
                        <span>${this.escapeHtml?.(it.title) ?? it.title}</span>
                        <span class="timeline-meta">${this.escapeHtml?.(it.meta) ?? it.meta}</span>
                    </div>
                    ${(it.desc ? `<div class="timeline-desc">${this.escapeHtml?.(it.desc) ?? it.desc}</div>` : '')}
                </div>
            </div>
        `).join('');
    }
}

// ===== Premium Report View =====
BudgetWise.prototype._ensurePremiumI18n = function() {
    try {
        // Merge premium translations if available
        if (typeof this.mergeTranslations === 'function') {
            const src = (typeof this.getPremiumModuleTranslations === 'function')
                ? this.getPremiumModuleTranslations()
                : (window.app && typeof window.app.getPremiumModuleTranslations === 'function'
                    ? window.app.getPremiumModuleTranslations()
                    : null);

            if (src && src[this.lang || 'it']) {
                this.mergeTranslations(src);
            }
        }

        // Hard fallback (in caso di apertura report prima del merge)
        const lang = this.lang || 'it';
        this.translations = this.translations || {};
        this.translations[lang] = this.translations[lang] || {};
        const d = this.translations[lang];

        const fallback = {
          reportTitle: "Report Premium",
          print: "Stampa",
          reportDownloadPdf: "⬇️ PDF",
          close: "Chiudi",
          reportSectionSummary: "Sintesi periodo",
          reportSectionWiseScore: "WiseScore™",
          reportSectionTotals: "Totali periodo",
          reportSectionTimeline: "Timeline WiseScore™",
          reportSectionDetails: "Dettaglio",
          tableIncomes: "Entrate – dettaglio",
          tableFixed: "Spese fisse – scadenze",
          tableVariable: "Spese variabili – dettaglio",
          colDate: "Data",
          colDescription: "Voce",
          colCategory: "Categoria",
          colStatus: "Stato",
          colAmount: "Importo",
          noData: "Nessun dato",
          periodLabel: "Periodo",
          kpiIncome: "Entrate",
          kpiFixed: "Fisse",
          kpiVariable: "Variabili",
          kpiNet: "Saldo",
          wisescoreTitle: "WiseScore™",
          wisescoreInsightExcellent: "Eccellente controllo",
          wisescoreInsightGood: "Buon equilibrio",
          wisescoreInsightOk: "Serve ottimizzare",
          wisescoreInsightBad: "Attenzione: pressione alta",
          pillarStability: "Stabilità",
          pillarDiscipline: "Disciplina",
          pillarResilience: "Resilienza",
          eventPeriodStart: "Inizio periodo",
          eventPeriodEnd: "Fine periodo",
          eventIncome: "Entrate rilevate",
          eventUnpaidFixed: "Fisse non coperte",
          eventPeakSpend: "Picco spese variabili",
          eventSavings: "Ritmo risparmio",
          coverTitle: "Rapporto Decisionale",
          coverPeriod: "Periodo",
          coverFooter: "Generato da WiseScore™",
          pdfLibMissing: "Libreria PDF non disponibile",
        };
        for (const k in fallback) {
            if (!d[k]) d[k] = fallback[k];
        }
    } catch (_) {}
};

BudgetWise.prototype.openReport = function() {
    const overlay = document.getElementById('reportOverlay');
    const content = document.getElementById('reportContent');
    if (!overlay || !content) return;


    this._ensurePremiumI18n?.();

    // ✅ Critical fix: if overlay lives inside a hidden tab/section (ancestor display:none), it will have 0x0 rect.
    // Move it to <body> once so it can render fullscreen reliably.
    if (!overlay.dataset.bwMovedToBody) {
        try {
            let p = overlay.parentElement;
            while (p && p !== document.body) {
                const ps = window.getComputedStyle(p);
                if (ps && ps.display === 'none') {
                    document.body.appendChild(overlay);
                    break;
                }
                p = p.parentElement;
            }
            // Even if no hidden ancestor was detected, ensure overlay is at top-level for z-index/fixed positioning.
            if (overlay.parentElement !== document.body) {
                document.body.appendChild(overlay);
            }
            overlay.dataset.bwMovedToBody = '1';
        } catch (e) {}
    }
    // a11y: preserve focus
    this._bwLastFocus = document.activeElement;
    overlay.setAttribute('aria-hidden', 'false');

    content.innerHTML = this.buildReportHtml();

    // Force visibility + geometry even if inline style / cached CSS / transforms keep it hidden
    overlay.style.display = 'block';
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';

    // Some browsers/extensions/CSS can collapse overlays via transforms (scale(0)) or missing sizing.
    overlay.style.transform = 'none';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.margin = '0';
    overlay.style.overflow = 'auto';
    overlay.style.zIndex = '9999';

    // Force reflow to materialize layout before any focus management
    void overlay.offsetHeight;

    overlay.setAttribute('aria-hidden', 'false');

    // Apply i18n on freshly injected DOM
    this.applyLanguage?.();
}


BudgetWise.prototype.closeReport = function() {
    const overlay = document.getElementById('reportOverlay');
    if (!overlay) return;
    // a11y: if focus is inside the overlay, move it out before aria-hidden
    const active = document.activeElement;
    if (active && overlay.contains(active)) {
        try { active.blur(); } catch (_) {}
    }
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    // restore focus
    if (this._bwLastFocus && typeof this._bwLastFocus.focus === 'function') {
        try { this._bwLastFocus.focus(); } catch (_) {}
    }
}

// ===== Print (robust) =====
// Printing the overlay (position:fixed + overflow:auto) often causes duplicated pages and cut content.
// This prints a clean, dedicated document in a new window/tab and triggers the print dialog.
BudgetWise.prototype.printReport = function() {
    try {
        this._ensurePremiumI18n?.();

        // Guard: evita doppio trigger (alcuni handler/delegation possono richiamare due volte)
        const now = Date.now();
        if (this._bwLastPrintTs && (now - this._bwLastPrintTs) < 800) return;
        this._bwLastPrintTs = now;

        const html = this.buildReportHtml();

        const css = `

            @page { margin: 10mm; }
            html, body { margin:0; padding:0; background: white; color: black; }
            body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
            h2 { margin:0 0 20px 0; text-align:center; }
            h3 { margin: 0 0 15px 0; color: #333; }

            .report-section { 
                break-inside: avoid; 
                page-break-inside: avoid; 
                margin-bottom: 20px; 
                padding: 15px; 
                border: 1px solid #ddd; 
                border-radius: 8px;
            }
            .report-kpis { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                gap: 12px; 
            }
            .wisescore-grid { 
                display: grid; 
                grid-template-columns: 1fr 2fr; 
                gap: 20px; 
            }
            .wisescore-main { 
                padding: 15px; 
                background: #f5f5f5; 
                border-radius: 8px; 
                text-align: center; 
            }
            .wisescore-value { font-size: 48px; font-weight: bold; }
            .wisescore-sub { font-size: 14px; color: #555; }
            .wisescore-pillars { display: flex; flex-direction: column; gap: 10px; }
            .pillar { 
                display: grid; 
                grid-template-columns: 120px 1fr 48px; 
                gap: 10px; 
                align-items: center; 
            }
            .pillar-bar { 
                height: 12px; 
                background: #eee; 
                border-radius: 6px; 
                overflow: hidden; 
            }
            .pillar-fill { 
                height: 100%; 
                background: #333; 
                border-radius: 6px; 
            }
            .timeline { 
                display: flex; 
                flex-direction: column; 
                gap: 10px; 
            }
            .timeline-item { 
                display: grid; 
                grid-template-columns: 30px 1fr; 
                gap: 10px; 
                padding: 10px; 
                border: 1px solid #eee; 
                border-radius: 8px; 
            }
            .timeline-title { 
                display: flex; 
                justify-content: space-between; 
                font-weight: bold; 
            }
            .timeline-meta { color: #666; font-weight: normal; }
            .kpi { 
                padding: 10px; 
                border: 1px solid #ddd; 
                border-radius: 8px; 
                background: #f9f9f9; 
            }
            .kpi-label { font-size: 12px; color: #666; }
            .kpi-value { font-size: 18px; font-weight: bold; }
            .kpi-note { font-size: 11px; color: #999; margin-top: 5px; }
    
        `;

        // ✅ NO popup: usa iframe invisibile (stampa affidabile, niente blocco popup)
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.opacity = '0';
        iframe.setAttribute('aria-hidden', 'true');
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) {
            try { document.body.removeChild(iframe); } catch(_) {}
            return;
        }

        doc.open();
        doc.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
            <title>BudgetWise Report</title><style>${css}</style></head><body>${html}</body></html>`);
        doc.close();

        const win = iframe.contentWindow;
        // Stampa quando il contenuto è pronto
        setTimeout(() => {
            try { win && win.focus && win.focus(); } catch(_) {}
            try { win && win.print && win.print(); } catch(_) {}
            // Cleanup
            setTimeout(() => { try { document.body.removeChild(iframe); } catch(_) {} }, 1000);
        }, 250);

    } catch (e) {
        console.error('Errore printReport:', e);
    }
};;

BudgetWise.prototype.loadPdfLib = async function() {
    // Lazy-load jsPDF from CDN only when needed (frontend-only).
    // If the user is offline, we gracefully fallback to Print -> Save as PDF.
    if (window.jspdf && window.jspdf.jsPDF) return true;

    const loadScript = (src) => new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.head.appendChild(s);
    });

    // Prefer a stable CDN. Two attempts for resilience.
    const urls = [
        'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
        'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js'
    ];

    for (const url of urls) {
        // eslint-disable-next-line no-await-in-loop
        const ok = await loadScript(url);
        if (ok && window.jspdf && window.jspdf.jsPDF) return true;
    }
    return !!(window.jspdf && window.jspdf.jsPDF);
}

BudgetWise.prototype.downloadReportPdf = async function() {
        this._ensurePremiumI18n?.();

    try {
        this._ensurePremiumI18n?.();
        const ok = await this.loadPdfLib();
        if (!ok) {
            alert(this.t('pdfLibMissing'));
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const _pdfSafe = (s) => String(s ?? '')
            .replace(/[\u{1F300}-\u{1FAFF}]/gu,'')
            .replace(/[\u2600-\u27BF]/g,'')
            .replace(/[\u2000-\u206F]/g,' ')
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'')
            .replace(/\s+/g,' ')
            .trim();
        const _pdfStatus = (s) => _pdfSafe(s).replace(/[#�]/g,'').trim();

// ===== ULTRA PREMIUM COVER =====
try {
  const lang = (this.data && this.data.language) ? this.data.language : (this.lang || 'it');

  // Periodo per copertina
  const start = this.normalizeIsoDate?.(this.data.periodStart) || this.data.periodStart;
  const end = this.normalizeIsoDate?.(this.data.periodEnd) || this.data.periodEnd;
  const period = (start && end) ? `${start} → ${end}` : (start || end || '—');

  const coverTitle = this.t('coverTitle') || 'Decision Report';
  const periodLabel = this.t('coverPeriod') || this.t('periodLabel') || 'Period';
  const coverFooter = this.t('coverFooter') || 'Generated by WiseScore™';

if (typeof drawUltraPremiumCover === 'function') {
    await drawUltraPremiumCover(doc, {
      lang,
      title: coverTitle,
      periodLabel,
      periodValue: period,
      logoUrl: 'assets/budgetwise_lockup_dark.png',
      watermarkUrl: 'assets/ff_watermark_white.png',
      footer: coverFooter,
      subtitle: 'Decision Intelligence Platform',
    });

    doc.addPage();
  }
} catch (e) {
  console.warn('Cover skipped:', e);
}
        // Reset text color after cover (cover may set white text)
        try { doc.setTextColor(20,20,20); } catch(_) {}

        const m = this.getWiseScoreModel();
        const start = this.normalizeIsoDate?.(this.data.periodStart) || this.data.periodStart;
        const end = this.normalizeIsoDate?.(this.data.periodEnd) || this.data.periodEnd;
        const period = (start && end) ? `${start} → ${end}` : (start || end || '—');

        // Layout helpers
        const page = { w: doc.internal.pageSize.getWidth(), h: doc.internal.pageSize.getHeight() };
        const margin = 48;
        let y = margin;

        const addPageIfNeeded = (nextY) => {
            if (nextY > page.h - margin) {
                doc.addPage();
                y = margin;
            }
        };

        const title = 'BudgetWise – Decision Intelligence Platform';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(title, margin, y);
        y += 22;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(_pdfSafe(`${this.t('periodLabel')}: ${period}`), margin, y);
        y += 18;

        // WiseScore block
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(_pdfSafe(this.t('reportSectionWiseScore')), margin, y);
        y += 12;

        doc.setDrawColor(220);
        doc.setLineWidth(1);
        doc.roundedRect(margin, y, page.w - margin*2, 86, 10, 10);
        y += 24;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);
        doc.text(String(m.score), margin + 16, y + 26);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(_pdfSafe((m.insight || '').slice(0, 120)), margin + 86, y + 10, { maxWidth: page.w - margin*2 - 110 });

        // Pillars
        const pillarY = y + 40;
        const barW = 140;
        const barH = 8;
        const px = margin + 86;

        const drawPillar = (label, value, idx) => {
            const yy = pillarY + idx*18;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(_pdfSafe(`${label}: ${Math.round(value)}/100`), px, yy);
            doc.setDrawColor(220);
            doc.rect(px + 130, yy - 7, barW, barH);
            doc.setFillColor(30, 30, 30);
            doc.rect(px + 130, yy - 7, barW * Math.max(0, Math.min(1, value/100)), barH, 'F');
        };

        drawPillar(this.t('pillarStability'), m.pillars.stability, 0);
        drawPillar(this.t('pillarDiscipline'), m.pillars.discipline, 1);
        drawPillar(this.t('pillarResilience'), m.pillars.resilience, 2);

        y += 86 + 18;

        // Summary KPIs
        addPageIfNeeded(y + 110);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(_pdfSafe(this.t('reportSectionSummary')), margin, y);
        y += 12;

        const kpis = [
            [this.t('kpiIncome'), this.formatCurrency?.(m.income) ?? String(m.income)],
            [this.t('kpiFixed'), this.formatCurrency?.(m.fixed) ?? String(m.fixed)],
            [this.t('kpiVariable'), this.formatCurrency?.(m.variable) ?? String(m.variable)],
            [this.t('kpiNet'), this.formatCurrency?.(m.net) ?? String(m.net)],
        ];

        const boxW = (page.w - margin*2 - 12) / 2;
        const boxH = 52;

        for (let i = 0; i < kpis.length; i++) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const bx = margin + col * (boxW + 12);
            const by = y + row * (boxH + 12);

            doc.setDrawColor(220);
            doc.roundedRect(bx, by, boxW, boxH, 10, 10);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(kpis[i][0], bx + 14, by + 18);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text(kpis[i][1], bx + 14, by + 38);
        }
        y += (boxH + 12) * 2 + 16;


        // Detailed tables
        const drawTable = (titleText, headers, rows) => {
            addPageIfNeeded(y + 40);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(titleText, margin, y);
            y += 14;

            const tableX = margin;
            const tableW = page.w - margin * 2;
            const rowH = 16;

            // Column widths (sum = 1)
            const ratios = [0.14, 0.38, 0.22, 0.12, 0.14]; // date, desc, category, status, amount
            const colW = ratios.map(r => tableW * r);

            const drawHeader = () => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setDrawColor(220);
                doc.setFillColor(245, 245, 245);
                let xx = tableX;
                for (let i = 0; i < headers.length; i++) {
                    doc.rect(xx, y, colW[i], rowH, 'FD');
                    doc.text(String(headers[i] || ''), xx + 6, y + 11, { maxWidth: colW[i] - 12 });
                    xx += colW[i];
                }
                y += rowH;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
            };

            drawHeader();

            const drawRow = (cells) => {
                if (y + rowH > page.h - margin) {
                    doc.addPage();
                    y = margin;
                    drawHeader();
                }
                let xx = tableX;
                for (let i = 0; i < headers.length; i++) {
                    doc.setDrawColor(235);
                    doc.rect(xx, y, colW[i], rowH);
                    const txt = (cells[i] ?? '').toString();
                    const alignRight = (i === headers.length - 1);
                    if (alignRight) {
                        doc.text(txt, xx + colW[i] - 6, y + 11, { align: 'right', maxWidth: colW[i] - 12 });
                    } else {
                        doc.text(txt, xx + 6, y + 11, { maxWidth: colW[i] - 12 });
                    }
                    xx += colW[i];
                }
                y += rowH;
            };

            if (!rows || rows.length === 0) {
                drawRow([this.t('noData'), '—', '—', '—', '—']);
                y += 8;
                return;
            }

            rows.forEach(r => drawRow(r));
            y += 10;
        };

        addPageIfNeeded(y + 60);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(_pdfSafe(this.t('reportSectionDetails')), margin, y);
        y += 14;

        const hdr = [
            this.t('colDate'),
            this.t('colDescription'),
            this.t('colCategory'),
            this.t('colStatus'),
            this.t('colAmount'),
        ];

        // Incomes (array)
        const incomes = (Array.isArray(this.data.incomes) ? this.data.incomes : [])
            .filter(i => i && i.date && (!start || i.date >= start) && (!end || i.date <= end))
            .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

        const incomeRows = incomes.map(i => [
            (i.date || '—'),
            (i.desc || i.name || '—'),
            (this.t('categoryIncome') || '—'),
            '—',
            this.formatCurrency?.(Number(i.amount || 0)) ?? String(i.amount || 0),
        ]);

        drawTable(this.t('tableIncomes'), hdr, incomeRows);

        // Fixed occurrences (paid/planned)
        const occs = (this.getFixedOccurrencesInPeriod?.() || []);
        const fixedRows = occs.map(o => [
            (o.dueDate || '—'),
            (o.name || '—'),
            this.t('categoryFixed') || '—',
            o.paid ? this.t('fixedPaid') : this.t('fixedPlanned'),
            this.formatCurrency?.(Number(o.amount || 0)) ?? String(o.amount || 0),
        ]);

        drawTable(this.t('tableFixed'), hdr, fixedRows);

        // Variable expenses (flat object)
        const vars = (this.getVariableExpensesInPeriodFlat?.() || [])
            .slice()
            .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

        const varRows = vars.map(v => [
            (v.date || '—'),
            (v.name || '—'),
            (v.category || this.t('uncategorized') || '—'),
            '—',
            this.formatCurrency?.(Number(v.amount || 0)) ?? String(v.amount || 0),
        ]);

        drawTable(this.t('tableVariable'), hdr, varRows);

        // Timeline
        addPageIfNeeded(y + 40);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(_pdfSafe(this.t('wisescoreTimeline')), margin, y);
        y += 14;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        const items = (m.timeline || []);
        for (const it of items) {
            // Avoid emojis/icons in PDF: jsPDF WinAnsi encoding can produce garbled characters.
            const safeTitle = (it && it.title) ? String(it.title) : '';
            const safeMeta = (it && it.meta) ? String(it.meta) : '';
            const line = `${safeTitle}${safeMeta ? ' — ' + safeMeta : ''}`;
            addPageIfNeeded(y + 36);
            doc.text(line, margin, y, { maxWidth: page.w - margin*2 });
            y += 14;
            if (it.desc) {
                doc.setFontSize(9);
                doc.text(String(it.desc), margin + 14, y, { maxWidth: page.w - margin*2 - 14 });
                doc.setFontSize(10);
                y += 14;
            }
            y += 6;
        }

        // Footer
        const stamp = new Date().toISOString().slice(0, 10);
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(_pdfSafe(`WiseMind™ / WiseScore™ • ${stamp}`), margin, page.h - 24);

        doc.save(`BudgetWise_Report_${(start||'')}_${(end||'')}.pdf`);
    } catch (e) {
        console.error(e);
        alert(this.t('pdfLibMissing'));
    }
}

BudgetWise.prototype.buildReportHtml = function() {
    this._ensurePremiumI18n?.();

    const m = this.getWiseScoreModel();
    const start = this.normalizeIsoDate?.(this.data.periodStart) || this.data.periodStart;
    const end = this.normalizeIsoDate?.(this.data.periodEnd) || this.data.periodEnd;
    const period = (start && end) ? `${start} → ${end}` : (start || end || '—');


    const tMaybe = (s) => {
        if (!s) return s;
        try {
            const tr = this.t(String(s));
            return (tr !== s) ? tr : s;
        } catch (_) { return s; }
    };
    const insightText = tMaybe(m.insight);
    const kpi = (labelKey, value, note='') => `
        <div class="kpi">
            <div class="kpi-label">${this.t(labelKey)}</div>
            <div class="kpi-value">${this.formatCurrency?.(value) ?? value}</div>
            ${note ? `<div class="kpi-note">${note}</div>` : ''}
        </div>
    `;

    const timelineHtml = (m.timeline || []).map(it => `
        <div class="timeline-item">
            <div class="timeline-ico">${it.ico || '•'}</div>
            <div>
                <div class="timeline-title">
                    <span>${this.escapeHtml?.(tMaybe(it.title)) ?? tMaybe(it.title)}</span>
                    <span class="timeline-meta">${this.escapeHtml?.(tMaybe(it.meta)) ?? tMaybe(it.meta)}</span>
                </div>
                ${(it.desc ? `<div class="timeline-desc">${this.escapeHtml?.(tMaybe(it.desc)) ?? tMaybe(it.desc)}</div>` : '')}
            </div>
        </div>
    `).join('');

    return `
        <div class="report-section">
            <h3>${this.t('reportSectionSummary')}</h3>
            <div class="report-kpis">
                <div class="kpi">
                        <div class="kpi-label">${this.t('periodLabel')}</div>
                        <div class="kpi-value">${this.escapeHtml?.(period) ?? period}</div>
                        <div class="kpi-note"></div>
                    </div>
                ${kpi('kpiIncome', m.income)}
                ${kpi('kpiFixed', m.fixed, m.fixedUnpaid>0 ? `${this.t('eventUnpaidFixed')}: ${this.formatCurrency?.(m.fixedUnpaid) ?? m.fixedUnpaid}` : '')}
                ${kpi('kpiNet', m.net)}
            </div>
        </div>

        <div class="report-section">
            <h3>${this.t('reportSectionWiseScore')}</h3>
            <div class="wisescore-grid">
                <div class="wisescore-main">
                    <div class="wisescore-value">${m.score}</div>
                    <div class="wisescore-sub">${this.escapeHtml?.(insightText) ?? insightText}</div>
                </div>
                <div class="wisescore-pillars">
                    <div class="pillar">
                        <div class="pillar-label">${this.t('pillarStability')}</div>
                        <div class="pillar-bar"><div class="pillar-fill" style="width:${this.clamp100(m.pillars.stability)}%"></div></div>
                        <div class="pillar-val">${this.clamp100(m.pillars.stability)}%</div>
                    </div>
                    <div class="pillar">
                        <div class="pillar-label">${this.t('pillarDiscipline')}</div>
                        <div class="pillar-bar"><div class="pillar-fill" style="width:${this.clamp100(m.pillars.discipline)}%"></div></div>
                        <div class="pillar-val">${this.clamp100(m.pillars.discipline)}%</div>
                    </div>
                    <div class="pillar">
                        <div class="pillar-label">${this.t('pillarResilience')}</div>
                        <div class="pillar-bar"><div class="pillar-fill" style="width:${this.clamp100(m.pillars.resilience)}%"></div></div>
                        <div class="pillar-val">${this.clamp100(m.pillars.resilience)}%</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="report-section">
            <h3>${this.t('reportSectionTotals')}</h3>
            <div class="report-kpis">
                ${kpi('kpiIncome', m.income)}
                ${kpi('kpiFixed', m.fixed)}
                ${kpi('kpiVariable', m.variable)}
                ${kpi('kpiNet', m.net)}
            </div>
        </div>

        <div class="report-section">
            <h3>${this.t('reportSectionTimeline')}</h3>
            <div class="timeline">${timelineHtml}</div>
        </div>
    `;
}

// ===== Ensure Premium i18n merged (report/pdf) =====
BudgetWise.prototype._ensurePremiumI18n = function() {
  try {
    if (!this.translations || typeof this.translations !== 'object') this.translations = {};
    const lang = (this.data && this.data.language) ? this.data.language : 'it';
    const has = !!(this.translations[lang] && this.translations[lang].reportTitle);
    if (!has && window.app && window.app.getPremiumModuleTranslations && window.app.mergeTranslations) {
      // merge into *this* instance
      window.app.mergeTranslations.call(this, window.app.getPremiumModuleTranslations());
    }
  } catch(e) {}
};

BudgetWise.prototype.handleUrlAction = function() {
    try {
        const u = new URL(window.location.href);
        const action = u.searchParams.get('action');
        if (action === 'report') {
            // open after UI ready
            setTimeout(() => this.openReport(), 150);
        }
    } catch {}
}

// ===== Premium modules helpers (SAFE GLOBAL) =====
window.app = window.app || {};


// ✅ PATCH: define missing premium helpers to avoid runtime crashes
window.app.updateLicenseStatus = window.app.updateLicenseStatus || function () {
    try {
        // Prefer real instance if available
        const inst = (window.BudgetWiseApp && typeof window.BudgetWiseApp === 'object') ? window.BudgetWiseApp : null;
        const lic = (inst && inst.license) ? inst.license : (window.app && window.app.license ? window.app.license : null);

        let status = 'free';
        if (lic && typeof lic.getStatus === 'function') {
            status = lic.getStatus() || 'free';
        } else if (lic && typeof lic.hasFullPremiumAccess === 'function' && lic.hasFullPremiumAccess()) {
            status = 'premium';
        }

        const badgeWrap = document.getElementById('licenseStatus');
        if (badgeWrap) {
            badgeWrap.classList.remove('free', 'trial', 'premium');
            badgeWrap.classList.add(status);
            const badge = badgeWrap.querySelector('.license-badge');
            if (badge) {
                badge.textContent = (status === 'premium') ? 'Premium' : (status === 'trial') ? 'Trial' : 'Free';
            }
        }

        const banner = document.getElementById('premiumBanner');
        if (banner) {
            banner.style.display = (status === 'free') ? 'block' : 'none';
        }

        // Sync UI limits with license status
        if (inst && typeof inst.applyFreeLimitsToUI === 'function') {
            inst.applyFreeLimitsToUI();
        }
    } catch (e) {
        console.warn('⚠️ updateLicenseStatus error:', e);
    }
};

window.app.enablePremiumFeatures = window.app.enablePremiumFeatures || function () {
    try {
        const inst = (window.BudgetWiseApp && typeof window.BudgetWiseApp === 'object') ? window.BudgetWiseApp : null;
        if (inst && typeof inst.applyFreeLimitsToUI === 'function') {
            inst.applyFreeLimitsToUI();
        }
        const banner = document.getElementById('premiumBanner');
        if (banner) banner.style.display = 'none';
    } catch (e) {
        console.warn('⚠️ enablePremiumFeatures error:', e);
    }
};


// Merge translations into "this" (the BudgetWise app instance)
window.app.mergeTranslations = function(extra) {
  if (!extra || typeof extra !== 'object') return;
  if (!this.translations || typeof this.translations !== 'object') this.translations = {};
  for (const [lang, dict] of Object.entries(extra)) {
    if (!this.translations[lang]) this.translations[lang] = {};
    Object.assign(this.translations[lang], dict || {});
  }
};

// Premium translations ONLY (Report / WiseScore / PDF)
window.app.getPremiumModuleTranslations = function() {
  return {
    it: {
      reportTitle: 'Report Premium',
      print: 'Stampa',
      reportDownloadPdf: '⬇️ PDF',
      close: 'Chiudi',
      reportSectionSummary: 'Sintesi periodo',
      reportSectionWiseScore: 'WiseScore™',
      reportSectionTotals: 'Totali periodo',
      reportSectionTimeline: 'Timeline WiseScore™',
      reportSectionDetails: 'Dettaglio',
      tableIncomes: 'Entrate – dettaglio',
      tableFixed: 'Spese fisse – scadenze',
      tableVariable: 'Spese variabili – dettaglio',
      colDate: 'Data',
      colDescription: 'Voce',
      colCategory: 'Categoria',
      colStatus: 'Stato',
      colAmount: 'Importo',
      noData: 'Nessun dato',
      periodLabel: 'Periodo',
      kpiIncome: 'Entrate',
      kpiFixed: 'Fisse',
      kpiVariable: 'Variabili',
      kpiNet: 'Saldo',
      wisescoreTitle: 'WiseScore™',
      wisescoreInsightExcellent: 'Eccellente controllo',
      wisescoreInsightGood: 'Buon equilibrio',
      wisescoreInsightOk: 'Serve ottimizzare',
      wisescoreInsightBad: 'Attenzione: pressione alta',
      pillarStability: 'Stabilità',
      pillarDiscipline: 'Disciplina',
      pillarResilience: 'Resilienza',
      eventPeriodStart: 'Inizio periodo',
      eventPeriodEnd: 'Fine periodo',
      eventIncome: 'Entrate rilevate',
      eventUnpaidFixed: 'Fisse non coperte',
      eventPeakSpend: 'Picco spese variabili',
      eventSavings: 'Ritmo risparmio',
      coverTitle: 'Rapporto Decisionale',
      coverPeriod: 'Periodo',
      coverFooter: 'Generato da WiseScore™',
      pdfLibMissing: 'Libreria PDF non disponibile'
    },
    en: {
      reportTitle: 'Premium Report',
      print: 'Print',
      reportDownloadPdf: '⬇️ PDF',
      close: 'Close',
      reportSectionSummary: 'Period summary',
      reportSectionWiseScore: 'WiseScore™',
      reportSectionTotals: 'Period totals',
      reportSectionTimeline: 'WiseScore™ timeline',
      reportSectionDetails: 'Details',
      tableIncomes: 'Income – details',
      tableFixed: 'Fixed expenses – due dates',
      tableVariable: 'Variable expenses – details',
      colDate: 'Date',
      colDescription: 'Item',
      colCategory: 'Category',
      colStatus: 'Status',
      colAmount: 'Amount',
      noData: 'No data',
      periodLabel: 'Period',
      kpiIncome: 'Income',
      kpiFixed: 'Fixed',
      kpiVariable: 'Variable',
      kpiNet: 'Net',
      wisescoreTitle: 'WiseScore™',
      pillarStability: 'Stability',
      pillarDiscipline: 'Discipline',
      pillarResilience: 'Resilience',
      eventPeriodStart: 'Period start',
      eventPeriodEnd: 'Period end',
      eventIncome: 'Income logged',
      eventUnpaidFixed: 'Uncovered fixed',
      eventPeakSpend: 'Peak variable spend',
      eventSavings: 'Savings pace',
      coverTitle: 'Decision Report',
      coverPeriod: 'Period',
      coverFooter: 'Generated by WiseScore™',
      pdfLibMissing: 'PDF library missing'
    },
    es: {},
    fr: {}
  };
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
    if (typeof window.app.updateLicenseStatus === 'function') window.app.updateLicenseStatus();
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

// Cover Ultra Premium — helper for jsPDF
async function drawUltraPremiumCover(doc, opts = {}) {
  const {
    lang = 'en',
    title = 'Decision Report',
    periodLabel = 'Period',
    periodValue = '',
    footer = 'Generated by WiseScore™',
    logoUrl = 'assets/budgetwise_lockup_dark.png',
    watermarkUrl = 'assets/ff_watermark_white.png',
    brandName = 'BudgetWise',
    subtitle = 'Decision Intelligence Platform',
  } = opts;

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const GState = (doc && doc.GState) || (window.jspdf && window.jspdf.GState) || null;
  const setOpacity = (v) => {
    try {
      if (doc.setGState && GState) doc.setGState(new GState({ opacity: v }));
    } catch {}
  };

  // === Background (executive dark blue) ===
  doc.setFillColor(6, 18, 42);
  doc.rect(0, 0, pageW, pageH, 'F');

  // Soft radial-ish glow (simulated with big translucent circles)
  doc.setFillColor(46, 123, 255);
  setOpacity(0.12);
  doc.circle(pageW * 0.62, pageH * 0.38, Math.max(pageW, pageH) * 0.45, 'F');
  setOpacity(0.06);
  doc.circle(pageW * 0.30, pageH * 0.20, Math.max(pageW, pageH) * 0.38, 'F');
  setOpacity(1);

  // === Watermark (FF monogram, white ~6% opacity) ===
  try {
    const wm = await fetchAsDataURL(watermarkUrl);
    setOpacity(0.06);
    const wmW = pageW * 0.72;
    const wmH = wmW;
    doc.addImage(
      wm,
      'PNG',
      (pageW - wmW) / 2,
      (pageH - wmH) / 2 + pageH * 0.04,
      wmW,
      wmH,
      undefined,
      'FAST'
    );
  } catch (_) {
    // ignore watermark if unavailable
  }
  setOpacity(1);

  // === Logo (top center) ===
  let logoH = 0;
  try {
    const logo = await fetchAsDataURL(logoUrl);
    const logoW = pageW * 0.64;
    logoH = logoW * 0.28; // lockup ratio (approx)
    doc.addImage(logo, 'PNG', (pageW - logoW) / 2, pageH * 0.10, logoW, logoH, undefined, 'FAST');
  } catch (_) {
    // fallback: text brand
    doc.setTextColor(242, 246, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text(brandName, pageW / 2, pageH * 0.13, { align: 'center' });
  }

  // Subtitle (Decision Intelligence Platform)
  doc.setTextColor(242, 246, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(subtitle.toUpperCase(), pageW / 2, pageH * 0.10 + (logoH || 0) + 18, { align: 'center' });

  // === Center title ===
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(34);
  doc.setTextColor(242, 246, 255);
  doc.text(title, pageW / 2, pageH * 0.52, { align: 'center', maxWidth: pageW * 0.84 });

  // Period chip (optional)
  if (periodValue) {
    const chipY = pageH * 0.60;

    setOpacity(0.18);
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(pageW * 0.22, chipY - 14, pageW * 0.56, 28, 6, 6, 'F');
    setOpacity(1);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(242, 246, 255);
    doc.text(`${periodLabel.toUpperCase()}  ${periodValue}`, pageW / 2, chipY + 4, { align: 'center' });
  }

  // === Footer ===
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(242, 246, 255);
  setOpacity(0.65);
  doc.text(footer.toUpperCase(), pageW / 2, pageH - 22, { align: 'center' });
  setOpacity(1);
}

async function fetchAsDataURL(url) {
  const res = await fetch(url, { cache: 'force-cache' });
  if (!res.ok) throw new Error('Failed to load asset: ' + url);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
