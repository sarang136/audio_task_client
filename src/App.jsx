import React, { useEffect, useState } from "react";

const App = () => {
  const [audios, setAudios] = useState([]);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const response = await fetch("http://localhost:4000/get");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n").filter(Boolean);

          lines.forEach((line) => {
            const data = line.replace("data: ", "");
            const doc = JSON.parse(data);
            setAudios((prev) => [...prev, doc]);
          });
        }
      } catch (error) {
        console.log("Error", error);
      }
    };

    fetchAudios();
  }, []);

  console.log("audios", audios);

  return (
    <div>
      {audios?.map((item) => (
        <div key={item._id}>
          <p>{item._id}</p>
          <p>{item.link}</p>

          {item?.data?.map((audio) => (
            <div key={audio._id}>
              <audio controls preload="metadata">
                <source
                  src={`http://localhost:4000/stream/${audio._id}`}
                  type="audio/mpeg"
                />
                Your browser does not support audio.
              </audio>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
