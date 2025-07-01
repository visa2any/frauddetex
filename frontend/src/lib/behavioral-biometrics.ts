/**
 * 👆 FraudDetex - Enterprise Behavioral Biometrics
 * Advanced behavioral pattern analysis and capture
 */

import type { 
  BehavioralData,
  MouseEvent,
  KeystrokeEvent,
  ScrollEvent
} from '../types';
import { Logger } from './logger';
import { FraudDetectionError, ErrorCode } from './error-handler';

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

const CAPTURE_CONFIG = {
  minCaptureTime: 3000, // Minimum 3 seconds of data
  maxCaptureTime: 300000, // Maximum 5 minutes
  mouseEventBuffer: 1000,
  keystrokeEventBuffer: 500,
  scrollEventBuffer: 200,
  samplingRate: 50, // Sample every 50ms for mouse tracking
  qualityThreshold: 0.6 // Minimum data quality score
} as const;

const BEHAVIORAL_THRESHOLDS = {
  mouseVelocity: {
    low: 50,
    normal: 200,
    high: 500,
    suspicious: 1000
  },
  keystrokeTiming: {
    veryFast: 50,
    fast: 100,
    normal: 200,
    slow: 500
  },
  clickPressure: {
    light: 0.2,
    normal: 0.5,
    heavy: 0.8
  }
} as const;

// ============================================================================
// BEHAVIORAL CAPTURE CLASS
// ============================================================================

export class BehavioralCapture {
  private isCapturing = false;
  private startTime = 0;
  private mouseEvents: MouseEvent[] = [];
  private keystrokeEvents: KeystrokeEvent[] = [];
  private scrollEvents: ScrollEvent[] = [];
  private logger: Logger;
  private eventListeners: Array<() => void> = [];
  private captureTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.logger = new Logger('BehavioralCapture');
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Start capturing behavioral data
   */
  startCapture(): void {
    if (this.isCapturing) {
      this.logger.warn('Behavioral capture already active');
      return;
    }

    try {
      this.isCapturing = true;
      this.startTime = performance.now();
      this.clearEventBuffers();
      this.setupEventListeners();
      this.startCaptureTimer();

      this.logger.info('Behavioral capture started');
    } catch (error) {
      this.logger.error('Failed to start behavioral capture', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new FraudDetectionError(
        'Failed to initialize behavioral biometrics',
        ErrorCode.BIOMETRICS_INIT_FAILED,
        { timestamp: Date.now() }
      );
    }
  }

  /**
   * Stop capturing behavioral data
   */
  stopCapture(): void {
    if (!this.isCapturing) {
      return;
    }

    this.isCapturing = false;
    this.removeEventListeners();
    
    if (this.captureTimer) {
      clearTimeout(this.captureTimer);
      this.captureTimer = null;
    }

    const captureTime = performance.now() - this.startTime;
    this.logger.info('Behavioral capture stopped', {
      captureTimeMs: captureTime,
      mouseEvents: this.mouseEvents.length,
      keystrokeEvents: this.keystrokeEvents.length,
      scrollEvents: this.scrollEvents.length
    });
  }

  /**
   * Analyze captured behavioral patterns
   */
  async analyzePatterns(): Promise<BehavioralData> {
    if (this.isCapturing) {
      this.logger.warn('Analysis requested while capture is active');
    }

    const captureTime = performance.now() - this.startTime;
    
    if (captureTime < CAPTURE_CONFIG.minCaptureTime) {
      throw new FraudDetectionError(
        'Insufficient behavioral data captured',
        ErrorCode.INSUFFICIENT_BIOMETRIC_DATA,
        { timestamp: Date.now() }
      );
    }

    try {
      const analysis = await this.performAnalysis();
      
      this.logger.info('Behavioral analysis completed', {
        captureTimeMs: captureTime,
        overallRiskScore: analysis.overall_risk_score,
        dataQuality: analysis.data_quality
      });

      return analysis;
    } catch (error) {
      this.logger.error('Behavioral analysis failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        captureTimeMs: captureTime
      });

      throw new FraudDetectionError(
        'Behavioral analysis failed',
        ErrorCode.BIOMETRICS_CAPTURE_FAILED,
        { timestamp: Date.now() }
      );
    }
  }

