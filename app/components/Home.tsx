/* eslint-disable no-console */
import * as cv from 'opencv4nodejs';
import React, { useState } from 'react';
// import styles from './Counter.css';
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes.json';
import { VideoCaptureProperties } from '../constants/openCVProperties';

const { dialog } = require('electron').remote;

console.log(`OpenCV version: ${cv.version}`);
// for ffmpeg version check app/node_modules/opencv-build/opencv/build/CMakeVars.txt
console.log(`ffmpeg version (manually entered): 3.4.2`);

export default function Home() {
  const [htmlImg, setHtmlImg] = useState('');

  const showVideo = (path: string) => {
    console.log(path);

    const vid = new cv.VideoCapture(path);
    const lengthInFrames =
      vid.get(VideoCaptureProperties.CAP_PROP_FRAME_COUNT) - 1;
    console.log(lengthInFrames);

    const frameToCapture = Math.round(lengthInFrames / 2);
    console.log(frameToCapture);
    vid.set(VideoCaptureProperties.CAP_PROP_POS_FRAMES, frameToCapture);
    console.log(vid.get(VideoCaptureProperties.CAP_PROP_POS_FRAMES));
    if (
      frameToCapture !== vid.get(VideoCaptureProperties.CAP_PROP_POS_FRAMES)
    ) {
      // playhead not at correct position, use ratio instead
      vid.set(VideoCaptureProperties.CAP_PROP_POS_AVI_RATIO, 0.5);
    }

    // read frame from capture
    vid
      .readAsync()
      .then(mat => {
        // show image
        console.log(mat);
        const matScaled = mat.resizeToMax(960);
        const outBase64 = cv.imencode('.jpg', matScaled).toString('base64'); // Perform base64 encoding
        setHtmlImg(`data:image/jpeg;base64,${outBase64}`);

        return undefined;
      })
      .catch(err => console.error(err));
  };

  const openFile = () => {
    dialog
      .showOpenDialog({ properties: ['openFile'] })
      .then(fileObject => {
        const { filePaths } = fileObject;
        console.log(filePaths[0]);
        showVideo(filePaths[0]);
        return undefined;
      })
      .catch(err => console.error(err));
  };

  return (
    <div
      //  className={styles.container}
      data-tid="container"
    >
      <h2>Home</h2>
      {/* <div>
        <Link to={routes.COUNTER}>to Counter</Link>
      </div> */}
      <br />
      <button type="button" onClick={openFile}>
        Open video
      </button>
      <img alt="" src={htmlImg} />
    </div>
  );
}
