'use client';

import React from 'react';
import styles from './PlanetLoader.module.scss';

export function PlanetLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div id="planetTrail1"></div>
        <div id="planetTrail2"></div>
        <div id="planetTrail3"></div>

        <div className="planets">
          <div id="planet"></div>
          <div id="star"></div>

          <div id="starShadow"></div>
          <div id="blackHoleDisk2"></div>
          <div id="blackHole"></div>
          <div id="blackHoleDisk1"></div>
        </div>
      </div>
    </div>
  );
}

export default PlanetLoader;


