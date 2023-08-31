async function newComment(event) {
    event.preventDefault();

    const blog_id = document.getElementById('blog-id').innerHTML;
    const comment = document.querySelector('#comment').value.trim();

    if(comment) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                blog_id,
                comment
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.replace(`/blogs/${blog_id}`);
        } else {
            alert('Error');
        }
    }
};

document.querySelector('.new-comment').addEventListener('submit', newComment);