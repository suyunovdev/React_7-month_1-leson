import { useState, useEffect } from "react";
import Modal from "react-modal";
import "../src/Home.scss";

Modal.setAppElement('#root'); // Modallarning ekran o'rtasida chiqishi uchun kerak.

const Home = () => {
  const [postsData, setPostsData] = useState([]);
  const [newPostName, setNewPostName] = useState("");
  const [newPostAge, setNewPostAge] = useState("");
  const [newPostGender, setNewPostGender] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const [editPostName, setEditPostName] = useState("");
  const [editPostAge, setEditPostAge] = useState("");
  const [editPostGender, setEditPostGender] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPostsData = async () => {
    try {
      const response = await fetch("http://localhost:5000/posts");
      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setPostsData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPostsData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmDelete) {
        return;
      }

      const response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPostsData(postsData.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleAddPost = async () => {
    try {
      const response = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newPostName, age: newPostAge, gender: newPostGender }),
      });
      if (!response.ok) {
        throw new Error("Failed to add post");
      }

      setNewPostName("");
      setNewPostAge("");
      setNewPostGender("");

      fetchPostsData();
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleEdit = (post) => {
    setEditPostId(post.id);
    setEditPostName(post.name);
    setEditPostAge(post.age);
    setEditPostGender(post.gender);
    setIsModalOpen(true);
  };

  const handleUpdatePost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${editPostId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editPostName, age: editPostAge, gender: editPostGender }),
      });
      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      setEditPostId(null);
      setEditPostName("");
      setEditPostAge("");
      setEditPostGender("");
      setIsModalOpen(false);

      fetchPostsData();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="Homes">
      <div className="Home">
        <div className="container">
          <div className="home">
            <div className="logo">
              <h1>LOGO</h1>
            </div>
            <div className="title">
              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#">Shop</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="all">
            <div className="add-post">
              <h2>Add New Post</h2>
              <input
                type="text"
                placeholder="Name"
                value={newPostName}
                onChange={(e) => setNewPostName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Age"
                value={newPostAge}
                onChange={(e) => setNewPostAge(e.target.value)}
              />
              <input
                type="text"
                placeholder="Gender"
                value={newPostGender}
                onChange={(e) => setNewPostGender(e.target.value)}
              />
              <button onClick={handleAddPost}>Add Post</button>
            </div>

            <div className="all-api">
              {postsData.map((post) => (
                <div className="post" key={post.id}>
                  <div className="alls card">
                    <div>
                      <h2>{post.name}</h2>
                      <p>Age: {post.age}</p>
                      <p>Gender: {post.gender}</p>
                      <button onClick={() => handleEdit(post)}>Edit</button>
                      <button onClick={() => handleDelete(post.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Post"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Edit Post</h2>
        <input
          type="text"
          value={editPostName}
          onChange={(e) => setEditPostName(e.target.value)}
        />
        <input
          type="text"
          value={editPostAge}
          onChange={(e) => setEditPostAge(e.target.value)}
        />
        <input
          type="text"
          value={editPostGender}
          onChange={(e) => setEditPostGender(e.target.value)}
        />
        <button onClick={handleUpdatePost}>Save</button>
        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
      </Modal>
    </div>
  );
};

export default Home;
