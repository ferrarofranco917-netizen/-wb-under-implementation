// ============================================
// BUDGETWISE 2.0 - FREEMIUM LICENSE SYSTEM
// ============================================

class BudgetWiseLicense {
    constructor() {
        this.licenseKey = localStorage.getItem('bw-license-key') || null;
        this.licenseEmail = localStorage.getItem('bw-license-email') || null;
        this.isPremium = this.checkPremiumStatus();
        this.trialUsed = localStorage.getItem('bw-trial-used') === 'true';
        this.trialStart = localStorage.getItem('bw-trial-start') || null;
        
        // 🆓 LIMITAZIONI FREE VS PREMIUM
        this.limits = {
            free: {
                maxTransactions: 30,
                maxFixedExpenses: 5,
                maxSavingsPercent: 15,
                maxGoals: 1,
                customCategories: false,
                csvImport: false,
                aiAssistant: 'basic',
                voiceRecognition: false,
                cloudSync: false,
                colorCustomization: false,
                dateFormatCustom: false,
                calendarExport: false,
                categoryLearning: false,
                advancedFixedFormat: false
            },
            premium: {
                maxTransactions: Infinity,
                maxFixedExpenses: Infinity,
                maxSavingsPercent: 50,
                maxGoals: Infinity,
                customCategories: true,
                csvImport: true,
                aiAssistant: 'advanced',
                voiceRecognition: true,
                cloudSync: true,
                colorCustomization: true,
                dateFormatCustom: true,
                calendarExport: true,
                categoryLearning: true,
                advancedFixedFormat: true
            }
        };
        
        this.categories = ['Alimentari', 'Trasporti', 'Altro'];
    }
    
    checkPremiumStatus() {
        const license = localStorage.getItem('bw-license-valid');
        const expiry = localStorage.getItem('bw-license-expiry');
        
        if (!license || !expiry) return false;
        
        const expiryDate = new Date(expiry);
        const now = new Date();
        
        return now < expiryDate && license === 'valid';
    }
    
    getCurrentLimits() {
        if (this.hasFullPremiumAccess()) return this.limits.premium;
        return this.limits.free;
    }
    
    canAddTransaction(currentCount) {
        const limits = this.getCurrentLimits();
        return currentCount < limits.maxTransactions;
    }
    
    canAddFixedExpense(currentCount) {
        const limits = this.getCurrentLimits();
        return currentCount < limits.maxFixedExpenses;
    }
    
    canUseFeature(feature) {
        const limits = this.getCurrentLimits();
        return limits[feature] === true;
    }
    
    getMaxSavingsPercent() {
        return this.getCurrentLimits().maxSavingsPercent;
    }
    
    isFeatureLocked(feature) {
        return !this.canUseFeature(feature);
    }
    
    startTrial() {
        if (this.trialUsed) return false;
        
        this.trialUsed = true;
        this.trialStart = new Date().toISOString();
        localStorage.setItem('bw-trial-used', 'true');
        localStorage.setItem('bw-trial-start', this.trialStart);
        
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);
        localStorage.setItem('bw-trial-end', trialEnd.toISOString());
        
        return true;
    }
    
    isTrialActive() {
        if (!this.trialUsed || !this.trialStart) return false;
        
        const trialEnd = new Date(localStorage.getItem('bw-trial-end') || '');
        const now = new Date();
        
        return now < trialEnd;
    }
    
    hasFullPremiumAccess() {
        return this.isPremium || this.isTrialActive();
    }
    
    async activateLicense(email, key) {
        try {
            // Simulazione validazione - in produzione usa un servizio reale
            if (key && email) {
                this.licenseKey = key;
                this.licenseEmail = email;
                this.isPremium = true;
                
                const expiry = new Date();
                expiry.setDate(expiry.getDate() + 30);
                
                localStorage.setItem('bw-license-key', key);
                localStorage.setItem('bw-license-email', email);
                localStorage.setItem('bw-license-valid', 'valid');
                localStorage.setItem('bw-license-expiry', expiry.toISOString());
                
                return true;
            }
        } catch (error) {
            console.error('License validation failed:', error);
        }
        
        return false;
    }
    
    getUpgradeMessage(feature) {
        const messages = {
            transactions: 'Hai raggiunto il limite di 30 transazioni mensili!',
            fixedExpenses: 'Hai raggiunto il limite di 5 spese fisse attive!',
            customCategories: 'Crea categorie personalizzate e organizza meglio le tue spese!',
            csvImport: 'Importa i tuoi estratti conto con un clic! 📊',
            aiAssistant: 'Chiedi consigli al tuo assistente finanziario AI avanzato! 🤖',
            voiceRecognition: 'Aggiungi spese con la voce, senza scrivere! 🎤',
            cloudSync: 'Sincronizza i dati su tutti i dispositivi! 🔄',
            colorCustomization: 'Personalizza l\'app con i tuoi colori preferiti! 🎨',
            calendarExport: 'Esporta in Google Calendar e pianifica! 📅',
            advancedFixedFormat: 'Visualizza le scadenze in mesi e anni! 📆'
        };
        
        return messages[feature] || 'Questa funzionalità è disponibile nella versione Premium! 💎';
    }
    
    getRemainingDays() {
        if (this.isPremium) {
            const expiry = new Date(localStorage.getItem('bw-license-expiry') || '');
            const now = new Date();
            const diff = expiry - now;
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        }
        
        if (this.isTrialActive()) {
            const trialEnd = new Date(localStorage.getItem('bw-trial-end') || '');
            const now = new Date();
            const diff = trialEnd - now;
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        }
        
        return 0;
    }
    
    getStatus() {
        if (this.isPremium) return 'premium';
        if (this.isTrialActive()) return 'trial';
        return 'free';
    }
    
    getPlanInfo() {
        const status = this.getStatus();
        const remainingDays = this.getRemainingDays();
        
        switch(status) {
            case 'premium':
                return {
                    name: 'Premium',
                    status: 'Attivo',
                    remaining: `${remainingDays} giorni rimanenti`,
                    color: '#10b981'
                };
            case 'trial':
                return {
                    name: 'Trial Premium',
                    status: 'Attivo',
                    remaining: `${remainingDays} giorni rimanenti`,
                    color: '#f59e0b'
                };
            default:
                return {
                    name: 'Free',
                    status: 'Limitato',
                    remaining: `${30 - this.getRemainingTransactions()} transazioni rimaste`,
                    color: '#6b7280'
                };
        }
    }
    
    getRemainingTransactions() {
        const count = window.app?.calculateMonthlyTransactions?.() || 0;
        return Math.max(0, this.limits.free.maxTransactions - count);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BudgetWiseLicense;
}

try { globalThis.BudgetWiseLicense = BudgetWiseLicense; } catch(e) {}
try { window.BudgetWiseLicense = BudgetWiseLicense; } catch(e) {}
