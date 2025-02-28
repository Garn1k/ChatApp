const socket = io();

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("userUpdate", (data) => {
    console.log("User data updated:", data);
});

const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageTone = new Audio('/message-tone.mp3');

const profileIcon = document.getElementById('profile-icon');
const profileImg = document.getElementById('profile-img');
const upload = document.querySelector('.upload');
const saveBtn = document.querySelector('.save-button');
const recordButton = document.getElementById('record-button');

let isRecording = false;
let mediaRecorder;
let audioChunks = [];

// Use unique storage per tab
const tabId = Date.now().toString();
sessionStorage.setItem('tabId', tabId);

// Load saved nickname and profile image from local storage
window.addEventListener('load', () => {
    const savedName = sessionStorage.getItem('userName');
    const savedImage = sessionStorage.getItem('userImage');

    if (savedName) {
        nameInput.value = savedName;
    }

    if (savedImage) {
        profileImg.src = savedImage;
        profileImg.style.display = 'block';
        profileIcon.querySelector('i').style.display = 'none'; // Hide the icon
    }
});

// Show file picker on icon click
profileIcon.addEventListener('click', () => {
    upload.click();
});

// Handle file selection
upload.addEventListener('change', () => {
    const file = upload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profileImg.src = e.target.result;
            profileImg.style.display = 'block';
            profileIcon.querySelector('i').style.display = 'none'; // Hide the icon

            // Save image to session storage
            sessionStorage.setItem('userImage', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Handle save button click
saveBtn.addEventListener('click', () => {
    const nickName = nameInput.value.trim();
    const file = upload.files[0];

    if (nickName) {
        // Save nickname to session storage
        sessionStorage.setItem('userName', nickName);
    }

    if (file) {
        const formData = new FormData();
        formData.append('user_img', file);
        formData.append('nickName', nickName);
        
        fetch('/saveUser', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else if (nickName) {
        // Only save nickname if no image is selected
        sessionStorage.setItem('userName', nickName);
    } else {
        alert('Please enter a nickname.');
    }
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total clients: ${data}`;
});

function sendMessage() {
    if (messageInput.value === '') return;

    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
    };

    socket.emit('message', data);
    messageInput.value = '';
}

socket.on('all-messages', (messages) => {
    messages.forEach(message => {
            addMessageToUI(false, message);
    });
});


socket.on('chat-message', (data) => {
    messageTone.play();
    addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    
    let messageElement = '';
    if (data.audio) {
        // Handle audio message
        messageElement = `
            <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
                <audio controls>
                    <source src="data:audio/wav;base64,${data.audio}" type="audio/wav">
                </audio>
                <p>${data.name} ● ${moment(data.dateTime).fromNow()}</p>
            </li>
        `;
    } else if (data.message) {
        // Handle text message
        messageElement = `
            <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
                <p class="message">
                  ${data.message}
                  <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
                </p>
            </li>
        `;
    }

    messageContainer.innerHTML += messageElement;
    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', () => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} is typing a message,`
    });
});

messageInput.addEventListener('keypress', () => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} is typing a message,`
    });
});

messageInput.addEventListener('blur', () => {
    socket.emit('feedback', {
        feedback: '',
    });
});

socket.on('feedback', (data) => {
    clearFeedback();
    const element = `
        <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
    `;
    messageContainer.innerHTML += element;
});

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
        element.parentNode.removeChild(element);
    });
}

recordButton.addEventListener('click', toggleRecording);

function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    console.log('Starting recording...');
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            isRecording = true;
            recordButton.innerHTML = '<i class="fas fa-stop"></i>'; // Change icon to stop

            mediaRecorder.addEventListener('dataavailable', event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioChunks = [];
                sendAudioMessage(audioBlob);
            });
        })
        .catch(error => {
            console.error('Error accessing microphone', error);
        });
}

function stopRecording() {
    mediaRecorder.stop();
    isRecording = false;
    recordButton.innerHTML = '<i class="fas fa-microphone"></i>'; // Change icon back to mic
}

function sendAudioMessage(audioBlob) {
    const reader = new FileReader();
    reader.onloadend = function() {
        const base64Audio = reader.result.split(',')[1];
        const data = {
            audio: base64Audio,
            name: nameInput.value,
            message: null, // Ensure message is null for audio messages
            dateTime: new Date(),
        };
        socket.emit('message', data);
    };
    reader.readAsDataURL(audioBlob);
}

// Generate or get a unique user ID
let userId = sessionStorage.getItem('userId');
if (!userId) {
    userId = Date.now().toString(); // or any unique ID generation method
    sessionStorage.setItem('userId', userId);
}

