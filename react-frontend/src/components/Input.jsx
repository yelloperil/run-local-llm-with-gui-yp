const Input = ({ id, type, value, onChange, placeholder }) => {
  return (
    <>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </>
  );
};

const Button = ({ onClick, disabled }) => {
  return(
    <button onClick={onClick} disabled={disabled}>
        {disabled ? 'Loading...' : 'Submit'}
    </button>
  )
};

const Response = ({ response }) => {
  return (
    <div id="response">
      <strong>{response}</strong>
    </div>
  )
};

export { Input, Button, Response };