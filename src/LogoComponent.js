import React, { useState, useEffect } from 'react';


const LogoComponent = (props) => {
    const [imageUrl, setImageUrl] = useState(null);

    // Get the Server name from environment variable
    const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

    useEffect(() => {
        fetch(`${serverName}/churchinfo`)
          .then(response => response.json())
          .then(data => {
              setImageUrl(`${serverName}/img/${data.logo}`);  
          });
      }, []);


    return <div> <img src={imageUrl} alt="Church Logo"></img></div>;
}

export default LogoComponent;