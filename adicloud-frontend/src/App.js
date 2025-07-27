import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(null);

  const API_URL = "https://TU-API.onrender.com"; // reemplaza con tu URL de Render

  const login = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setToken(data.token);
  };

  const getProfile = async () => {
    const res = await fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setProfile(data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Adicloud Login</h1>
      {!token ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Token obtenido</h2>
          <button onClick={getProfile}>Ver perfil</button>
          {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
}

export default App;
