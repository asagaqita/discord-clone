"use client";

import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, file: File | null) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    alert(file);

    setUploading(true);

    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/upload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      }
    );

    if (response.ok) {
      const { url, fields } = await response.json();

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        alert("Upload successful!");
      } else {
        console.error("S3 Upload Error:", uploadResponse);
        alert("Upload failed.");
      }
    } else {
      alert("Failed to get pre-signed URL.");
    }

    setUploading(false);
  };

  return (
    <main>
      <h1>Upload a File to S3</h1>
      <input
        id="file"
        type="file"
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            setFile(files[0]);
          }
        }}
        accept="image/png, image/jpeg"
      />
      <button
        type="submit"
        onClick={(e) => handleSubmit(e, file)}
        disabled={uploading}
      >
        Upload
      </button>
    </main>
  );
}
