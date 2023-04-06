import "./App.css";
import { useState } from "react";

let myToken;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [amount, setAmount] = useState("");

  function handleLogin() {
    const user = {
      username: username,
      password: password,
    };

    const userString = JSON.stringify(user);

    fetch("http://localhost:3000/sessions", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Authorization: Bearer,
      },

      body: userString,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        myToken = data.token;
      });
  }

  function handleGetAccount() {
    fetch("http://localhost:3000/me/accounts", {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + myToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAmount(data);
      });
  }

  return (
    <div className="App">
      <main>
        <h1>Login</h1>
        <label>Username</label>
        <input type="text" onChange={(e) => setUsername(e.target.value)} />
        <label>Password</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleLogin}>Logga in</button>
        <div>
          <h2>Amount: {amount}</h2>
          <button onClick={handleGetAccount}>Show amount</button>
        </div>
      </main>
    </div>
  );
}

export default Login;
