let fetchMessagesInterval;

function openChat() {
    let PERSON_NAME = localStorage.getItem('userLogin') || "user42"; // Retrieve sender info from localStorage or default to "user42"
    const onlineUsers = ["eelasam", "ddyankov", "vstockma", "huaydin"];
    if (!backendURL)
        backendURL = 'http://localhost:8000'; // Change this to your backend URL
    const apiUrl = `${backendURL}/api/messages`;

    const onlineUsersElement = document.getElementById('online-users');
    const msgerChat = document.getElementById('msger-chat');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');

    function formatDate(date) {
        const h = "0" + date.getHours();
        const m = "0" + date.getMinutes();
        return `${h.slice(-2)}:${m.slice(-2)}`;
    }

    function scrollToBottom() {
        msgerChat.scrollTop = msgerChat.scrollHeight;
    }

    function addMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('msg');
        const senderName = message.name || 'Anonymous'; // Set sender name to 'Anonymous' if undefined
        const createdAt = message.created_at ? new Date(message.created_at).toLocaleTimeString('de-AT', { timeZone: 'Europe/Vienna', hour12: false, hour: '2-digit', minute: '2-digit' }) : ''; // Format creation time in Vienna timezone and 24-hour format
        messageElement.textContent = `${createdAt} ${senderName}: ${message.text}`;
        msgerChat.appendChild(messageElement);
        scrollToBottom();
    }
    

    function sendMessage(message) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
            .then(response => response.json())
            .then(data => {
                addMessage(data);
                messageInput.value = '';
            })
            .catch(error => console.error('Error sending message:', error));
    }

    sendBtn.addEventListener('click', function () {
        sendMessageFromInput();
    });

    messageInput.addEventListener('keypress', function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessageFromInput();
        }
    });

    function sendMessageFromInput() {
        const inputText = messageInput.value.trim();
        if (!inputText) return;

        const newMessage = {
            name: PERSON_NAME,
            text: inputText,
        };

        sendMessage(newMessage);
    }


    function formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}-${month} ${hours}:${minutes}`;
    }
    
    function fetchMessages() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(messages => {
                msgerChat.innerHTML = ''; // Clear chat window before adding messages
                messages.forEach(message => {
                    // Parse the created_at field manually
                    const createdAt = message.created_at ? new Date(message.created_at) : null;
                    const formattedCreatedAt = createdAt ? formatDate(createdAt) : '';
    
                    // Format the created_at field of each message
                    const formattedMessage = {
                        ...message,
                        created_at: formattedCreatedAt
                    };
                    addMessage(formattedMessage);
                });
            })
            .catch(error => console.error('Error fetching messages:', error));
    }
    
    
    

    // Fetch messages initially and every X seconds
    fetchMessages();
    fetchMessagesInterval = setInterval(fetchMessages, 3000);

    window.addEventListener('unload', () => {
        clearInterval(fetchMessagesInterval); // Clear the interval when the page is unloaded
    });

    onlineUsers.forEach(user => {
        const userElement = document.createElement('li');
        const button = document.createElement('button');
        button.classList.add('button', 'bn');
        button.title = 'View Profile';
        const spanIcon = document.createElement('span');
        spanIcon.classList.add('bi', 'bi-person');
        button.appendChild(spanIcon);
        userElement.appendChild(button);
        const userNameNode = document.createTextNode(user);
        userElement.appendChild(userNameNode);
        onlineUsersElement.appendChild(userElement);
    });
}
