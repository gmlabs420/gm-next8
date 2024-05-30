"use client";
import { useRef, useState, useEffect } from "react";

export default function DrawingModule() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [markerSize, setMarkerSize] = useState(10);
    const [markerColor, setMarkerColor] = useState("#000000");

    const startDrawing = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            const rect = canvas.getBoundingClientRect();
            ctx.beginPath();
            ctx.arc(e.clientX - rect.left, e.clientY - rect.top, markerSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = markerColor;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
            setIsDrawing(true);
        }
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.strokeStyle = markerColor;
            ctx.lineWidth = markerSize;
            ctx.lineCap = "round";
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleCopy = () => {
        const canvas = canvasRef.current;
        canvas?.toBlob((blob) => {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]);
            alert("Drawing copied to clipboard!");
        });
    };

    const handleShare = () => {
        const canvas = canvasRef.current;
        canvas?.toBlob((blob) => {
            const file = new File([blob], "drawing.png", { type: "image/png" });
            const shareData = {
                files: [file],
                title: "My Drawing",
                text: "Check out my drawing!",
            };
            navigator.share(shareData).catch(console.error);
        });
    };

    const handleReset = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleBrushSizeChange = (size: number) => {
        setMarkerSize(size);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${markerSize}" height="${markerSize}" viewBox="0 0 ${markerSize} ${markerSize}"><circle cx="${markerSize / 2}" cy="${markerSize / 2}" r="${markerSize / 2}" fill="${encodeURIComponent(markerColor)}" /></svg>') ${markerSize / 2} ${markerSize / 2}, auto`;
        }
    }, [markerSize, markerColor]);

    return (
        <div className="drawing-module">
            <h1>DRAW</h1>
            <h2>Be Creative. Be Bold!</h2>
            <h4>GM. Doodle to start the day.</h4>
            <div className="controls">
                <div className="brush-size-picker-container">
                    <div className="brush-size-picker">
                        {[10, 20, 30].map((size) => (
                            <button key={size} onClick={() => handleBrushSizeChange(size)} className="brush-button">
                                <div
                                    className="brush-size-icon"
                                    style={{
                                        width: size,
                                        height: size,
                                        backgroundColor: markerColor,
                                    }}
                                ></div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="color-picker-container">
                    <label>
                        Marker Color:
                        <input
                            type="color"
                            value={markerColor}
                            onChange={(e) => setMarkerColor(e.target.value)}
                        />
                    </label>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="drawing-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            ></canvas>

            <div className="button-container">
                <button onClick={handleReset} className="action-button">
                    Reset
                </button>
                <button onClick={handleCopy} className="action-button">
                    Copy
                </button>
                <button onClick={handleShare} className="action-button">
                    Share
                </button>
            </div>
        </div>
    );
}
