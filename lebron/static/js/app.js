// This function is responsible for fetching and displaying posts
// It checks if we're on a profile page and fetches only posts for that user
function reloadPosts() {
    // Get the hidden profile ID from the page
    const profileSpan = document.getElementById('profile_id');

    // Clear out any existing posts in the HTML container
    const postsElm = document.getElementById('posts');
    postsElm.replaceChildren();

    // Build the URL for the fetch request
    // If we're on a profile page, append ?profile_id=... to only get posts by that user
    let url = '/api/post';
    if (profileSpan) {
        const profileId = profileSpan.textContent.trim();
        url += `?profile_id=${profileId}`;
    }

    // Fetch posts from the API
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(posts => {
        // For each post returned from the server, create and display a card
        posts.forEach((post) => {
            // Create a Bootstrap card
            const postCard = document.createElement('div');
            postCard.className = 'card p-3 mb-3';

            // Create a paragraph for the post content
            const postContent = document.createElement('p');
            postContent.textContent = post.content;

            // Add author info in small gray text (optional, since it's the profile owner)
            const author = document.createElement('small');
            author.className = 'text-muted';
            author.textContent = `by ${post.profile.username}`;

            // Add both elements to the card
            postCard.appendChild(postContent);
            postCard.appendChild(author);

            // Append the card to the main posts container
            postsElm.appendChild(postCard);
        });
    })
    .catch(error => console.error('Error loading posts:', error));
}

// This function runs automatically when the page loads
// It simply calls reloadPosts() to load the user's posts
function load() {
    reloadPosts();
}

// Set the page to run `load()` once everything is ready
window.onload = load;

