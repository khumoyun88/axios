import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import { Routes, useNavigate, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";

import api from "./api/posts";
// import  axios  from "axios";
import useFetch from "./hooks/useFetch";


// const initPostr = [
//   {
//     id: 1,
//     title: "My First Post",
//     datetime: "July 01, 2021 11:17:36 AM",
//     body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
//   },

//   {
//     id: 2,
//     title: "My 2nd Post",
//     datetime: "July 01, 2021 11:17:36 AM",
//     body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
//   },

//   {
//     id: 3,
//     title: "My 3rd Post",
//     datetime: "July 01, 2021 11:17:36 AM",
//     body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
//   },

//   {
//     id: 4,
//     title: "My Fourth Post",
//     datetime: "July 01, 2021 11:17:36 AM",
//     body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
//   },
// ]

function App() {
  
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const navigate = useNavigate();
  const [newPostLoading , setNewPostLoading]  = useState("false")

  const {data:posts, setData:setPosts, loading , error} = useFetch("/posts")


  // const [posts, setPosts] = useState([]);
  // const [loading , setLoading] = useState(true);
  // const [error , setError] = useState(null);


  // useEffect( () => {
  //   const CancelToken = axios.CancelToken;
  //   const source = CancelToken.source();


  //   (async () => {
  //     try {
  //       const response = await api.get("/posts", { cancelToken: source.token });
  //       setPosts(response.data);
  //     } catch (error) {
  //       if (axios.isCancel(error)) {
  //         console.log("Request cancelled", error.message);
  //       } else {
  //         console.error(error.message);
  //         setError(error.message);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();

  //   return () => {
  //     source.cancel("Fetch posts cancelled by user");
  //   };
  // }, []);




  useEffect(() => {
    // setError(null)
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    
    const newPost = { id, title: postTitle, datetime, body: postBody };
    setNewPostLoading(true)
    try{
      const response = await api.post("/posts", newPost)
    }catch(error){
      console.error(error.message)
    }finally{
      setNewPostLoading(false)
    }

    const allPosts = [...posts, newPost];
    setPosts(allPosts);
    setPostTitle("");
    setPostBody("");
    navigate("/");
  };

  const handleDelete = async(id) => {
    try {
      const response = await api.delete(`/posts/${id}`)
      
    } catch (error) {
      console.error(error.message)
      
    }

    const postsList = posts.filter((post) => post.id !== id);
    setPosts(postsList);
    navigate("/");
  };

  return (
    <div className='App'>
      <Header title='React JS Blog' />
      <Nav search={search} setSearch={setSearch} />
      {error && <p style={{color:"red"}}>error: {error}</p>}
      <Routes>
        <Route path='/' element={<Home loading={loading} posts={searchResults} />} />
        <Route
          path='/post'
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
              loading= {newPostLoading}

            />
          }
        />
        <Route
          path='/post/:id'
          element={<PostPage posts={posts} handleDelete={handleDelete} />}
        />
        <Route path='/about' component={<About />} />
        <Route path='*' component={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