  /**
   * Get current capture status
   */
  getCaptureStatus(): CaptureStatus {
    const captureTime = this.isCapturing ? performance.now() - this.startTime : 0;
    
    return {
      isCapturing: this.isCapturing,
      captureTimeMs: captureTime,
      eventCounts: {
        mouse: this.mouseEvents.length,
        keystroke: this.keystrokeEvents.length,
        scroll: this.scrollEvents.length
      },
      dataQuality: this.calculateDataQuality()
    };
  }

  // ============================================================================
  // EVENT LISTENERS SETUP
  // ============================================================================

  private setupEventListeners(): void {
    // Mouse events
    const mouseHandler = this.throttle(this.handleMouseEvent.bind(this), CAPTURE_CONFIG.samplingRate);
    const clickHandler = this.handleClickEvent.bind(this);
    
    document.addEventListener('mousemove', mouseHandler, { passive: true });
    document.addEventListener('click', clickHandler, { passive: true });
    
    this.eventListeners.push(
      () => document.removeEventListener('mousemove', mouseHandler),
      () => document.removeEventListener('click', clickHandler)
    );

    // Keyboard events
    const keydownHandler = this.handleKeydownEvent.bind(this);
    const keyupHandler = this.handleKeyupEvent.bind(this);
    
    document.addEventListener('keydown', keydownHandler, { passive: true });
    document.addEventListener('keyup', keyupHandler, { passive: true });
    
    this.eventListeners.push(
      () => document.removeEventListener('keydown', keydownHandler),
      () => document.removeEventListener('keyup', keyupHandler)
    );

    // Scroll events
    const scrollHandler = this.throttle(this.handleScrollEvent.bind(this), 100);
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    this.eventListeners.push(
      () => window.removeEventListener('scroll', scrollHandler)
    );

    // Touch events for mobile
    if ('ontouchstart' in window) {
      const touchHandler = this.handleTouchEvent.bind(this);
      
      document.addEventListener('touchstart', touchHandler, { passive: true });
      document.addEventListener('touchmove', touchHandler, { passive: true });
      
      this.eventListeners.push(
        () => document.removeEventListener('touchstart', touchHandler),
        () => document.removeEventListener('touchmove', touchHandler)
      );
    }
  }

  private removeEventListeners(): void {
    this.eventListeners.forEach(removeListener => removeListener());
    this.eventListeners = [];
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  private handleMouseEvent(event: globalThis.MouseEvent): void {
    if (!this.isCapturing) return;

    const mouseEvent: MouseEvent = {
      x: event.clientX,
      y: event.clientY,
      timestamp: performance.now(),
      pressure: this.getMousePressure(event)
    };

    this.addMouseEvent(mouseEvent);
  }

  private handleClickEvent(event: globalThis.MouseEvent): void {
    if (!this.isCapturing) return;

    const mouseEvent: MouseEvent = {
      x: event.clientX,
      y: event.clientY,
      timestamp: performance.now(),
      pressure: this.getMousePressure(event),
      button: event.button
    };

    this.addMouseEvent(mouseEvent);
  }

  private handleKeydownEvent(event: KeyboardEvent): void {
    if (!this.isCapturing) return;

    // Store keydown timestamp for dwell time calculation
    this.storeKeystrokeStart(event.key, performance.now());
  }

  private handleKeyupEvent(event: KeyboardEvent): void {
    if (!this.isCapturing) return;

    const endTime = performance.now();
    const startTime = this.getKeystrokeStart(event.key);
    
    if (startTime) {
      const dwellTime = endTime - startTime;
      const flightTime = this.calculateFlightTime(event.key, endTime);
      
      const keystrokeEvent: KeystrokeEvent = {
        key: this.sanitizeKey(event.key),
        timestamp: endTime,
        dwellTime,
        flightTime
      };

      this.addKeystrokeEvent(keystrokeEvent);
    }
  }

  private handleScrollEvent(event: Event): void {
    if (!this.isCapturing) return;

    const target = event.target as Element;
    const scrollTop = target.scrollTop || window.pageYOffset;
    const scrollLeft = target.scrollLeft || window.pageXOffset;

    const scrollEvent: ScrollEvent = {
      deltaX: scrollLeft - (this.lastScrollX || 0),
      deltaY: scrollTop - (this.lastScrollY || 0),
      timestamp: performance.now(),
      velocity: this.calculateScrollVelocity()
    };

    this.lastScrollX = scrollLeft;
    this.lastScrollY = scrollTop;
    this.addScrollEvent(scrollEvent);
  }

  private handleTouchEvent(event: TouchEvent): void {
    if (!this.isCapturing || event.touches.length === 0) return;

    const touch = event.touches[0];
    const mouseEvent: MouseEvent = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: performance.now(),
      pressure: touch.force || 0.5 // Use touch force if available
    };

    this.addMouseEvent(mouseEvent);
  }

