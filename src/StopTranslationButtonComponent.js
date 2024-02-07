const buttonStyle = {
    backgroundColor: 'red',
    color: 'white',
    fontSize: '20px',
    borderRadius: '10px',
    padding: '10px 25px',
    margin: '0 auto',
    marginTop: '10px',
    display: 'block',
    bottom: '10%',
};

const StopTranslationButtonComponent = ({ onClick }) => {

    return (
        <div>
            <button style={buttonStyle} onClick={onClick}>
                Stop 
            </button>
        </div>
    )
}

export default StopTranslationButtonComponent;