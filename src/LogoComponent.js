import React, { useState, useEffect } from 'react';


const LogoComponent = (props) => {
    const [data, setData] = useState([]);

    // Get the Server name from environment variable
    const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

    useEffect(() => {
        fetch('https://example.com/api/data')
          .then(response => response.json())
          .then(data => setData(data));
      }, []);


    const url = `${serverName}/img/${churchName}.png`

    return <div> <img src={url} alt="Church Logo"></img></div>;
}

export default LogoComponent;