// This function creates a clickable link to a user's profile
function profileLink(profile) {
    let a = document.createElement('a');
    a.href = `/profile/${profile.id}/`; // Link to the profile page
    a.textContent = profile.username;   // Show their username
    a.className = 'text-decoration-none'; 
    return a;
}

// This function creates a "Like" button for a post
function createLikeButton(post_id) {
    let url = `/api/like/${post_id}/`; 
    let btn = document.createElement('button');
    btn.textContent = 'Like';
    btn.className = 'btn btn-primary btn-sm';

    btn.addEventListener('click', (evt) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Liked post:', data);
            reloadPosts(); // Refresh posts after like
        })
        .catch(error => console.error('Error:', error));
    });

    return btn;
}

// This function creates an "Unlike" button for a post
function createUnlikeButton(post_id) {
    let url = `/api/unlike/${post_id}/`;  
    let btn = document.createElement('button');
    btn.textContent = 'Unlike';
    btn.className = 'btn btn-secondary btn-sm';

    btn.addEventListener('click', (evt) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Unliked post:', data);
            reloadPosts(); 
        })
        .catch(error => console.error('Error:', error));
    });

    return btn;
}

// This function fetches posts from the backend and displays them on the page
function reloadPosts() {
    const profileSpan = document.getElementById('profile_id'); // Null if not on profile page
    const postsElm = document.getElementById('posts');
    postsElm.replaceChildren(); // Clear the old posts

    // Build API URL
    let url = '/api/post';
    if (profileSpan) {
        const profileId = profileSpan.textContent.trim();
        url += `?profile_id=${profileId}`;
    }

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(posts => {
        posts.forEach((post) => {
            // Create a Bootstrap card for each post
            const postCard = document.createElement('div');
            postCard.className = 'card p-3 mb-3';

            // Add post content + clickable author link
            const postContent = document.createElement('p');
            postContent.textContent = post.content + ' by ';
            postContent.appendChild(profileLink(post.profile));

            // Like/Unlike buttons container
            const btnContainer = document.createElement('div');
            btnContainer.className = 'd-flex gap-2';

            btnContainer.appendChild(createLikeButton(post.id));
            btnContainer.appendChild(createUnlikeButton(post.id));

            // Append everything to the card
            postCard.appendChild(postContent);
            postCard.appendChild(btnContainer);

            // Add the card to the page
            postsElm.appendChild(postCard);
        });
    })
    .catch(error => console.error('Error loading posts:', error));
}

// This function handles posting new content (only on main feed)
function load() {
    const postBtn = document.getElementById('post-btn');

    if (postBtn) {
        postBtn.addEventListener('click', (evt) => {
            evt.preventDefault(); // Stop form from submitting normally

            let content = document.getElementById('content').value;

            fetch('/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: content })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Post created:', data);
                document.getElementById('content').value = ''; // Clear input
                reloadPosts(); // Refresh posts
            })
            .catch(error => showError(error));
        });
    }

    reloadPosts(); // Always load posts
}

// This function handles errors (like network or fetch errors)
function showError(error) {
    console.error('Error:', error);
    alert('Something went wrong. Check console for details.');
}

// When the page loads, call the load function
window.onload = load;

