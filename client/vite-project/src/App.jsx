import { useState, useEffect } from "react";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import { socket } from "./socket";

export default function App() {
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(4);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleUsers = (list) => {
      console.log("Online users:", list);
      setUsers(list);
    };

    socket.on("users", handleUsers);

    return () => {
      socket.off("users", handleUsers);
    };
  }, []);

  return (
    <div className="app-root">
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        width={width}
        setWidth={setWidth}
      />

      <div className="main-layout">

  <div className="canvas-container">
    <Canvas tool={tool} color={color} width={width} />
  </div>


  <div className="users-panel">
    <h3>👥 Online Users ({users.length})</h3>

    {users.length === 0 && (
      <p style={{ fontSize: "13px", color: "#777" }}>Waiting for users...</p>
    )}

    {users.map((u) => (
      <div key={u} className="user-item">
        <span className="dot"></span>
        User-{u.slice(0, 6)}
      </div>
    ))}
  </div>

</div>


    </div>
  );
}
