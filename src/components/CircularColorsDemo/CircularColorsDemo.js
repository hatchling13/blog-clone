"use client";

import React from 'react';
import clsx from 'clsx';
import {
  Play,
  Pause,
  RotateCcw,
} from 'react-feather';
import { motion } from "framer-motion"

import Card from '@/components/Card';
import VisuallyHidden from '@/components/VisuallyHidden';

import styles from './CircularColorsDemo.module.css';

const COLORS = [
  { label: 'red', value: 'hsl(348deg 100% 60%)' },
  { label: 'yellow', value: 'hsl(50deg 100% 55%)' },
  { label: 'blue', value: 'hsl(235deg 100% 65%)' },
];

function CircularColorsDemo() {
  const id = React.useId();
  
  // idle | playing
  const [status, setStatus] = React.useState('idle')
  const [timeElapsed, setTimeElapsed] = React.useState(0);

  const selectedColor = COLORS[timeElapsed % COLORS.length];

  React.useEffect(() => {
    if (status === 'playing') {
      const timerId = setInterval(() => setTimeElapsed(t => t + 1), 1000);

      return () => {
        clearInterval(timerId)
      }
    }
  }, [status])

  function handleButtonClick() {
    if (status === 'idle') {
      setStatus('playing');
    } else {
      setStatus('idle');
    }
  }

  function handleResetClick() {
    setStatus('idle');
    setTimeElapsed(0);
  }

  return (
    <Card as="section" className={styles.wrapper}>
      <ul className={styles.colorsWrapper}>
        {COLORS.map((color, index) => {
          const isSelected =
            color.value === selectedColor.value;

          return (
            <li              
              className={styles.color}
              key={index}
            >
              {isSelected && (
                <motion.div
                  layoutId="selected"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 40
                  }}
                  className={
                    styles.selectedColorOutline
                  }
                />
              )}
              <div
                className={clsx(
                  styles.colorBox,
                  isSelected &&
                    styles.selectedColorBox
                )}
                style={{
                  backgroundColor: color.value,
                }}
              >
                <VisuallyHidden>
                  {color.label}
                </VisuallyHidden>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.timeWrapper}>
        <dl className={styles.timeDisplay}>
          <dt>Time Elapsed</dt>
          <dd>{timeElapsed}</dd>
        </dl>
        <div className={styles.actions}>
          <button onClick={handleButtonClick}>
            {
              status === "idle" ? (
                <>
                  <Play />
                  <VisuallyHidden>Play</VisuallyHidden>
                </>
              ) : (
                <>
                  <Pause />
                  <VisuallyHidden>Pause</VisuallyHidden>
                </>
              )
            }
          </button>
          <button onClick={handleResetClick}>
            <RotateCcw />
            <VisuallyHidden>Reset</VisuallyHidden>
          </button>
        </div>
      </div>
    </Card>
  );
}

export default CircularColorsDemo;
