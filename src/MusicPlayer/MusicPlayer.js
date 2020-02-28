import React, {useRef, useState} from 'react';
import {t} from "@tea/app/i18n";
import "./MusicPlayer.css";
import PLAY from "./play.svg";
import PAUSE from "./pause.svg"

function MusicPlayer({src}) {

  const [playerIcon, setPlayerIcon] = useState(PLAY);
  const [progressWidth, setProgressWidth] = useState(0);
  const [downloadProgressArr, setDownloadProgressArr] = useState([]);

  const player = useRef(null);
  const isPressOn = useRef(false);
  const traceBg = useRef(null);

  // 播放，暂停
  function handlePlayOrPause() {
    let playerTemp = player.current;

    if (playerTemp.paused) {
      setPlayerIcon(PAUSE);
      playerTemp.play();//播放音乐
    } else {
      setPlayerIcon(PLAY);
      playerTemp.pause();//暂停音乐
    }
  }

  // 离开感应区
  function handleMouseLeave() {
    isPressOn.current = false;
  }

  // 松开鼠标
  function handleMouseUp(e) {
    isPressOn.current = false;

    let calculateRect = traceBg.current.getBoundingClientRect();

    let leftX = calculateRect.left, widthX = calculateRect.width;
    let pointer = Math.min(Math.max(e.clientX, leftX), leftX + widthX);
    let percent = (pointer - leftX) / widthX;
    player.current.currentTime = (percent * player.current.duration).toFixed(2);
  }

  // 拖动
  function handleMouseMove(e) {
    if (!isPressOn.current) return;

    let rect = traceBg.current.getBoundingClientRect(), leftX = rect.left, widthX = rect.width;

    let pointer = Math.min(Math.max(e.clientX, leftX), leftX + widthX);
    let distance = pointer - leftX;

    let curWidthPercent = (distance / widthX * 100).toFixed(2);
    setProgressWidth(curWidthPercent);
    player.current.currentTime = (distance / widthX).toFixed(2) * player.current.duration;

    // 清除选中的文本
    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
  }

  // 更新播放进度
  function handleTimeUpdate() {
    let {currentTime, duration} = player.current;

    let percent = (currentTime / duration * 100).toFixed(2);
    setProgressWidth(percent);

    handleAudioDownloadProgressUpdate();
  }

  // 播放结束
  function handleEnded() {
    setPlayerIcon(PLAY);
    player.current.pause();
    player.current.currentTime = 0;
  }

  // 按下鼠标，准备拖动
  function handleMouseDown() {
    isPressOn.current = true;
  }

  // 点击切换进度
  function handleProgressClick(e) {
    let calculateRect = traceBg.current.getBoundingClientRect();

    let leftX = calculateRect.left, widthX = calculateRect.width;
    let pointer = Math.min(Math.max(e.clientX, leftX), leftX + widthX);
    let distance = pointer - leftX;

    let curWidthPercent = (distance / widthX * 100).toFixed(2);
    setProgressWidth(curWidthPercent);
    player.current.currentTime = (distance / widthX).toFixed(2) * player.current.duration;
  }

  // 缓冲进度
  function handleAudioDownloadProgressUpdate() {
    const audio = player.current;
    const downloadProgressArr = [];
    for (let i = 0; i < audio.buffered.length; i++) {
      const bufferedStart = audio.buffered.start(i);
      const bufferedEnd = audio.buffered.end(i);

      downloadProgressArr.push({
        left: `${(bufferedStart / audio.duration * 100 || 0).toFixed(2)}%`,
        width: `${((bufferedEnd - bufferedStart) / audio.duration * 100 || 0).toFixed(2)}%`,
      })
    }
    setDownloadProgressArr(downloadProgressArr);
  }

  return (
    <div className="player-wrapper">
      <audio className={"audio-player"} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} ref={player} controls
             src={src}
      >{t("请升级浏览器以播放音频")}
      </audio>
      <div className="player-control">
        <div className="progress-panel" onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp}
             onMouseMove={handleMouseMove}>
          <div className="trace-bg" ref={traceBg} onClick={handleProgressClick}>
            <div style={{width: `${progressWidth}%`}} className="trace-pass">
              <div className="progress-btn" onMouseDown={handleMouseDown}></div>
            </div>
            {downloadProgressArr.map(({left, width}, i) => (
              <div
                key={i}
                className="download-progress"
                style={{
                  left,
                  width,
                  transitionDuration: '.2s'
                }}
              />
            ))}
          </div>
        </div>
        <div className="control-btn-wrapper">
          <a onClick={handlePlayOrPause} className="control-btn"><img className="control-icon"
                                                                      src={playerIcon}/></a>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
