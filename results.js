// Configuration
const API_ENDPOINT = "http://your-api-endpoint.com/results"; // Replace with your actual API endpoint
const adminCredentials = {
    username: "admin",
    password: "admin123" // In production, use proper hashing and environment variables
};

// DOM Elements
const publicResultsContainer = document.getElementById('public-results-container');
const adminLogin = document.getElementById('admin-login');
const adminForm = document.getElementById('admin-form');
const adminControls = document.getElementById('admin-controls');
const refreshBtn = document.getElementById('refresh-results');
const toggleReleaseBtn = document.getElementById('toggle-release');
const adminStats = document.getElementById('admin-stats');
const lastUpdated = document.getElementById('last-updated');

// State
let isAdmin = false;
let resultsData = {};
let isReleased = true; // Default to showing results

// Initialize the page
async function init() {
    // Check if admin session exists (in a real app, use proper session management)
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
        try {
            const session = JSON.parse(adminSession);
            if (session.expires > Date.now()) {
                isAdmin = true;
                adminLogin.style.display = 'none';
                adminControls.style.display = 'block';
            }
        } catch (e) {
            console.error("Session parsing error:", e);
        }
    }
    
    await fetchResults();
    setupEventListeners();
}

// Fetch results from server
async function fetchResults() {
    try {
        // In a real app, this would be an actual API call
        // const response = await fetch(API_ENDPOINT);
        // resultsData = await response.json();
        
        // For demo purposes, we'll use mock data
        resultsData = {
            candidates: [
                { id: 1, name: "John Doe", party: "Democratic Party", votes: 1250 },
                { id: 2, name: "Jane Smith", party: "Republican Party", votes: 980 },
                { id: 3, name: "Alex Johnson", party: "Green Party", votes: 320 },
                { id: 4, name: "Sarah Williams", party: "Libertarian Party", votes: 275 }
            ],
            totalVoters: 3000,
            lastUpdated: new Date().toISOString(),
            isReleased: true
        };
        
        isReleased = resultsData.isReleased;
        displayResults();
    } catch (error) {
        console.error("Error fetching results:", error);
        publicResultsContainer.innerHTML = `<p class="error">Error loading results. Please try again later.</p>`;
    }
}

// Display results
function displayResults() {
    if (!isReleased && !isAdmin) {
        publicResultsContainer.innerHTML = `<p>Results are not yet available to the public.</p>`;
        return;
    }
    
    const totalVotes = resultsData.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
    
    let html = '';
    resultsData.candidates.forEach(candidate => {
        const percentage = totalVotes > 0 ? (candidate.votes / totalVotes * 100).toFixed(1) : 0;
        
        html += `
            <div class="result-bar">
                <div class="candidate-result">
                    <span>${candidate.name} (${candidate.party})</span>
                    <span>${candidate.votes} votes (${percentage}%)</span>
                </div>
                <div class="bar-container">
                    <div class="bar" style="width: ${percentage}%">${percentage}%</div>
                </div>
            </div>
        `;
    });
    
    html += `
        <div class="total-votes">
            Total Votes Cast: ${totalVotes} (${((totalVotes / resultsData.totalVoters) * 100).toFixed(1)}% turnout)
        </div>
    `;
    
    publicResultsContainer.innerHTML = html;
    lastUpdated.textContent = `Last updated: ${new Date(resultsData.lastUpdated).toLocaleString()}`;
    
    if (isAdmin) {
        adminStats.innerHTML = `
            <h3>Statistics</h3>
            <p>Total Registered Voters: ${resultsData.totalVoters}</p>
            <p>Voter Turnout: ${((totalVotes / resultsData.totalVoters) * 100).toFixed(1)}%</p>
            <p>Results Status: ${isReleased ? 'Released to public' : 'Hidden from public'}</p>
        `;
    }
}

// Set up event listeners
function setupEventListeners() {
    // Admin login
    adminForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        if (username === adminCredentials.username && password === adminCredentials.password) {
            isAdmin = true;
            // Set admin session (in a real app, use proper session management)
            localStorage.setItem('adminSession', JSON.stringify({
                username: username,
                expires: Date.now() + (8 * 60 * 60 * 1000) // 8 hour session
            }));
            adminLogin.style.display = 'none';
            adminControls.style.display = 'block';
            await fetchResults();
        } else {
            alert('Invalid admin credentials');
        }
    });
    
    // Refresh results
    refreshBtn.addEventListener('click', async function() {
        await fetchResults();
        alert('Results refreshed');
    });
    
    // Toggle results visibility
    toggleReleaseBtn.addEventListener('click', async function() {
        // In a real app, this would make an API call to update the release status
        isReleased = !isReleased;
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        displayResults();
        alert(`Results are now ${isReleased ? 'released to the public' : 'hidden from the public'}`);
    });
}

// Initialize the page when loaded
document.addEventListener('DOMContentLoaded', init);