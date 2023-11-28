document.addEventListener("DOMContentLoaded", async function () {
  // Your code goes here

  const blogList = document.getElementById("blog-list");
  const blogForm = document.getElementById("blog-form");
  const formBtn = document.getElementById("formbtn");
  const submitBtn = document.getElementById("submitbtn");
  const formClose = document.getElementById("formclose");

  // modal 
  const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
    const closeModalBtn = document.getElementById("closeModal");

    function openModal(blog) {
      modalTitle.textContent = blog.title;
      modalContent.textContent = blog.content;
      // Add other details you want to display in the modal

      modal.style.display = "flex";
  }

  // Function to close the modal
  function closeModal() {
      modal.style.display = "none";
  }

  // Add event listener to close modal button
  closeModalBtn.addEventListener("click", closeModal);



  formClose.addEventListener("click", () => {
    blogForm.style.display = '';
  })

  formBtn.addEventListener("click", () => {
    blogForm.style.display = "flex";
  });



  // Function to display a blog post on the page
  function displayBlog(blog) {
    const blogElement = document.createElement("div");
    blogElement.classList.add("blog-post");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    const deleteIcon = document.createElement("img");
    deleteIcon.src = "/images/delete.png";
    deleteIcon.alt = "Delete";
    deleteButton.appendChild(deleteIcon);

    // Add click event listener to delete button
    deleteButton.addEventListener('click', async () => {
      try {
          // Assuming you have an API endpoint for deleting a blog post, replace 'your-api-url' with the actual URL.
          const response = await fetch('http://localhost:3000/api/blogs/' + blog._id, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  // You may need to include additional headers, such as authorization headers if required
              },
          });
  
          if (response.ok) {
              const result = await response.json();
              console.log(result.message); // Log the success message from the server if needed
  
              // If the deletion is successful, remove the blog post from the DOM
              blogElement.remove();
          } else {
              // Handle error cases if needed
              const errorData = await response.json(); // Parse the error response from the server
              console.error('Failed to delete blog post:', errorData.error);
          }
      } catch (error) {
          console.error('Error:', error);
      }
  });
  

    // Append delete button to blog post
    blogElement.appendChild(deleteButton);

    const titleElement = document.createElement("h2");
    titleElement.classList.add("blog-title");
    titleElement.textContent = blog.title;

    const contentElement = document.createElement("p");
    contentElement.classList.add("blog-content");
    contentElement.textContent = blog.content;
    if (contentElement.textContent.length > 300) {
        contentElement.textContent = contentElement.textContent.slice(0, 300) + "...";
    }

    const blogDate = document.createElement("p");
    blogDate.classList.add("blog-date");
    console.log(blog.date);
    // Assuming blog.date is a valid Date object, you may need to format it
    const formattedDate = new Date(blog.date).toLocaleDateString();
    blogDate.textContent = formattedDate;

    blogElement.appendChild(titleElement);
    blogElement.appendChild(blogDate);
    blogElement.appendChild(contentElement);

    blogList.appendChild(blogElement);

    blogElement.addEventListener('click', () => {
      openModal(blog);
  });
}


  // Fetch existing blogs on page load
  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/blogs");
      if (response.ok) {
        const blogs = await response.json();
        blogs.reverse();
        blogs.forEach((blog) => displayBlog(blog));
      } else {
        console.error("Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Call fetchBlogs when the page loads
  fetchBlogs();

  blogForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    submitBtn.innerHTML = "Creating...";

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    // Send the new blog post to the server
    const response = await fetch("http://localhost:3000/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    // Refresh the blog list
    if (response.ok) {
      blogForm.reset();
      const newBlog = await response.json();
      displayBlog(newBlog);
      submitBtn.innerHTML = "Create Blog";
      blogForm.style.display = "";
    } else {
      console.error("Failed to create blog");
      submitBtn.innerHTML = "Create Blog";
    }
  });
});
