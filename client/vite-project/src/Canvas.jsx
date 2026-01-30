import { useEffect, useRef } from "react";
import { socket } from "./socket";

export default function Canvas({ tool, color, width }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const cursorsRef = useRef({});


  const strokesRef = useRef([]);        // committed strokes
  const previewRef = useRef(null);      // current drawing stroke
  const drawingRef = useRef(false);

  /* ================== SOCKET SETUP ================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d");

    // receive committed stroke from server
    socket.on("stroke:start", stroke => {
      if (strokesRef.current.some(s => s.id === stroke.id)) return;
      strokesRef.current.push(cloneStroke(stroke));
      redraw();
    });

    // authoritative history (undo / redo)
    socket.on("history", serverStrokes => {
      strokesRef.current = serverStrokes.map(cloneStroke);
      redraw();
    });

    socket.on("cursor", ({ id, pos }) => {
  cursorsRef.current[id] = pos;
  redraw();
});

socket.on("cursor:remove", (id) => {
  delete cursorsRef.current[id];
  redraw();
});


    document.addEventListener("keydown", handleKeys);
    resize();
    window.addEventListener("resize", resize);

    return () => {
      socket.off("stroke:start");
      socket.off("history");
      document.removeEventListener("keydown", handleKeys);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ================== CONTROLS ================== */
  function handleKeys(e) {
    if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      socket.emit("undo");
    }
    if (e.ctrlKey && e.key === "y") {
      e.preventDefault();
      socket.emit("redo");
    }
  }

  function resize() {
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    redraw();
  }

  function getPos(e) {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  /* ================== DRAWING ================== */
  function onDown(e) {
    drawingRef.current = true;
    const pos = getPos(e);

    previewRef.current = {
      id: crypto.randomUUID(),
      tool,
      color,
      width,
      points: [pos]
    };
  }

  function onMove(e) {
    if (!drawingRef.current || !previewRef.current) return;

    const pos = getPos(e);
    previewRef.current.points.push(pos);
    socket.emit("cursor", getPos(e));

    redraw();
  }

  function onUp() {
  if (!previewRef.current) return;

  drawingRef.current = false;

  // ✅ COMMIT LOCALLY
  strokesRef.current.push(previewRef.current);

  // ✅ COMMIT TO SERVER
  socket.emit("stroke:start", previewRef.current);

  previewRef.current = null;
}

  /* ================== RENDER ================== */
  function redraw() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw committed strokes
    strokesRef.current.forEach(drawStroke);

    Object.values(cursorsRef.current).forEach(p => {
  ctx.beginPath();
  ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
});

    // draw preview stroke last
    if (previewRef.current) {
      drawStroke(previewRef.current);
    }
  }

  function drawStroke(stroke) {
    const ctx = ctxRef.current;
    ctx.strokeStyle =
      stroke.tool === "eraser" ? "white" : stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    stroke.points.forEach((p, i) =>
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
    );
    ctx.stroke();
  }

  function cloneStroke(stroke) {
    return {
      ...stroke,
      points: stroke.points.map(p => ({ ...p }))
    };
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
    />
  );
}
