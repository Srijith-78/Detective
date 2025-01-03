const cases = [
    "Serial Killer",
    "The missing girl",
    "London Murders",
    "Lakshmi, mysterious land",
    "The Odisha Tragedy"
];

let caseno = 5;

let audio;
let audioPlaying = false;
let isLoading = false;

let currentAssistantMessage = '';

const backendBaseUrl = 'http://localhost:7000';
let currentChatTarget = null;

let container = document.getElementById('container'); // Add this line

function initAudio() {
    audio = new Audio('BGM.mp3');
    audio.loop = true;

    // Check if the audio is already playing
    audioPlaying = sessionStorage.getItem('audioPlaying') === 'true';

    if (audioPlaying) {
        audio.play();
    }

    // Add an event listener to store audio state in sessionStorage
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            sessionStorage.setItem('audioPlaying', audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > 2);
            audio.pause();
        } else {
            if (audioPlaying) {
                audio.play();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    audio = new Audio('BGM.mp3');
    audio.loop = true;
    audioPlaying = true; // Set the initial state to playing
    audio.play(); // Start playing the audio immediately
});

function showCases() {
    document.getElementById('initial-state').style.display = 'none';
    document.getElementById('case-selection').style.display = 'flex';
    renderCaseButtons();
}

function startInvestigation() {
    // Pause the audio to prevent it from playing over
    audio.pause();
    audioPlaying = false;
    const investigationPage = `investigation-page-${caseno}`;
    const caseBackgrounds = {
        1: 'Case1Cover.png',
        2: 'Case2Cover.png',
        3: 'Case3Cover.png',
        4: 'Case4Cover.png',
        5: 'Case5Cover.png'
        // Add more cases as needed
    }

    document.getElementById('loading-state').style.display = 'flex';
    setTimeout(() => {
        // Change the location to the investigation page
        document.getElementById('initial-state').style.display = 'none';
        document.getElementById(investigationPage).style.display = 'block';
        document.getElementById('loading-state').style.display = 'none';
        if (caseBackgrounds[caseno]) {
            container.style.backgroundImage = `url('${caseBackgrounds[caseno]}')`;
            container.style.display = 'block'; // To show the container
        } else {
            console.error('Invalid case number or background image not found.');
        }
    }, 2000); // Add a delay of 2 seconds
}

function goBackFromInvestigation() {
    // Pause the audio to prevent it from playing over
    audio.pause();
    audioPlaying = false;

    document.getElementById('loading-state').style.display = 'flex';
    setTimeout(() => {
        window.location.href = 'index.html'; // Go back to the main page
    }, 2000); // Add a delay of 2 seconds
}

function renderCaseButtons() {
    const caseOptions = document.getElementById('case-options');

    // Check if caseOptions is found in the DOM
    if (caseOptions) {
        caseOptions.innerHTML = "";

        for (let i = 0; i < cases.length; i++) {
            const button = document.createElement('button');
            button.className = 'case-button';
            button.innerText = `Case ${i + 1} - ${cases[i]}`;
            button.onclick = function () {
                selectCase(i + 1);
            };
            caseOptions.appendChild(button);
        }
    } else {
        console.error('Element with id "case-options" not found in the DOM.');
    }
}

function selectCase(caseNumber) {
    document.getElementById('case-selection').style.display = 'none';
    document.getElementById('loading-state').style.display = 'flex';
    caseno = caseNumber;

    setTimeout(function () {
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('details-page').style.display = 'flex';
        displayCaseDetails(caseNumber);
    }, 2000);
}

function displayCaseDetails(caseNumber) {
    const titleElement = document.getElementById('case-title');
    const imageElement = document.getElementById('case-image');
    const textAreaElement = document.getElementById('case-text');

    titleElement.innerText = `Case ${caseNumber} - ${cases[caseNumber - 1]}`;
    imageElement.src = `Case${caseNumber}.png`;

    const filename = `Case${caseNumber}.txt`;

    fetch(filename)
        .then(response => response.text())
        .then(text => {
            textAreaElement.value = text;
        })
        .catch(error => {
            console.error('Error loading file:', error);
            textAreaElement.value = 'Error loading file.';
        });
}


function goBack() {
    document.getElementById('case-selection').style.display = 'none';
    document.getElementById('initial-state').style.display = 'flex';
}

