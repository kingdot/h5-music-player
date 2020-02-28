import React from 'react';
import './App.css';
import MusicPlayer from "./MusicPlayer/MusicPlayer";

function App() {
    return (
        <div className="App">
            <MusicPlayer src={"https://hanzluo.s3-us-west-1.amazonaws.com/music/zhiya.mp3"}/>
            <MusicPlayer src={"https://hanzluo.s3-us-west-1.amazonaws.com/music/ziyounvshen.mp3"}/>
            <MusicPlayer src={"https://hanzluo.s3-us-west-1.amazonaws.com/music/wuyuwuqing.mp3"}/>
            <MusicPlayer src={"https://hanzluo.s3-us-west-1.amazonaws.com/music/suipian.mp3"}/>
            <MusicPlayer src={"https://hanzluo.s3-us-west-1.amazonaws.com/music/yonghengdegangwan.mp3"}/>
        </div>
    );
}

export default App;
