// Remplacez par votre vrai token Clash Royale
const API_TOKEN = 'VOTRE_TOKEN_CLASH_ROYALE_ICI';
const API_URL = 'https://api.clashroyale.com/v1';

// Fonction pour rechercher un joueur
async function searchPlayer() {
    const input = document.getElementById('playerTag');
    const tag = input.value.trim();
    
    if (!tag) {
        showError('Veuillez entrer un tag de joueur');
        return;
    }
    
    // Nettoyer le tag
    const cleanTag = tag.replace('#', '').toUpperCase();
    
    // Afficher le loading
    showLoading();
    hideError();
    hideStats();
    
    try {
        const response = await fetch(`${API_URL}/players/%23${cleanTag}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Joueur non trouvé. Vérifiez le tag.');
            } else if (response.status === 403) {
                throw new Error('Token API invalide. Vérifiez votre configuration.');
            } else {
                throw new Error('Erreur lors de la récupération des données.');
            }
        }
        
        const data = await response.json();
        displayStats(data);
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Afficher les statistiques
function displayStats(data) {
    const statsContainer = document.getElementById('stats');
    
    const html = `
        <div class="player-header">
            <div class="player-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
            </div>
            <div class="player-info">
                <h2>${data.name}</h2>
                <p>${data.tag}</p>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                        <path d="M4 22h16"></path>
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                    Trophées
                </div>
                <div class="stat-value">${data.trophies.toLocaleString()}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    Meilleur score
                </div>
                <div class="stat-value">${data.bestTrophies.toLocaleString()}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    Niveau
                </div>
                <div class="stat-value">${data.expLevel}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                    </svg>
                    Victoires
                </div>
                <div class="stat-value">${data.wins.toLocaleString()}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Défaites
                </div>
                <div class="stat-value">${data.losses.toLocaleString()}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                        <path d="M4 22h16"></path>
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                    Arène
                </div>
                <div class="stat-value">${data.arena.name}</div>
            </div>
        </div>
        
        ${data.clan ? `
            <div class="club-info">
                <h3>Clan</h3>
                <p>${data.clan.name}</p>
            </div>
        ` : ''}
    `;
    
    statsContainer.innerHTML = html;
    statsContainer.classList.remove('hidden');
}

// Fonctions utilitaires
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    document.getElementById('error').classList.add('hidden');
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('searchBtn').disabled = true;
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('searchBtn').disabled = false;
}

function hideStats() {
    document.getElementById('stats').classList.add('hidden');
}

// Permettre la recherche avec la touche Entrée
document.getElementById('playerTag').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPlayer();
    }
});