function goBackOk() {
    // Check if already loading
    if (isLoading) {
        return;
    }

    // Show loading state
    showLoadingState();

    // Set loading flag to true
    isLoading = true;

    // Delay for 2 seconds and then navigate back
    setTimeout(() => {
        isLoading = false; // Reset loading flag
        goBackFromInvestigation(); // Replace with the appropriate function if needed
    }, 2000);
}

function showLoadingState() {
    const loadingState = document.getElementById('loading-state');

    if (loadingState) {
        loadingState.style.display = 'flex';
    }
}

function goBackFromDetails() {
    document.getElementById('details-page').style.display = 'none';
    document.getElementById('case-selection').style.display = 'flex';
}

function showSettings() {
    document.getElementById('settings-page').style.display = 'flex';
}

function goBackFromSettings() {
    document.getElementById('settings-page').style.display = 'none';
    document.getElementById('initial-state').style.display = 'flex';
}

function showAbout() {
    document.getElementById('about-page').style.display = 'flex';
}

function goBackFromAbout() {
    document.getElementById('about-page').style.display = 'none';
    document.getElementById('game-page').style.display = 'flex';
}

function toggleMusic() {
    const musicSwitch = document.getElementById('music-switch');

    if (audio) {
        if (musicSwitch.checked) {
            if (!audioPlaying) {
                audio.play();
                audioPlaying = true;
            }
        } else {
            audio.pause();
            audioPlaying = false;
        }
    }
}

function adjustVolume() {
    const volumeRange = document.getElementById('volume-range');
    if (audio) {
        audio.volume = volumeRange.value / 100;
    }
}

// Inside scripts.js

function goBackFromChat() {
    // Hide the chatbot container
    document.getElementById('chatbot-container').style.display = 'none';

    // Show the investigation page container
    document.getElementById('investigation-page-1').style.display = 'flex';
}


function goBackFromTry() {
    // Hide the chatbot container
    document.getElementById('Try-page').style.display = 'none';

    // Show the investigation page container
    document.getElementById('investigation-page-1').style.display = 'flex';
}


function outputUserMessage(message) {
    displayMessage('user', message);
}

// Helper function to scroll to the bottom of the chat
function scrollToBottom(chatContainerId) {
    const chatContent = document.getElementById(chatContainerId);
    if (chatContent) {
        chatContent.scrollTop = chatContent.scrollHeight;
    } else {
        console.error(`Element with ID ${chatContainerId} not found.`);
    }
}

// Function to display user messages
function displayUserMessage(message) {
    const chatContent = document.getElementById('assistant-chat');
    if (chatContent) {
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user-message';
        userMessage.innerText = `You: ${message}`;
        chatContent.appendChild(userMessage);
        scrollToBottom('assistant-chat');
    }
}

// Function to display chatbot messages
function displayChatbotMessage(message) {
    const chatContent = document.getElementById('assistant-chat');
    if (chatContent) {
        const chatbotMessage = document.createElement('div');
        chatbotMessage.className = 'chat-message chatbot-message';
        const chatbotName = currentChatTarget || 'Chatbot';
        chatbotMessage.innerHTML = `<span class="chatbot-name">Kajal:</span> ${message}`;
        chatContent.appendChild(chatbotMessage);
        scrollToBottom('assistant-chat');
    }
}

// Output user message to the chat
function outputUserMessage(message) {
    const chatContent = document.getElementById('chat-content');
    if (chatContent) {
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user-message';
        userMessage.innerText = `You: ${message}`;
        chatContent.appendChild(userMessage);
        scrollToBottom('chat-content');
    }
}

// Output chatbot message to the chat with animation
function outputChatBotMessage(message, time) {
    const chatContent = document.getElementById('chat-content');
    if (chatContent) {
        const chatbotMessage = document.createElement('div');
        chatbotMessage.className = 'chat-message chatbot-message';
        const chatbotName = currentChatTarget || 'Chatbot';
        chatbotMessage.innerHTML = `<span class="chatbot-name">${chatbotName}:</span>`;

        const words = message.split(' ');
        let i = 0;
        const intervalId = setInterval(function () {
            chatbotMessage.innerHTML += ` ${words[i++]}`;
            chatContent.scrollTop = chatContent.scrollHeight;
            if (i === words.length) {
                clearInterval(intervalId);
            }
        }, time);
        chatContent.appendChild(chatbotMessage);
        scrollToBottom('chat-content');
    }
}