  // ============================================================================
  // EVENT PROCESSING
  // ============================================================================

  private addMouseEvent(event: MouseEvent): void {
    this.mouseEvents.push(event);
    
    // Maintain buffer size
    if (this.mouseEvents.length > CAPTURE_CONFIG.mouseEventBuffer) {
      this.mouseEvents.shift();
    }
  }

  private addKeystrokeEvent(event: KeystrokeEvent): void {
    this.keystrokeEvents.push(event);
    
    // Maintain buffer size
    if (this.keystrokeEvents.length > CAPTURE_CONFIG.keystrokeEventBuffer) {
      this.keystrokeEvents.shift();
    }
  }

  private addScrollEvent(event: ScrollEvent): void {
    this.scrollEvents.push(event);
    
    // Maintain buffer size
    if (this.scrollEvents.length > CAPTURE_CONFIG.scrollEventBuffer) {
      this.scrollEvents.shift();
    }
  }

  // ============================================================================
  // ANALYSIS METHODS
  // ============================================================================

  private async performAnalysis(): Promise<BehavioralData> {
    const captureTime = performance.now() - this.startTime;
    
    // Mouse analysis
    const mouseAnalysis = this.analyzeMouseBehavior();
    
    // Keystroke analysis
    const keystrokeAnalysis = this.analyzeKeystrokeBehavior();
    
    // Scroll analysis
    const scrollAnalysis = this.analyzeScrollBehavior();
    
    // Calculate overall risk score
    const overallRiskScore = this.calculateOverallRiskScore(
      mouseAnalysis,
      keystrokeAnalysis,
      scrollAnalysis
    );
    
    // Calculate data quality
    const dataQuality = this.calculateDataQuality();

    return {
      mouse_velocity_avg: mouseAnalysis.averageVelocity,
      mouse_click_pressure: mouseAnalysis.averagePressure,
      keystroke_dwell_time: keystrokeAnalysis.averageDwellTime,
      typing_rhythm_score: keystrokeAnalysis.rhythmScore,
      scroll_pattern_score: scrollAnalysis.patternScore,
      session_duration: captureTime,
      overall_risk_score: overallRiskScore,
      data_quality: dataQuality,
      captured_at: this.startTime
    };
  }

