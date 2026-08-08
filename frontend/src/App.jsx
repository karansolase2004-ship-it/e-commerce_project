import { useEffect, useState } from 'react';

function App(){
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api')
    .then(response => response.json())
    // below data.message belong to message from views.py of store
    .then(data => setMessage(data.message))
    .catch(error => console.error('Error Fetching Message : ', error));
  }, []);

  return (
    <div>
      <h1>Message from Backend : </h1>
      <p>{message || 'Loading...'}</p>
    </div>
  )
}

export default App
