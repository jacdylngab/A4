// This function creates a clickable link to a profile
function profileLink(profile) {
    let a = document.createElement('a');
    a.href = `/profile/${profile.id}/`; // Goes to the profile page
    a.textContent = profile.username;   // Shows the username
    a.className = 'text-decoration-none'; // Optional: removes underline
    return a;
}

// This function creates the like button. The like button should also contain the count of likes
function createLikeButton(post_id){
    let url = `/api/like/${post_id}/`; 
    let btn = document.createElement('button');
    let btnText = document.createTextNode('Like');
    btn.appendChild(btnText);
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
        })
        .catch(error => console.error('Error:', error));
    });
    return btn;
}

// This function creates the unlike button.
function createUnlikeButton(post_id){
    let url = `/api/unlike/${post_id}/`;  
    let btn = document.createElement('button');
    let btnText = document.createTextNode('Unlike');
    btn.appendChild(btnText);
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
        })
        .catch(error => console.error('Error:', error));
    });
    return btn;
} 

// This function fetches posts and displays them on the page
function reloadPosts() {
    // Get the hidden profile ID if we’re on a profile page
    const profileSpan = document.getElementById('profile_id');

    // Get the element where posts will be added
    const postsElm = document.getElementById('posts');
    postsElm.replaceChildren(); // Clear out old posts

    // Build the URL — add ?profile_id=... if we're on a profile page
    let url = '/api/post';
    if (profileSpan) {
        const profileId = profileSpan.textContent.trim();
        url += `?profile_id=${profileId}`;
    }

    // Fetch the posts from the backend
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(posts => {
        // Loop through each post and create elements to display it
        posts.forEach((post) => {
            // Create a Bootstrap card container for each post
            const postCard = document.createElement('div');
            postCard.className = 'card p-3 mb-3';

            // Create a paragraph for the post content
            const postContent = document.createElement('p');
            postContent.textContent = post.content + ' by ';

            // Create a clickable link to the profile
            const authorLink = profileLink(post.profile); // Uses your function
            postContent.appendChild(authorLink);


            // add the like and unlike button to the each post
            const btnContainer = document.createElement('div')
            btnContainer.className = 'd-flex gap-2';

            btnContainer.appendChild(createLikeButton(post.id));
            btnContainer.appendChild(createUnlikeButton(post.id));

            // Add both the post content, like, and unlike to the card
            postCard.appendChild(postContent);
            postCard.appendChild(btnContainer);

            // Add the card to the posts container
            postsElm.appendChild(postCard);
        });
    })
    .catch(error => console.error('Error loading posts:', error));
}

// This function runs when the page loads
function load() {
    document
        .getElementById('post-btn')
        .addEventListener('click', (evt) => {
            evt.preventDefault();

            let content = document.getElementById('content').value;        

            fetch('/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: content })
            })
            .then(response => response.json())
            .then(data => reloadPosts())
            .catch(error => showError(error));
        });

    // Get the current posts.
    reloadPosts();
}


window.onload = load; // Automatically run `load()` on page open

