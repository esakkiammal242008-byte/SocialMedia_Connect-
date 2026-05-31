let posts = JSON.parse(localStorage.getItem("posts")) || [];

const postsContainer = document.getElementById("posts");

function saveData() {
    localStorage.setItem("posts", JSON.stringify(posts));
}

function createPost() {

    const text =
    document.getElementById("postInput").value;

    const imageFile =
    document.getElementById("imageInput").files[0];

    if(text.trim()==="" && !imageFile){
        alert("Please enter a post or upload an image.");
        return;
    }

    const post = {
        id: Date.now(),
        content: text,
        image: "",
        likes: 0,
        shares: 0,
        saved: false,
        comments: [],
        time: new Date().toLocaleString()
    };

    if(imageFile){

        const reader = new FileReader();

        reader.onload = function(e){

            post.image = e.target.result;

            posts.unshift(post);

            saveData();

            renderPosts();
        };

        reader.readAsDataURL(imageFile);

    }else{

        posts.unshift(post);

        saveData();

        renderPosts();
    }

    document.getElementById("postInput").value = "";
    document.getElementById("imageInput").value = "";
}

function renderPosts(filteredPosts = posts){

    postsContainer.innerHTML = "";

    filteredPosts.forEach(post => {

        let commentsHTML = "";

        post.comments.forEach(comment => {

            commentsHTML += `
            <div class="comment">
                💬 ${comment}
            </div>
            `;
        });

        postsContainer.innerHTML += `

        <div class="post">

            <div class="post-header">

                <img src="https://i.pravatar.cc/100?img=5">

                <div>

                    <h4>John Doe</h4>

                    <small>${post.time}</small>

                </div>

            </div>

            <p>${post.content}</p>

            ${
                post.image
                ?
                `<img src="${post.image}" alt="">`
                :
                ""
            }

            <div class="post-actions-bar">

                <button
                class="like-btn"
                onclick="likePost(${post.id})">
                👍 ${post.likes}
                </button>

                <button
                class="comment-btn"
                onclick="showCommentBox(${post.id})">
                💬 Comment
                </button>

                <button
                class="share-btn"
                onclick="sharePost(${post.id})">
                📤 ${post.shares}
                </button>

                <button
                onclick="savePost(${post.id})">
                ${
                    post.saved
                    ?
                    "🔖 Saved"
                    :
                    "🔖 Save"
                }
                </button>

                <button
                class="delete-btn"
                onclick="deletePost(${post.id})">
                🗑 Delete
                </button>

            </div>

            <div id="commentBox-${post.id}"
            style="display:none;margin-top:15px;">

                <input
                type="text"
                id="commentInput-${post.id}"
                placeholder="Write a comment..."
                style="
                width:100%;
                padding:10px;
                margin-bottom:10px;
                ">

                <button
                onclick="addComment(${post.id})">
                Add Comment
                </button>

            </div>

            <div class="comments">
                ${commentsHTML}
            </div>

        </div>

        `;
    });
}

function likePost(id){

    posts = posts.map(post => {

        if(post.id === id){
            post.likes++;
        }

        return post;
    });

    saveData();

    renderPosts();
}

function sharePost(id){

    posts = posts.map(post => {

        if(post.id === id){
            post.shares++;
        }

        return post;
    });

    saveData();

    renderPosts();

    alert("Post Shared Successfully!");
}

function savePost(id){

    posts = posts.map(post => {

        if(post.id === id){
            post.saved = !post.saved;
        }

        return post;
    });

    saveData();

    renderPosts();
}

function deletePost(id){

    if(confirm("Delete this post?")){

        posts =
        posts.filter(post => post.id !== id);

        saveData();

        renderPosts();
    }
}

function showCommentBox(id){

    const box =
    document.getElementById(`commentBox-${id}`);

    if(box.style.display==="none"){
        box.style.display="block";
    }else{
        box.style.display="none";
    }
}

function addComment(id){

    const input =
    document.getElementById(
    `commentInput-${id}`);

    const comment =
    input.value.trim();

    if(comment===""){
        return;
    }

    posts = posts.map(post => {

        if(post.id === id){

            post.comments.push(comment);

        }

        return post;
    });

    saveData();

    renderPosts();
}

const searchInput =
document.getElementById("searchInput");

searchInput.addEventListener("keyup", () => {

    const keyword =
    searchInput.value.toLowerCase();

    const filteredPosts =
    posts.filter(post =>
        post.content
        .toLowerCase()
        .includes(keyword)
    );

    renderPosts(filteredPosts);
});

const darkModeBtn =
document.getElementById("darkModeBtn");

darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle(
    "dark-mode"
    );

});

renderPosts();