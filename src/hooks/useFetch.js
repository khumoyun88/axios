import { useState , useEffect } from "react";
import axios from "axios";
import api from "../api/posts"


const useFetch = (path)  => {

  const [data, setData] = useState([]);
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState(null);


  useEffect( () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();


    (async () => {
      try {
        const response = await api.get(path, { cancelToken: source.token });
        setData(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request cancelled", error.message);
        } else {
          console.error(error.message);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      source.cancel("Fetch posts cancelled by user");
    };
  }, []);




  return { data , setData, loading , error}

}

export default useFetch