// Submit question function
async function submitQuestion(target) {
    const userInput = document.getElementById('user-input').value;

    try {
        const response = await fetch(`${backendBaseUrl}/api/startBackend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput, currentChatTarget }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData);

        outputUserMessage(userInput);

        const botMessage = extractBotMessage(responseData.response);

        outputChatBotMessage(`${botMessage}`, 100);

        saveChat(currentChatTarget, [...loadChat(currentChatTarget), { type: 'user', message: userInput }]);
        saveChat(currentChatTarget, [...loadChat(currentChatTarget), { type: 'bot', message: botMessage }]);

        scrollToBottom('chat-content');

        document.getElementById('user-input').value = '';
    } catch (error) {
        console.error(error);
        alert('An error occurred while processing your request.');
    }
}

// Send message function
async function sendMessage(target) {
    const userInput = document.getElementById('usinput').value;

    try {
        const response = await fetch(`${backendBaseUrl}/api/startBackend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput, currentChatTarget }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData);

        displayUserMessage(userInput);

        const botMessage = extractBotMessage(responseData.response);

        displayChatbotMessage(botMessage);

        saveChat(currentChatTarget, [...loadChat(currentChatTarget), { type: 'user', message: userInput }]);
        saveChat(currentChatTarget, [...loadChat(currentChatTarget), { type: 'bot', message: botMessage }]);

        scrollToBottom('assistant-chat');

        document.getElementById('usinput').value = '';
    } catch (error) {
        console.error(error);
        alert('An error occurred while processing your request.');
    }
}

// Helper function to extract the relevant message from the response
function extractBotMessage(response) {
    if (typeof response === 'object') {
        return response.message || JSON.stringify(response);
    } else {
        return response;
    }
}

// Function to start a chat with a specific target
async function startChat(target) {
    currentChatTarget = target;

    const chatContainer = document.getElementById('chatbot-container');
    if (chatContainer) {
        chatContainer.style.display = 'flex';
    }

    clearChat();

    const heading = document.createElement('h1');
    heading.style.color = 'red';
    heading.innerText = `${target}'s Investigation Portal`;
    outputElementToChat(heading);

    const previousChat = loadChat(target);
    previousChat.forEach((item) => {
        if (item.type === 'user') {
            outputUserMessage(item.message);
        } else if (item.type === 'bot') {
            outputChatBotMessage(item.message, 0);
        }
    });

    document.getElementById('submit-btn').onclick = function () {
        submitQuestion(target);
    };
}

// Helper function to output an element to the chat
function outputElementToChat(element) {
    const chatContent = document.getElementById('chat-content');
    if (chatContent) {
        chatContent.appendChild(element);
    } else {
        console.error("Chat content element not found.");
    }
}

// Clear chat content
function clearChat() {
    const chatContent = document.getElementById('chat-content');
    if (chatContent) {
        chatContent.innerHTML = '';
    } else {
        console.error("Chat content element not found.");
    }
}


