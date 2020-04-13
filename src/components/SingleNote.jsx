/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import StateContext from '../context';


const ButtonOn = styled.button`
  background-color: green;
  width: 20px;
  height: 20px;
  color: white;
`;

const ButtonOff = styled.button`
  background-color: red;
  width: 20px;
  height: 20px;
  color: white;
`;


const SingleNote = ({ id, note, freq }) => {
  const [value, dispatch] = useContext(StateContext);
  const waves = [
    'triangle',
    'sine',
    'square',
    'sawtooth',
  ];
  const [status, setStatus] = useState(value[note][id].status);
  useEffect(() => {
    const oscCreate = () => {
      console.log('triggered');
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const compressor = audioContext.createDynamicsCompressor();
      oscillator.type = waves[value.wave];
      oscillator.frequency.value = freq * value.octave;
      compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
      compressor.knee.setValueAtTime(40, audioContext.currentTime);
      compressor.ratio.setValueAtTime(12, audioContext.currentTime);
      compressor.attack.setValueAtTime(0, audioContext.currentTime);
      compressor.release.setValueAtTime(0.25, audioContext.currentTime);

      // gainNode.gain.setValueAtTime(value.volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, now + value.release);
      // gainNode.gain.linearRampToValueAtTime(0, now - value.release);

      gainNode.gain.value = value.volume;
      oscillator.connect(gainNode)
        .connect(compressor)
        .connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + value.release);
    };
    if (status && (id === value.currentStep) && value.play) {
      return oscCreate();
    }
  }, [value.currentStep]);


  const clickHandler = (e) => {
    e.preventDefault();
    setStatus(!status);
    dispatch({
      type: 'ACTION_TOGGLE_NOTE',
      status,
    });
  };
  const on = <ButtonOn type="submit" value="on" onClick={(e) => clickHandler(e)} />;

  const off = (
    <ButtonOff type="submit" value="off" onClick={(e) => clickHandler(e)} />
  );

  const button = status ? on : off;

  return (
    <>
      { button }
    </>
  );
};


export default SingleNote;