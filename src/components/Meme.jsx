import { useState, useEffect } from "react";

export default function Meme() {
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    randomImage: "http://i.imgflip.com/1bij.jpg",
  });
  const [allMemes, setAllMemes] = useState([]);

  useEffect(() => {
    async function getMemes() {
      const res = await fetch("https://api.imgflip.com/get_memes");
      const data = await res.json();
      setAllMemes(data.data.memes);
    }
    getMemes();
  }, []);

  function getMemeImage() {
    const randomNumber = Math.floor(Math.random() * allMemes.length);
    const url = allMemes[randomNumber].url;
    setMeme((prevMeme) => ({
      ...prevMeme,
      randomImage: url,
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setMeme((prevMeme) => ({
      ...prevMeme,
      [name]: value,
    }));
  }

  <button className="form--button" onClick={downloadMeme}>
    Save Meme 📥
  </button>;

  function downloadMeme() {
    const img = document.querySelector(".meme--image");
    // console.log(img.clientHeight);
    // Create a canvas element
    const canvas = document.createElement("canvas");
    canvas.width = img.clientWidth; // Adjust the canvas size as needed
    canvas.height = img.clientHeight; // Adjust the canvas size as needed

    // Get the 2D drawing context
    const ctx = canvas.getContext("2d");

    // Load the meme image
    const image = new Image();
    image.crossOrigin = "Anonymous"; //to avoid the "tainted canvas" error
    image.src = meme.randomImage;
    image.onload = () => {
      // Draw the meme image on the canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Set font and text properties for top text
      ctx.font = "bold 32px impact, sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";

      // Apply text shadow
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 10; // Adjust the shadow blur as needed
      ctx.lineWidth = 2;
      ctx.letterSpacing = "1px";

      // Draw top text on the canvas
      const topText = meme.topText.toUpperCase();
      ctx.strokeText(topText, canvas.width / 2, 40);
      ctx.fillText(topText, canvas.width / 2, 40);

      // Set font and text properties for bottom text
      ctx.font = "bold 32px impact, sans-serif";
      ctx.textAlign = "center";

      // Draw bottom text on the canvas
      const bottomText = meme.bottomText.toUpperCase();
      ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);

      // Create a download link
      const dataURL = canvas.toDataURL("image/jpeg");
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = "gulz-meme.jpg";
      a.click();
    };
  }

  return (
    <main>
      <div className="form">
        <input
          type="text"
          placeholder="Top text"
          className="form--input"
          name="topText"
          value={meme.topText}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Bottom text"
          className="form--input"
          name="bottomText"
          value={meme.bottomText}
          onChange={handleChange}
        />
        <button className="form--button" onClick={getMemeImage}>
          Get a new meme image 🖼
        </button>
      </div>
      <div className="wrap">
        <div className="meme">
          <img src={meme.randomImage} className="meme--image" />
          <h2 className="meme--text top">{meme.topText}</h2>
          <h2 className="meme--text bottom">{meme.bottomText}</h2>
        </div>
        <button className="dwnld--button" onClick={downloadMeme}>
          Save meme
        </button>
      </div>
    </main>
  );
}