function displayMessage(type, message) {
    const chatContent = document.getElementById('chat-content');

    // Add user's or chatbot's message to the chat
    chatContent.innerHTML += `<div class='chat-message ${type}-message'>${type === 'user' ? 'You' : 'Chatbot'}: ${message}</div>`;

    // Scroll to the bottom of the chat container to show the latest messages
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Function to toggle the assistant popup
function toggleAssistant() {
    const assistantPopup = document.getElementById('assistant-popup');
    assistantPopup.classList.toggle('opened');
}

// Close the assistant popup when clicking outside
document.addEventListener('click', function(event) {
    const assistantPopup = document.getElementById('assistant-popup');
    const icon = document.getElementById('assistant-icon');

    if (!assistantPopup.contains(event.target) && event.target !== icon) {
        assistantPopup.classList.remove('opened');
    }
});



function loadChat(target) {
    try {
        const localStorageKey = 'Chats';
        const chats = localStorage.getItem(localStorageKey) ? JSON.parse(localStorage.getItem(localStorageKey)) : {};

        return chats[target] || [];
    } catch (error) {
        console.error('Error loading chat:', error);
        return [];
    }
}

function saveChat(target, chat) {
    try {
        const localStorageKey = 'Chats';
        const chats = localStorage.getItem(localStorageKey) ? JSON.parse(localStorage.getItem(localStorageKey)) : {};

        // Update or create a new chat for the target
        chats[target] = chat;

        // Save the updated chats to local storage
        localStorage.setItem(localStorageKey, JSON.stringify(chats));
    } catch (error) {
        console.error('Error saving chat:', error);
    }
}



// Function to open the Lab page
function openLab() {
    console.log("Open Lab button clicked");
    const labSection = document.getElementById('lab-section');
    if (labSection) {
        console.log("Lab section found");
        labSection.style.display = 'flex';
    } else {
        console.error("Lab section not found");
    }
}

// Function to open the Police Records page
function openPoliceRecords() {
    console.log("Open Police Records button clicked");
    const policeRecordsSection = document.getElementById('police-records-section');
    if (policeRecordsSection) {
        console.log("Police Records section found");
        policeRecordsSection.style.display = 'flex';
    } else {
        console.error("Police Records section not found");
    }
}


function goBackFromLab() {
    document.getElementById('lab-section').style.display = 'none';
    document.getElementById('investigation-page-1').style.display = 'flex';
}

function goBackFromPoliceRecords() {
    document.getElementById('police-records-section').style.display = 'none';
    document.getElementById('investigation-page-1').style.display = 'flex';
}


// Function to display user message
function displayUserMessage(message) {
    const chatContent = document.getElementById('assistant-chat');
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    userMessage.innerText = `You: ${message}`;
    chatContent.appendChild(userMessage);

    scrollToBottom('assistant-chat');
}

// Function to display chatbot message
function displayChatbotMessage(message) {
    const specialPrompt = "That's an important observation, Detective Arjun. An unidentified body has been reported near the beach. Her autopsy and police report should be available in the lab and police records sections. Also, Aravind may have additional insights about our investigation near Priya's house.";
    const nextPrompt = "We'll update you on that";
    const bhanuPrompt = "That's a good move, Arjun. Aravind and I are on our 'date' to the State Crime Records Bureau, RA Puram. Check out the record sections then and there.";
    const killerPrompt = "Got it. I’ll alert the city police to start the search for Martin."
    const chatContent = document.getElementById('assistant-chat');
    const chatbotMessage = document.createElement('div');
    chatbotMessage.className = 'chat-message chatbot-message';

    // Display "Kajal" instead of "Chatbot"
    chatbotMessage.innerHTML = `<span class="chatbot-name">Kajal:</span> ${message}`;

    chatContent.appendChild(chatbotMessage);

    // Scroll to the bottom to show the latest messages
    scrollToBottom('assistant-chat');

    // Check for the special prompt and reveal additional reports if matched
    if (message === specialPrompt) {
        console.log("Yes");
        revealAdditionalReports('lab-report-4', 'police-report-4');
    } else if (message === nextPrompt) {
        const reply = "Arjun! Arjun! Shyamala's body has been found in her party office. Come!";
        setTimeout(() => {
            // Create a new message element
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message chatbot-message';
            messageElement.innerHTML = `<span class="chatbot-name">Kajal:</span> ${reply}`;
            chatContent.appendChild(messageElement);

            revealAdditionalReports('lab-report-5', 'police-report-5');
        }, 5000); // Delay of 5 seconds
    } else if (message === bhanuPrompt){
        const reply = "The reports are uploaded, Arjun. Summary : Jessica and Bhanumathi were business enemies. Jesicca and her son Martin are dead now. Bhanumathi's daughter, Aisha, rumoured to be Martin's girlfriend, is also dead. The reports claim to be a freak fire accident. Bhanumathi also faced a trial regarding the same, but was released due to lack of evidence. Check out the documents for more details.";
        setTimeout(() => {
            // Create a new message element
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message chatbot-message';
            messageElement.innerHTML = `<span class="chatbot-name">Kajal:</span> ${reply}`;
            chatContent.appendChild(messageElement);
            revealAdditionalReports('Bhanu-police-history', 'blast-postmortem-files')            
        }, 5000); // Delay of 5 seconds
    }  else if (message === killerPrompt){
        const reply = "Arjun. We have caught Martin. He is indeed alive. Living in the shades, the underground. My darling Aravind involved himself in a tense chase as Martin tried to escape from the hotel Bhanumathi stays. We recovered a total of Three million USD from both of them."
        setTimeout(() => {
            // Create a new message element
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message chatbot-message';
            messageElement.innerHTML = `<span class="chatbot-name">Kajal:</span> ${reply}`;
            chatContent.appendChild(messageElement);           
            document.getElementById("Martin-button").style.display = "block";
            document.getElementById("backend-msg").style.display = "block";
            document.getElementById("report-submit").style.display = "block"; 
        }, 20000); // Delay of 20 seconds
    }
}

// Function to reveal additional reports
function revealAdditionalReports(lab, police) {
    const labReport = document.getElementById(lab);
    const policeRecord = document.getElementById(police);

    if (labReport) {
        labReport.style.display = 'block';
    }

    if (policeRecord) {
        policeRecord.style.display = 'block';
    }
}

// Utility to scroll to the bottom of the chat
function scrollToBottom(id) {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
}

let murder5lab = false;
let murder5police = false;
let murder6lab = false;
let murder6police = false;
function handleDownload(id) {
    if (id === "lab-report-5") {
        murder5lab = true;
    } else if (id === "police-report-5") {
        murder5police = true;
    } else if (id === "lab-repoort-6"){
        console.log("Idhaan lab")
        murder6lab = true;
    } else if (id == "police-report-6"){
        console.log("idhaan police")
        murder6police=true;
    }

    if (murder5lab || murder5police) {
        document.getElementById("lingesan-button").style.display = "block";
        console.log("Both reports downloaded, showing Lingesan button.");
        let reply="Arjun, we went to Shyamala's party office and found a bait in the name of Lingesan for you. Investigate him."
        setTimeout(() => {
            // Create a new message element
            const messageElement = document.createElement('div');
            const chatContent = document.getElementById('assistant-chat');
            messageElement.className = 'chat-message chatbot-message';
            messageElement.innerHTML = `<span class="chatbot-name">Kajal:</span> ${reply}`;
            chatContent.appendChild(messageElement);
            document.getElementById("commissioner-msg").style.display = "block";
            document.getElementById("document-submit").style.display = "block";
            murder5lab = false;
            lmurder5police = false;
        }, 10000); // Delay of 5 seconds
        
    }

    else if (murder6lab || murder6police){
        console.log("Chumma adhurudhu la!");

        let reply="Arjun, it is kinda boring, but we have found another lady's body in a multi national company's water tank. I've uploaded the police and autopsy reports. Check them."
        setTimeout(() => {
            // Create a new message element
            const messageElement = document.createElement('div');
            const chatContent = document.getElementById('assistant-chat');
            messageElement.className = 'chat-message chatbot-message';
            messageElement.innerHTML = `<span class="chatbot-name">Kajal:</span> ${reply}`;
            chatContent.appendChild(messageElement);
            revealAdditionalReports('lab-report-7', 'police-report-7');
            
        }, 10000); // Delay of 5 seconds

    }
}

function checkdoc(){
    const fileInput = document.getElementById("file-upload");
    if (fileInput.files.length > 0){
        let reply="Arjun! Anu has spotted a human organ in the dried vegetables on our terrace!!! Go Talk to her."
        setTimeout(() => {
            // Create a new message element
            const messageElement = document.createElement('div');
            const chatContent = document.getElementById('assistant-chat');
            messageElement.className = 'chat-message chatbot-message';
            messageElement.innerHTML = `<span class="chatbot-name">Kajal:</span> ${reply}`;
            chatContent.appendChild(messageElement);
            document.getElementById("commissioner-msg").style.display = "none";
            document.getElementById("anu-button").style.display = "block";
            revealAdditionalReports('lab-report-6', 'police-report-6');
        }, 10000); // Delay of 5 seconds       

    }
}

function endOfCase() {
    const fileInput = document.getElementById("report-upload");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        
        // Ensure the file is a .txt file
        if (file.type === "text/plain") {
            const reader = new FileReader();

            reader.onload = function(event) {
                const text = event.target.result;

                const keywords = ["Pattern of Hitchcock", "not a psychopath", "Distract the police", "Escape with the money", "movies"];
                
                // Check if any of the keywords are present in the text
                const hasKeywords = keywords.some(keyword => text.includes(keyword));
                
                if (hasKeywords) {
                    // Redirect to "Yes" page
                    document.getElementById('investigation-page-1').style.display = 'none';
                    document.getElementById('Congratulation-page').style.display = 'flex';
                } else {
                    // Redirect to "No" page
                    document.getElementById('investigation-page-1').style.display = 'none';
                    document.getElementById('Try-page').style.display = 'flex';
                }
            };
            
            reader.readAsText(file); // Read the file as text
        } else {
            console.error("Please upload a .txt file.");
        }
    } else {
        console.error("No file uploaded.");
    }
}



// Update the submit button click event to call the new sendMessage function
document.getElementById('submit-btn').onclick = function () {
    sendMessage(currentChatTarget);
};


document.addEventListener('DOMContentLoaded', () => {
    initAudio();
 
    // Render case buttons
    renderCaseButtons();
});