  private analyzeMouseBehavior(): MouseAnalysis {
    if (this.mouseEvents.length < 2) {
      return {
        averageVelocity: 0,
        averagePressure: 0.5,
        movementPattern: 'insufficient_data',
        riskScore: 0.5
      };
    }

    const velocities: number[] = [];
    const pressures: number[] = [];
    
    for (let i = 1; i < this.mouseEvents.length; i++) {
      const current = this.mouseEvents[i];
      const previous = this.mouseEvents[i - 1];
      
      const distance = Math.sqrt(
        Math.pow(current.x - previous.x, 2) + 
        Math.pow(current.y - previous.y, 2)
      );
      
      const timeDiff = current.timestamp - previous.timestamp;
      const velocity = timeDiff > 0 ? distance / timeDiff : 0;
      
      velocities.push(velocity);
      
      if (current.pressure !== undefined) {
        pressures.push(current.pressure);
      }
    }

    const averageVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    const averagePressure = pressures.length > 0 ? 
      pressures.reduce((a, b) => a + b, 0) / pressures.length : 0.5;

    const movementPattern = this.classifyMovementPattern(velocities);
    const riskScore = this.calculateMouseRiskScore(averageVelocity, averagePressure, movementPattern);

    return {
      averageVelocity,
      averagePressure,
      movementPattern,
      riskScore
    };
  }

  private analyzeKeystrokeBehavior(): KeystrokeAnalysis {
    if (this.keystrokeEvents.length < 2) {
      return {
        averageDwellTime: 0,
        rhythmScore: 0.5,
        typingPattern: 'insufficient_data',
        riskScore: 0.5
      };
    }

    const dwellTimes = this.keystrokeEvents.map(event => event.dwellTime);
    const flightTimes = this.keystrokeEvents
      .map(event => event.flightTime)
      .filter((time): time is number => time !== undefined);

    const averageDwellTime = dwellTimes.reduce((a, b) => a + b, 0) / dwellTimes.length;
    const dwellTimeVariance = this.calculateVariance(dwellTimes);
    
    const rhythmScore = this.calculateTypingRhythm(dwellTimes, flightTimes);
    const typingPattern = this.classifyTypingPattern(averageDwellTime, dwellTimeVariance);
    const riskScore = this.calculateKeystrokeRiskScore(averageDwellTime, rhythmScore);

    return {
      averageDwellTime,
      rhythmScore,
      typingPattern,
      riskScore
    };
  }

  private analyzeScrollBehavior(): ScrollAnalysis {
    if (this.scrollEvents.length < 2) {
      return {
        patternScore: 0.5,
        averageVelocity: 0,
        scrollingPattern: 'insufficient_data',
        riskScore: 0.5
      };
    }

    const velocities = this.scrollEvents.map(event => event.velocity);
    const averageVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    
    const patternScore = this.calculateScrollPattern();
    const scrollingPattern = this.classifyScrollingPattern(averageVelocity, patternScore);
    const riskScore = this.calculateScrollRiskScore(averageVelocity, patternScore);

    return {
      patternScore,
      averageVelocity,
      scrollingPattern,
      riskScore
    };
  }

  // ============================================================================
  // RISK CALCULATION
  // ============================================================================

  private calculateOverallRiskScore(
    mouse: MouseAnalysis,
    keystroke: KeystrokeAnalysis,
    scroll: ScrollAnalysis
  ): number {
    const weights = {
      mouse: 0.4,
      keystroke: 0.4,
      scroll: 0.2
    };

    return Math.min(1, Math.max(0,
      mouse.riskScore * weights.mouse +
      keystroke.riskScore * weights.keystroke +
      scroll.riskScore * weights.scroll
    ));
  }

  private calculateMouseRiskScore(
    averageVelocity: number,
    averagePressure: number,
    pattern: string
  ): number {
    let score = 0.3; // Base score

    // Velocity-based risk
    if (averageVelocity > BEHAVIORAL_THRESHOLDS.mouseVelocity.suspicious) {
      score += 0.4; // Very high velocity (bot-like)
    } else if (averageVelocity < BEHAVIORAL_THRESHOLDS.mouseVelocity.low) {
      score += 0.2; // Very low velocity (unusual)
    }

    // Pressure-based risk
    if (averagePressure === 0 || averagePressure === 1) {
      score += 0.3; // Unusual pressure (potential simulation)
    }

    // Pattern-based risk
    if (pattern === 'linear' || pattern === 'robotic') {
      score += 0.3;
    }

    return Math.min(1, score);
  }

