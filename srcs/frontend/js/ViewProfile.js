async function fetchAndDisplayViewProfile(username) {
    try {
        let jwtToken = localStorage.getItem('jwtToken');
        let csrfToken = await getCSRFCookie();

        const response = await fetch(`/api/profiles/?username=${username}`, {
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
              'X-CSRFToken': csrfToken
            }
        });
        if (response.ok) {
            
            const profileData = await response.json();
            if ('error' in profileData) {
                profileData = null; 
                window.location.href = "/";
            }
            
            const user = profileData.user || {}; 
            const imageLink = user.image_link || '../src/emptyavatar.jpeg';
            const nickname = user.nickname || 'Not available';
            const login = user.login || 'Not available';
            const score = user.score || '0';
            const isOnline = user.is_online || false;
            const gamesPlayed = profileData.games_played || '0';
            const winningRate = profileData.winning_rate || '0';

            document.querySelector('.profile-pic').src = imageLink;
            document.getElementById('nicknameadr2').textContent = nickname;
            document.getElementById('scoreadr').textContent = score;
            document.getElementById('gamesPlayed').textContent = gamesPlayed;
           document.getElementById('winningRate').textContent = winningRate;
            
            const statusIndicator = document.getElementById('statusIndicator');
            statusIndicator.classList.toggle('online', isOnline);
            statusIndicator.classList.toggle('offline', !isOnline);
            statusIndicator.title = isOnline ? 'Online' : 'Offline';
            
            
            document.getElementById('addFriend').addEventListener('click', async function() {
                try {
                    let jwtToken = localStorage.getItem('jwtToken');
                    let csrfToken = await getCSRFCookie();

                    const username = document.getElementById('nicknameadr2').textContent;
                    
                    const response = await fetch(`/api/add-friend?username=${username}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'X-CSRFToken': csrfToken
                        }
                    });
                    
                    const responseData = await response.json();
                    if (response.ok) {
                        alert(responseData.message);
                    } else {
                        throw new Error('Failed to add friend '+responseData.message);
                    }
                } catch (error) {
                    console.error('Error adding friend:', error);
                    alert('Opps '+error.message);
                }
            });
            
            document.getElementById('blockUser').addEventListener('click', async function() {
                try {
                    let jwtToken = localStorage.getItem('jwtToken');
                    let csrfToken = await getCSRFCookie();

            
                    const username = document.getElementById('nicknameadr2').textContent;
                    
                    const response = await fetch(`/api/block-user?username=${username}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'X-CSRFToken': csrfToken
                        }
                    });
                    
                    const responseData = await response.json();
                    if (response.ok) {
                        alert(responseData.message);
                    } else {
                        throw new Error('Failed to block user '+responseData.message);
                    }
                } catch (error) {
                    console.error('Error blocking user:', error);
                    alert('Opps '+error.message);
                }
            });
            document.getElementById('removeFriend').addEventListener('click', async function() {
                try {
                    let jwtToken = localStorage.getItem('jwtToken');
                    let csrfToken = await getCSRFCookie();

                    
                    const username = document.getElementById('nicknameadr2').textContent;
                    
                    const response = await fetch(`/api/remove-friend?username=${username}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'X-CSRFToken': csrfToken
                        }
                    });
                    
                    const responseData = await response.json();
                    if (response.ok) {
                        alert(responseData.message);
                    } else {
                        throw new Error('Failed to remove friend ' + responseData.message);
                    }
                } catch (error) {
                    console.error('Error removing friend:', error);
                    alert('Opps '+error.message);
                }
            });
            
            document.getElementById('unblockUser').addEventListener('click', async function() {
                try {
                    let jwtToken = localStorage.getItem('jwtToken');
                    let csrfToken = await getCSRFCookie();

                    
                    const username = document.getElementById('nicknameadr2').textContent;
                    
                    const response = await fetch(`/api/unblock-user?username=${username}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'X-CSRFToken': csrfToken
                        }
                    });
                    
                    const responseData = await response.json();
                    if (response.ok) {
                        alert(responseData.message);
                    } else {
                        throw new Error('Failed to unblock user '+responseData.message);
                    }
                } catch (error) {
                    console.error('Error unblocking user:', error);
                    alert('Opps '+error.message);
                }
            });
            
        } else {
            throw new Error('Profile not found');
        }

    } catch (error) {
        console.error('Error fetching and displaying profile:', error);
        const messageContainer = document.getElementById('messageContainer');
        if (messageContainer)
            {
                messageContainer.textContent = error.message;
        messageContainer.style.color = 'red';
            }
        //window.location.href = "/";
    }
}
