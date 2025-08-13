import React from "react";

export default function Content({ username, onLogout, onVideoPlay }) {
  const videos = [
    { id: "Mathematics", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    { id: "Physics", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    { id: "Chemistry", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  ];

  return (
    <>
      <div className="navbar">
        <div className="navbar-inner container">
          <div><strong>Welcome</strong> {username}</div>
          <button className="btn btn-danger" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="container">
        <h3 className="section-title">Videos</h3>
        <div className="video-grid">
          {videos.map((v) => (
            <div className="video-card" key={v.id}>
              <video
                className="video"
                controls
                onPlay={() => onVideoPlay(v.id)}
              >
                <source src={v.src} type="video/mp4" />
              </video>
              <div className="video-label">{v.id.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <div className="spacer" />
      </div>
    </>
  );
}