  private calculateKeystrokeRiskScore(averageDwellTime: number, rhythmScore: number): number {
    let score = 0.3; // Base score

    // Dwell time risk
    if (averageDwellTime < BEHAVIORAL_THRESHOLDS.keystrokeTiming.veryFast) {
      score += 0.4; // Too fast (bot-like)
    } else if (averageDwellTime > BEHAVIORAL_THRESHOLDS.keystrokeTiming.slow) {
      score += 0.2; // Too slow (unusual)
    }

    // Rhythm risk
    if (rhythmScore < 0.3 || rhythmScore > 0.9) {
      score += 0.3; // Unusual rhythm pattern
    }

    return Math.min(1, score);
  }

  private calculateScrollRiskScore(averageVelocity: number, patternScore: number): number {
    let score = 0.3; // Base score

    // Velocity-based risk
    if (averageVelocity > 1000) {
      score += 0.3; // Very fast scrolling
    }

    // Pattern-based risk
    if (patternScore < 0.2 || patternScore > 0.9) {
      score += 0.4; // Unusual pattern
    }

    return Math.min(1, score);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private calculateDataQuality(): number {
    const captureTime = performance.now() - this.startTime;
    
    let quality = 0;
    
    // Time quality (0-0.4)
    if (captureTime >= CAPTURE_CONFIG.minCaptureTime) {
      quality += Math.min(0.4, captureTime / (CAPTURE_CONFIG.minCaptureTime * 2));
    }
    
    // Event count quality (0-0.6)
    const mouseQuality = Math.min(0.2, this.mouseEvents.length / 100);
    const keystrokeQuality = Math.min(0.2, this.keystrokeEvents.length / 50);
    const scrollQuality = Math.min(0.2, this.scrollEvents.length / 20);
    
    quality += mouseQuality + keystrokeQuality + scrollQuality;
    
    return Math.min(1, quality);
  }

  private classifyMovementPattern(velocities: number[]): string {
    const variance = this.calculateVariance(velocities);
    const averageVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    
    if (variance < 10 && averageVelocity > 100) {
      return 'linear'; // Consistent high velocity
    } else if (variance < 5) {
      return 'robotic'; // Very consistent velocity
    } else if (variance > 1000) {
      return 'erratic'; // Highly variable
    } else {
      return 'natural'; // Normal human variation
    }
  }

  private classifyTypingPattern(averageDwellTime: number, variance: number): string {
    if (averageDwellTime < 50 && variance < 10) {
      return 'robotic'; // Too consistent and fast
    } else if (averageDwellTime > 300) {
      return 'hunt_and_peck'; // Slow, methodical typing
    } else if (variance < 20) {
      return 'mechanical'; // Very consistent timing
    } else {
      return 'natural'; // Normal human variation
    }
  }

  private classifyScrollingPattern(averageVelocity: number, patternScore: number): string {
    if (averageVelocity > 500 && patternScore > 0.8) {
      return 'robotic'; // Fast and too regular
    } else if (averageVelocity < 10) {
      return 'careful'; // Very slow scrolling
    } else {
      return 'natural'; // Normal scrolling
    }
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  private calculateTypingRhythm(dwellTimes: number[], flightTimes: number[]): number {
    // Calculate rhythm consistency
    const dwellVariance = this.calculateVariance(dwellTimes);
    const flightVariance = flightTimes.length > 0 ? this.calculateVariance(flightTimes) : 0;
    
    // Lower variance indicates more consistent rhythm
    const rhythmConsistency = 1 - Math.min(1, (dwellVariance + flightVariance) / 10000);
    
    return Math.max(0, Math.min(1, rhythmConsistency));
  }

  private calculateScrollPattern(): number {
    if (this.scrollEvents.length < 3) return 0.5;
    
    // Analyze scroll acceleration patterns
    const accelerations: number[] = [];
    
    for (let i = 2; i < this.scrollEvents.length; i++) {
      const curr = this.scrollEvents[i];
      const prev = this.scrollEvents[i - 1];
      const prev2 = this.scrollEvents[i - 2];
      
      const accel1 = curr.velocity - prev.velocity;
      const accel2 = prev.velocity - prev2.velocity;
      
      accelerations.push(Math.abs(accel1 - accel2));
    }
    
    const averageAcceleration = accelerations.reduce((a, b) => a + b, 0) / accelerations.length;
    
    // Lower acceleration variance indicates more natural scrolling
    return Math.max(0, Math.min(1, 1 - (averageAcceleration / 100)));
  }

  // Helper methods for event processing
  private lastScrollX = 0;
  private lastScrollY = 0;
  private keystrokeStarts = new Map<string, number>();
  private lastKeystrokeTime = 0;

  private getMousePressure(event: globalThis.MouseEvent): number {
    // Simulated pressure based on button and event type
    if ('pressure' in event && typeof (event as any).pressure === 'number') {
      return (event as any).pressure;
    }
    
    // Default pressure simulation
    return event.type === 'click' ? 0.8 : 0.3;
  }

  private storeKeystrokeStart(key: string, timestamp: number): void {
    this.keystrokeStarts.set(key, timestamp);
  }

  private getKeystrokeStart(key: string): number | undefined {
    const startTime = this.keystrokeStarts.get(key);
    this.keystrokeStarts.delete(key);
    return startTime;
  }

  private calculateFlightTime(key: string, endTime: number): number | undefined {
    if (this.lastKeystrokeTime > 0) {
      const flightTime = endTime - this.lastKeystrokeTime;
      this.lastKeystrokeTime = endTime;
      return flightTime;
    }
    
    this.lastKeystrokeTime = endTime;
    return undefined;
  }

  private calculateScrollVelocity(): number {
    if (this.scrollEvents.length < 2) return 0;
    
    const current = this.scrollEvents[this.scrollEvents.length - 1];
    const previous = this.scrollEvents[this.scrollEvents.length - 2];
    
    const deltaTime = current.timestamp - previous.timestamp;
    const deltaDistance = Math.sqrt(
      Math.pow(current.deltaX, 2) + Math.pow(current.deltaY, 2)
    );
    
    return deltaTime > 0 ? deltaDistance / deltaTime : 0;
  }

  private sanitizeKey(key: string): string {
    // Remove sensitive key information
    if (key.length === 1 && /[a-zA-Z0-9]/.test(key)) {
      return 'alphanumeric';
    } else if (['Enter', 'Space', 'Backspace', 'Tab', 'Shift', 'Control', 'Alt'].includes(key)) {
      return key;
    } else {
      return 'other';
    }
  }

  private throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  }

  private clearEventBuffers(): void {
    this.mouseEvents = [];
    this.keystrokeEvents = [];
    this.scrollEvents = [];
    this.keystrokeStarts.clear();
    this.lastKeystrokeTime = 0;
    this.lastScrollX = 0;
    this.lastScrollY = 0;
  }

  private startCaptureTimer(): void {
    this.captureTimer = setTimeout(() => {
      this.logger.info('Auto-stopping capture after maximum time');
      this.stopCapture();
    }, CAPTURE_CONFIG.maxCaptureTime);
  }
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface CaptureStatus {
  readonly isCapturing: boolean;
  readonly captureTimeMs: number;
  readonly eventCounts: {
    readonly mouse: number;
    readonly keystroke: number;
    readonly scroll: number;
  };
  readonly dataQuality: number;
}

interface MouseAnalysis {
  readonly averageVelocity: number;
  readonly averagePressure: number;
  readonly movementPattern: string;
  readonly riskScore: number;
}

interface KeystrokeAnalysis {
  readonly averageDwellTime: number;
  readonly rhythmScore: number;
  readonly typingPattern: string;
  readonly riskScore: number;
}

interface ScrollAnalysis {
  readonly patternScore: number;
  readonly averageVelocity: number;
  readonly scrollingPattern: string;
  readonly riskScore: number;
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function createBehavioralCapture(): BehavioralCapture {
  return new BehavioralCapture();
}