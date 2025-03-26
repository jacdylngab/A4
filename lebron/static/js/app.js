// This function creates a clickable link to a profile
function profileLink(profile) {
    let a = document.createElement('a');
    a.href = `/profile/${profile.id}/`; // Goes to the profile page
    a.textContent = profile.username;   // Shows the username
    a.className = 'text-decoration-none'; // Optional: removes underline
    return a;
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
            postContent.textContent = post.content;

            // Create a clickable link to the profile
            const authorLink = profileLink(post.profile); // Uses your function

            // Wrap the link in a small text with "by"
            const author = document.createElement('small');
            author.className = 'text-muted';
            author.innerHTML = 'by ';
            author.appendChild(authorLink);

            // Add both the post content and author to the card
            postCard.appendChild(postContent);
            postCard.appendChild(author);

            // Add the card to the posts container
            postsElm.appendChild(postCard);
        });
    })
    .catch(error => console.error('Error loading posts:', error));
}

// This function runs when the page loads
function load() {
    reloadPosts(); // Load all posts or filtered posts (on profile page)
}

window.onload = load; // Automatically run `load()` on page open

