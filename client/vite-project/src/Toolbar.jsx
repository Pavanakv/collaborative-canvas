import { socket } from "./socket";

export default function Toolbar({ tool, setTool, color, setColor, width, setWidth }) {
  return (
    <div className="toolbar">
      <div className="tool-group">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        
        <input
          type="range"
          min="1"
          max="20"
          value={width}
          onChange={e => setWidth(Number(e.target.value))}
        />
        <span>{width}px</span>
      </div>

      <div className="tool-group">
        <button className={tool==="brush"?"active":""} onClick={() => setTool("brush")}>🖌 Brush</button>
        <button className={tool==="eraser"?"active":""} onClick={() => setTool("eraser")}>🧽 Eraser</button>
      </div>

      <div className="tool-group">
        <button onClick={() => socket.emit("undo")}>↩ Undo</button>
        <button onClick={() => socket.emit("redo")}>↪ Redo</button>
      </div>
    </div>
  );
}
