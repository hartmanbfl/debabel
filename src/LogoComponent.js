import React from 'react';


const LogoComponent = (props) => {

    // Get the Server name from environment variable
    const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;
    const churchName = props.churchName;
    const url = `${serverName}/img/${churchName}.png`

    return <div> <img src={url} alt="Church Logo"></img></div>;
}

export default LogoComponent;