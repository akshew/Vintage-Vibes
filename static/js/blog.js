document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('post-form');

    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(postForm);

        fetch('/blog/post', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error('Failed to create post');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to create post. Please try again.');
        });
    });

    // Format timestamps
    document.querySelectorAll('.timestamp').forEach(timestamp => {
        const date = new Date(timestamp.textContent);
        timestamp.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    });

    // Initialize Feather icons
    feather.replace();
});

// Show/hide replies and reply form
function showReplyForm(postId) {
    const repliesSection = document.getElementById(`reply-${postId}`);
    if (repliesSection.style.display === 'none') {
        repliesSection.style.display = 'block';
    } else {
        repliesSection.style.display = 'none';
    }
}

// Submit reply
function submitReply(event, postId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    formData.append('post_id', postId);

    fetch('/blog/reply', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
        } else {
            throw new Error('Failed to submit reply');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit reply. Please try again.');
    });
}