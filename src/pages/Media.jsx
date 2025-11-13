import React from "react";

export default function Media() {
  const media = [
    "https://placekitten.com/300/200",
    "https://placebear.com/300/200",
    "https://placebeard.it/300x200",
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-blue-700 mb-4">Media Gallery 🖼</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {media.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="media"
            className="rounded-xl shadow-md hover:scale-105 transition"
          />
        ))}
      </div>
    </div>
  );
}
