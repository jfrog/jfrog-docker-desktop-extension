import criticalSeverity from './critical.png';
import highSeverity from './high.png';
import mediumSeverity from './medium.png';
import lowSeverity from './low.png';
import { Severity } from '../../types/severity';

export const SeverityIcons = {
  [Severity.Critical]: criticalSeverity,
  [Severity.High]: highSeverity,
  [Severity.Medium]: mediumSeverity,
  [Severity.Low]: lowSeverity,
};
