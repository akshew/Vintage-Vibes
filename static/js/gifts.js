document.addEventListener('DOMContentLoaded', function() {
    const giftForm = document.getElementById('gift-form');
    const suggestionResult = document.getElementById('suggestion-result');
    const suggestionText = document.getElementById('suggestion-text');

    giftForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(giftForm);
        suggestionResult.style.display = 'none';
        
        fetch('/gifts/suggest', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                suggestionText.textContent = data.suggestion;
                suggestionResult.style.display = 'block';
            } else {
                throw new Error(data.error || 'Failed to get suggestion');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to get gift suggestion. Please try again.');
        });
    });
});
