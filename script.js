let votesData = {};
let isAdmin = false;
const adminCredentials = {
    username: "admin",
    password: "admin123" // In real system, use proper hashing and environment variables
};

// Sample candidates data (in a real app, this would come from a server)
const candidates = [
    {
        id: 1,
        name: "John Doe",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        description: "Experienced leader with a vision for change"
    },
    {
        id: 2,
        name: "Jane Smith",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        description: "Strong advocate for economic reform"
    },
    {
        id: 3,
        name: "Alex Johnson",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        description: "Environmental activist and community organizer"
    },
    {
        id: 4,
        name: "Sarah Williams",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        description: "Champion of individual freedoms and small government"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminLogin = document.getElementById('admin-login');
    const adminForm = document.getElementById('admin-form');
    const resultsSection = document.getElementById('results-section');
    const resultsContainer = document.getElementById('results-container');
    const publicResults = document.getElementById('public-results');
    const publicResultsContainer = document.getElementById('public-results-container');
    const releaseResultsBtn = document.getElementById('release-results');
    const hideResultsBtn = document.getElementById('hide-results');
    const voterForm = document.getElementById('voter-form');
    const otpForm = document.getElementById('otp-form');
    const verifyOtpForm = document.getElementById('verify-otp-form');
    const votingForm = document.getElementById('voting-form');
    const successMessage = document.getElementById('success-message');
    const candidatesList = document.getElementById('candidates-list');
    const submitVoteBtn = document.getElementById('submit-vote');
    
    // Variables to store data
    let generatedOtp = '';
    let voterData = {};
    let selectedCandidate = null;
    
    // Initialize votes data
    function initializeVotes() {
        candidates.forEach(candidate => {
            votesData[candidate.id] = {
                name: candidate.name,
                party: candidate.party,
                votes: 0
            };
        });
    }
    
    // Store a vote
    function storeVote(candidateId) {
        votesData[candidateId].votes++;
        console.log('Updated votes:', votesData);
    }
    
    // Generate a random 6-digit OTP
    function generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    // Display candidates
    function displayCandidates() {
        candidatesList.innerHTML = '';
        candidates.forEach(candidate => {
            const card = document.createElement('div');
            card.className = 'candidate-card';
            card.innerHTML = `
                <img src="${candidate.image}" alt="${candidate.name}">
                <h3>${candidate.name}</h3>
                <p><strong>Party:</strong> ${candidate.party}</p>
                <p>${candidate.description}</p>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.candidate-card').forEach(c => {
                    c.classList.remove('selected');
                });
                card.classList.add('selected');
                selectedCandidate = candidate.id;
            });
            candidatesList.appendChild(card);
        });
    }
    
    // Display results
    function displayResults(container, isPublic = false) {
        const totalVotes = Object.values(votesData).reduce((sum, candidate) => sum + candidate.votes, 0);
        
        container.innerHTML = '';
        
        Object.values(votesData).forEach(candidate => {
            const percentage = totalVotes > 0 ? (candidate.votes / totalVotes * 100).toFixed(1) : 0;
            
            const resultElement = document.createElement('div');
            resultElement.className = 'result-bar';
            resultElement.innerHTML = `
                <div class="candidate-result">
                    <span>${candidate.name} (${candidate.party})</span>
                    <span>${candidate.votes} votes (${percentage}%)</span>
                </div>
                <div class="bar-container">
                    <div class="bar" style="width: ${percentage}%">${percentage}%</div>
                </div>
            `;
            container.appendChild(resultElement);
        });
        
        const totalElement = document.createElement('div');
        totalElement.className = 'total-votes';
        totalElement.textContent = `Total Votes Cast: ${totalVotes}`;
        container.appendChild(totalElement);
        
        if (!isPublic && isAdmin) {
            const controls = document.createElement('div');
            controls.className = 'admin-controls';
            controls.innerHTML = `
                <h3>Admin Controls</h3>
                <p>Total registered voters: 1000</p>
                <p>Voter turnout: ${((totalVotes / 1000) * 100).toFixed(1)}%</p>
            `;
            container.appendChild(controls);
        }
    }
    
    // Initialize the application
    function init() {
        initializeVotes();
        
        // Voter registration form submission
        voterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            voterData = {
                voterId: document.getElementById('voter-id').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };
            
            // Generate OTP (in a real app, this would be sent to the user's email/phone)
            generatedOtp = generateOTP();
            alert(`OTP sent to your email and phone (demo only): ${generatedOtp}`);
            
            // Show OTP form
            voterForm.parentElement.style.display = 'none';
            otpForm.style.display = 'block';
        });
        
        // OTP verification form submission
        verifyOtpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const enteredOtp = document.getElementById('otp').value;
            
            if (enteredOtp === generatedOtp) {
                // OTP verified - show voting form
                otpForm.style.display = 'none';
                votingForm.style.display = 'block';
                displayCandidates();
            } else {
                alert('Invalid OTP. Please try again.');
            }
        });
        
        // Submit vote
        submitVoteBtn.addEventListener('click', function() {
            if (!selectedCandidate) {
                alert('Please select a candidate before submitting your vote.');
                return;
            }
            
            // Store the vote
            storeVote(selectedCandidate);
            
            // Show success message
            votingForm.style.display = 'none';
            successMessage.style.display = 'block';
        });
        
        // Admin login form submission
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            
            if (username === adminCredentials.username && password === adminCredentials.password) {
                isAdmin = true;
                adminLogin.style.display = 'none';
                resultsSection.style.display = 'block';
                displayResults(resultsContainer);
            } else {
                alert('Invalid admin credentials');
            }
        });
        
        // Release results to public
        releaseResultsBtn.addEventListener('click', function() {
            resultsSection.style.display = 'none';
            publicResults.style.display = 'block';
            displayResults(publicResultsContainer, true);
            alert('Results have been released to the public');
        });
        
        // Hide results from public
        hideResultsBtn.addEventListener('click', function() {
            publicResults.style.display = 'none';
            resultsSection.style.display = 'block';
        });
    }
    
    // Start the application
    init();
});