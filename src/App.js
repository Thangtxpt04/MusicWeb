import { useState, useRef, useEffect } from "react";
import "./App.css";
import videos from "./assets/Videos";
import musicApi from "./MusicApi";
function App() {
  const [currentMusicDetails, setcurrentMusicDetails] = useState(musicApi[0]);
  const [audioProgessbar, setAudioProgessbar] = useState(0);
  const currentAudio = useRef();
  const modal = useRef();
  let musicIndex = useRef(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [videoBackground, setVideoBackground] = useState(videos.video6);
  const [musicTimeDuration, setMusicTimeDuration] = useState("03 : 40");
  const [musicTimeCurrent, setMusicTimeCurrent] = useState("00 : 00");

  useEffect(() => {
    modal.current.addEventListener("click", handleHiddenModal);
  }, []);

  useEffect(() => {
    isAudioPlaying ? currentAudio.current.play() : currentAudio.current.pause();
  });

  const handleMusicProgessBar = (e) => {
    setAudioProgessbar(e.target.value);
    currentAudio.current.currentTime =
      (e.target.value * currentAudio.current.duration) / 100;
  };

  const handleAudioPlay = () => {
    if (!isAudioPlaying) {
      currentAudio.current.play();
      setIsAudioPlaying(true);
    } else {
      currentAudio.current.pause();
      setIsAudioPlaying(false);
    }
  };

  const handleNextSong = () => {
    if (musicIndex.current >= musicApi.length - 1) {
      musicIndex.current = 0;
    } else {
      musicIndex.current++;
    }
    setcurrentMusicDetails(musicApi[musicIndex.current]);
    setIsAudioPlaying(true);
  };

  const handlePrevSong = () => {
    if (musicIndex.current === 0) {
      musicIndex.current = musicApi.length - 1;
    } else {
      musicIndex.current--;
    }
    setcurrentMusicDetails(musicApi[musicIndex.current]);
    setIsAudioPlaying(true);
  };

  const handleAudioUpdate = () => {
    let minDuration = Math.floor(currentAudio.current.duration / 60);
    let secondDuration = Math.floor(currentAudio.current.duration % 60);

    let durationTime = `${
      minDuration < 10 ? `0${minDuration}` : minDuration
    } : ${secondDuration < 10 ? `0${secondDuration}` : secondDuration}`;
    setMusicTimeDuration(durationTime);

    let minCurrent = Math.floor(currentAudio.current.currentTime / 60);
    let secondCurrent = Math.floor(currentAudio.current.currentTime % 60);

    let currentTime = `${minCurrent < 10 ? `0${minCurrent}` : minCurrent} : ${
      secondCurrent < 10 ? `0${secondCurrent}` : secondCurrent
    }`;
    setMusicTimeCurrent(currentTime);

    const progress = parseInt(
      (currentAudio.current.currentTime / currentAudio.current.duration) * 100
    );
    setAudioProgessbar(isNaN(progress) ? 0 : progress);
  };

  const handleChangeBackground = () => {
    const keys = Object.keys(videos);
    let randomKey;
    do {
      randomKey = keys[Math.floor(Math.random() * keys.length)];
    } while (videos[randomKey] === videoBackground);
    console.log(randomKey);

    setVideoBackground(videos[randomKey]);
  };

  const handleHiddenModal = () => {
    modal.current.style.display = "none";
  };

  return (
    <>
      <div className="container">
        <audio
          src={currentMusicDetails.songSrc}
          ref={currentAudio}
          onEnded={handleNextSong}
          onTimeUpdate={handleAudioUpdate}
        ></audio>
        <video
          src={videoBackground}
          autoPlay
          muted
          loop
          className="background-video"
        ></video>
        <div className="black-screen"></div>
        <div className="music-container">
          <p className="music-title">Music Player</p>
          <p className="music-song-name">{currentMusicDetails.songName}</p>
          <p className="music-artist-name">{currentMusicDetails.artistName}</p>
          <img
            src={currentMusicDetails.songAvatar}
            alt="Song Avatar"
            className="song-avatar"
          />
          <div className="music-timer-div">
            <p className="music-current-time">{musicTimeCurrent}</p>
            <p className="music-duration-time">{musicTimeDuration}</p>
          </div>

          <input
            type="range"
            name="musicProgessBar"
            className="music-progess-bar"
            value={audioProgessbar}
            onChange={handleMusicProgessBar}
          />

          <div className="music-controller">
            <i
              className="fa-solid fa-backward musicControler"
              onClick={handlePrevSong}
            ></i>
            <i
              className={`fa-solid ${
                isAudioPlaying ? "fa-pause-circle" : "fa-circle-play"
              } play-btn`}
              onClick={handleAudioPlay}
            ></i>
            <i
              className="fa-solid fa-forward musicControler"
              onClick={handleNextSong}
            ></i>
          </div>
        </div>
        <div className="change-background-btn" onClick={handleChangeBackground}>
          Change background
        </div>
      </div>

      {/* <!-- Modal --> */}

      <div className="modal" ref={modal}>
        <div className="modal-content">
          <div className="modal-header">
            <div></div>
            <div className="modal-title">Welcome!!</div>
            <div className="modal-close" onClick={handleHiddenModal}>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
          <div className="modal-body">
            <p>
              Nhớ đeo tai nghe trước khi nghe nhạc nhé
              <i className="fa-solid fa-headphones modal-headphones"></i>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
