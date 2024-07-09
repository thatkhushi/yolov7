import labels from "./labels.json";

function xywh2xyxy(x){
  var y = [];
  y[0] = x[0] - x[2] / 2  
  y[1] = x[1] - x[3] / 2 
  y[2] = x[0] + x[2] / 2  
  y[3] = x[1] + x[3] / 2  
  return y;
}

export const renderBoxes = (videoRef,canvasRef, threshold, boxes_data, scores_data, classes_data, handleHighScore) => {

  const ctx = canvasRef.current.getContext("2d");

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 

  // font configs
  const font = "18px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  for (let i = 0; i < scores_data.length; ++i) {
    if (scores_data[i] > threshold) {
      const klass = labels[classes_data[i]];
      const score = (scores_data[i] * 100).toFixed(1);

      let [x1, y1, x2, y2] = xywh2xyxy(boxes_data[i]);

      const width = x2 - x1;
      const height = y2 - y1;

      // Draw the bounding box.
      ctx.strokeStyle = "#B033FF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, width, height);

      // Draw the label background.
      ctx.fillStyle = "#B033FF";
      const textWidth = ctx.measureText(klass + " - " + score + "%").width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x1 - 1, y1 - (textHeight + 2), textWidth + 2, textHeight + 2);

      // Draw labels
      ctx.fillStyle = "#ffffff";
      ctx.fillText(klass + " - " + score + "%", x1 - 1, y1 - (textHeight + 2));
      if (scores_data[i] > 0.99) {
        console.log(scores_data[i])
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageDataUrl = canvasRef.current.toDataURL();
        handleHighScore(imageDataUrl);
        return;
      }
    }
  }
};
