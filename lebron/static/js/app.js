// This function creates a clickable link to a profile
function profileLink(profile) {
    let a = document.createElement('a');
    a.href = `/profile/${profile.id}/`; // Goes to the profile page
    a.textContent = profile.username;   // Shows the username
    a.className = 'text-decoration-none'; // Optional: removes underline
    return a;
}

// Function to update the likes count on a post
function updateLikeCount(post_id) {
    let url = `/api/like-data/${post_id}/`;

    fetch (url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Update the like count element
        let likeCountElement = document.querySelector(`#like-count-${post_id}`);
        if (likeCountElement){
            likeCountElement.textContent = data.length;
        }
    })
    .catch(error => console.error('Error:', error));
}

// This function creates the like and the unlike button. The like button should also contain the count of likes
function likeUnlikeButton(post_id, isLiked) {
    let btn = document.createElement('button');
    btn.className = 'btn btn-sm';

    // Set initial button state
    btn.textContent = isLiked ? 'Unlike' : 'Like'; // I learned this one-liner way of doing if-else from chatGPT. I thought it was pretty cool
    btn.classList.add(isLiked ? 'btn-danger': 'btn-primary');

    btn.addEventListener('click', () => {
        let url = isLiked ? `/api/unlike/${post_id}/` : `/api/like/${post_id}/`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(isLiked ? 'Unliked post:' : 'Liked post:', data);
            isLiked = data.isLiked; // Update the like status
            btn.textContent = isLiked ? 'Unlike' : 'Like';
            btn.classList.toggle('btn-primary', !isLiked);
            btn.classList.toggle('btn-danger', isLiked);

            updateLikeCount(post_id);
            
        })
        .catch(error => console.error('Error:', error));
    });
    return btn;
}

// Function to make the likes count
function likesCount(post_id, post_likes){
    let a = document.createElement('a');
    a.id = `like-count-${post_id}`; // ID to change the count dynamically
    a.textContent = post_likes.length;
    
    a.addEventListener('click', () => {
        let url = `/api/like-data/${post_id}/`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('likes information:', data);

            let modalBody = document.querySelector('#exampleModal .modal-body');
            modalBody.innerHTML = ''; // Clear previous content

            if (data.length > 0){
                data.forEach(username => {
                    let userElement = document.createElement('p');
                    userElement.textContent = username;
                    modalBody.appendChild(userElement);
                });
            } else {
                modalBody.textContent = 'No likes yet.';
            }

            // show the modal
            let modal = new bootstrap.Modal(document.getElementById('exampleModal'));
            modal.show();
        }) 
        .catch(error => console.error('Error:', error));
    });
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
            postContent.textContent = post.content + ' by ';

            // Create a clickable link to the profile
            const authorLink = profileLink(post.profile);
            postContent.appendChild(authorLink);


            // add the like and unlike button to the each post
            const btnContainer = document.createElement('div')
            btnContainer.className = 'd-flex gap-2';

            btnContainer.appendChild(likeUnlikeButton(post.id, post.isLiked));
            btnContainer.appendChild(likesCount(post.id, post.likes));

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
    const postBtn = document.getElementById('post-btn');
 
     if (postBtn) {
         postBtn.addEventListener('click', (evt) => {
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
     }

    // Load posts right away
    reloadPosts();
}

 function showError(error) {
     console.log(error);
 }


window.onload = load; // Automatically run `load()` on page open

