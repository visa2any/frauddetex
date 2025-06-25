/**
 * Behavioral Biometrics Capture System
 * Captura padrões comportamentais do usuário para análise de fraude
 */

export interface MouseMetrics {
  x: number;
  y: number;
  timestamp: number;
  velocity: number;
  acceleration: number;
  angle: number;
}

export interface KeystrokeMetrics {
  key: string;
  timestamp: number;
  dwellTime: number;
  flightTime: number;
  pressure?: number;
}

export interface TouchMetrics {
  x: number;
  y: number;
  pressure: number;
  area: number;
  timestamp: number;
  angle?: number;
}

export interface ScrollMetrics {
  deltaX: number;
  deltaY: number;
  timestamp: number;
  velocity: number;
  direction: string;
}

export interface FocusMetrics {
  element: string;
  timestamp: number;
  duration: number;
  previousElement?: string;
}

export interface BehavioralMetrics {
  mouse: MouseMetrics[];
  keyboard: KeystrokeMetrics[];
  touch: TouchMetrics[];
  scroll: ScrollMetrics[];
  focus: FocusMetrics[];
  session: {
    startTime: number;
    userAgent: string;
    screen: {
      width: number;
      height: number;
      pixelRatio: number;
    };
    timezone: string;
    language: string;
  };
}

export interface BehavioralProfile {
  mouseVelocityStats: StatisticalProfile;
  keystrokeRhythm: KeystrokeProfile;
  touchPressure: TouchProfile;
  scrollBehavior: ScrollProfile;
  focusPattern: FocusProfile;
  anomalyScore: number;
  confidence: number;
  uniqueFingerprint: string;
}

interface StatisticalProfile {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  percentiles: {
    p25: number;
    p75: number;
    p95: number;
  };
}

interface KeystrokeProfile {
  averageDwellTime: number;
  averageFlightTime: number;
  rhythm: number[];
  consistency: number;
  handedness: 'left' | 'right' | 'ambidextrous';
}

interface TouchProfile {
  averagePressure: number;
  averageArea: number;
  consistencyScore: number;
  deviceType: 'phone' | 'tablet' | 'unknown';
}

interface ScrollProfile {
  preferredDirection: 'vertical' | 'horizontal' | 'mixed';
  averageVelocity: number;
  smoothness: number;
  acceleration: number;
}

interface FocusProfile {
  averageElementTime: number;
  navigationPattern: string;
  multitaskingScore: number;
}

export class BehavioralCapture {
  private metrics: BehavioralMetrics;
  private isCapturing: boolean = false;
  private previousMouse: MouseMetrics | null = null;
  private previousKeydown: number = 0;
  private mouseTrail: HTMLElement[] = [];

  constructor() {
    this.metrics = {
      mouse: [],
      keyboard: [],
      touch: [],
      scroll: [],
      focus: [],
      session: {
        startTime: Date.now(),
        userAgent: navigator.userAgent,
        screen: {
          width: screen.width,
          height: screen.height,
          pixelRatio: window.devicePixelRatio
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      }
    };
  }

  startCapture(): void {
    if (this.isCapturing) return;
    
    this.isCapturing = true;
    this.attachEventListeners();
    console.log('🎯 Behavioral biometrics capture started');
  }

  stopCapture(): void {
    this.isCapturing = false;
    this.removeEventListeners();
    this.cleanupMouseTrail();
    console.log('⏹️ Behavioral biometrics capture stopped');
  }

  private attachEventListeners(): void {
    // Mouse dynamics
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('click', this.handleMouseClick.bind(this));

    // Keyboard dynamics
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    // Touch dynamics (mobile)
    document.addEventListener('touchstart', this.handleTouchStart.bind(this));
    document.addEventListener('touchmove', this.handleTouchMove.bind(this));
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));

    // Scroll behavior
    document.addEventListener('scroll', this.handleScroll.bind(this));
    document.addEventListener('wheel', this.handleWheel.bind(this));

    // Focus patterns
    document.addEventListener('focus', this.handleFocus.bind(this), true);
    document.addEventListener('blur', this.handleBlur.bind(this), true);

    // Window events
    window.addEventListener('blur', this.handleWindowBlur.bind(this));
    window.addEventListener('focus', this.handleWindowFocus.bind(this));
  }

  private removeEventListeners(): void {
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('click', this.handleMouseClick.bind(this));
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    document.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    document.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    document.removeEventListener('scroll', this.handleScroll.bind(this));
    document.removeEventListener('wheel', this.handleWheel.bind(this));
    document.removeEventListener('focus', this.handleFocus.bind(this), true);
    document.removeEventListener('blur', this.handleBlur.bind(this), true);
    window.removeEventListener('blur', this.handleWindowBlur.bind(this));
    window.removeEventListener('focus', this.handleWindowFocus.bind(this));
  }

  private handleMouseMove(event: MouseEvent): void {
    const timestamp = Date.now();
    const current: MouseMetrics = {
      x: event.clientX,
      y: event.clientY,
      timestamp,
      velocity: 0,
      acceleration: 0,
      angle: 0
    };

    if (this.previousMouse) {
      const deltaTime = timestamp - this.previousMouse.timestamp;
      const deltaX = current.x - this.previousMouse.x;
      const deltaY = current.y - this.previousMouse.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      current.velocity = distance / deltaTime;
      current.acceleration = (current.velocity - this.previousMouse.velocity) / deltaTime;
      current.angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    }

    this.metrics.mouse.push(current);
    this.previousMouse = current;

    // Visual mouse trail for demonstration
    this.createMouseTrail(current.x, current.y);

    // Keep only last 1000 mouse movements
    if (this.metrics.mouse.length > 1000) {
      this.metrics.mouse.shift();
    }
  }

  private handleMouseClick(event: MouseEvent): void {
    // Record click with additional context
    this.metrics.mouse.push({
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
      velocity: 0,
      acceleration: 0,
      angle: 0
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.previousKeydown = Date.now();
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const timestamp = Date.now();
    const dwellTime = timestamp - this.previousKeydown;
    
    const keystroke: KeystrokeMetrics = {
      key: event.code,
      timestamp,
      dwellTime,
      flightTime: 0, // Will be calculated on next keydown
      pressure: (event as any).pressure || 0
    };

    // Calculate flight time if there's a previous keystroke
    if (this.metrics.keyboard.length > 0) {
      const previous = this.metrics.keyboard[this.metrics.keyboard.length - 1];
      keystroke.flightTime = this.previousKeydown - previous.timestamp;
    }

    this.metrics.keyboard.push(keystroke);

    // Keep only last 200 keystrokes
    if (this.metrics.keyboard.length > 200) {
      this.metrics.keyboard.shift();
    }
  }

  private handleTouchStart(event: TouchEvent): void {
    Array.from(event.touches).forEach(touch => {
      this.metrics.touch.push({
        x: touch.clientX,
        y: touch.clientY,
        pressure: touch.force || 0,
        area: this.calculateTouchArea(touch),
        timestamp: Date.now(),
        angle: touch.rotationAngle || 0
      });
    });
  }

  private handleTouchMove(event: TouchEvent): void {
    Array.from(event.touches).forEach(touch => {
      this.metrics.touch.push({
        x: touch.clientX,
        y: touch.clientY,
        pressure: touch.force || 0,
        area: this.calculateTouchArea(touch),
        timestamp: Date.now(),
        angle: touch.rotationAngle || 0
      });
    });
  }

  private handleTouchEnd(event: TouchEvent): void {
    // Touch end events
  }

  private handleScroll(event: Event): void {
    this.metrics.scroll.push({
      deltaX: 0,
      deltaY: window.scrollY,
      timestamp: Date.now(),
      velocity: 0,
      direction: 'vertical'
    });
  }

  private handleWheel(event: WheelEvent): void {
    const scroll: ScrollMetrics = {
      deltaX: event.deltaX,
      deltaY: event.deltaY,
      timestamp: Date.now(),
      velocity: Math.sqrt(event.deltaX * event.deltaX + event.deltaY * event.deltaY),
      direction: Math.abs(event.deltaX) > Math.abs(event.deltaY) ? 'horizontal' : 'vertical'
    };

    this.metrics.scroll.push(scroll);

    // Keep only last 100 scroll events
    if (this.metrics.scroll.length > 100) {
      this.metrics.scroll.shift();
    }
  }

  private handleFocus(event: FocusEvent): void {
    const element = (event.target as HTMLElement)?.tagName || 'unknown';
    this.metrics.focus.push({
      element,
      timestamp: Date.now(),
      duration: 0
    });
  }

  private handleBlur(event: FocusEvent): void {
    if (this.metrics.focus.length > 0) {
      const lastFocus = this.metrics.focus[this.metrics.focus.length - 1];
      lastFocus.duration = Date.now() - lastFocus.timestamp;
    }
  }

  private handleWindowBlur(): void {
    // User switched tab/window
  }

  private handleWindowFocus(): void {
    // User returned to tab/window
  }

  private calculateTouchArea(touch: Touch): number {
    return Math.PI * (touch.radiusX || 10) * (touch.radiusY || 10);
  }

  private createMouseTrail(x: number, y: number): void {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    
    document.body.appendChild(trail);
    this.mouseTrail.push(trail);

    // Remove after animation
    setTimeout(() => {
      if (trail.parentNode) {
        trail.parentNode.removeChild(trail);
      }
      const index = this.mouseTrail.indexOf(trail);
      if (index > -1) {
        this.mouseTrail.splice(index, 1);
      }
    }, 500);

    // Keep only last 20 trails
    if (this.mouseTrail.length > 20) {
      const oldTrail = this.mouseTrail.shift();
      if (oldTrail && oldTrail.parentNode) {
        oldTrail.parentNode.removeChild(oldTrail);
      }
    }
  }

  private cleanupMouseTrail(): void {
    this.mouseTrail.forEach(trail => {
      if (trail.parentNode) {
        trail.parentNode.removeChild(trail);
      }
    });
    this.mouseTrail = [];
  }

  async analyzePatterns(): Promise<BehavioralProfile> {
    const mouseStats = this.calculateStatistics(this.metrics.mouse.map(m => m.velocity));
    const keystrokeRhythm = this.analyzeKeystrokePattern();
    const touchPressure = this.analyzeTouchPattern();
    const scrollBehavior = this.analyzeScrollPattern();
    const focusPattern = this.analyzeFocusPattern();
    const anomalyScore = await this.detectAnomalies();
    const fingerprint = await this.generateFingerprint();

    return {
      mouseVelocityStats: mouseStats,
      keystrokeRhythm,
      touchPressure,
      scrollBehavior,
      focusPattern,
      anomalyScore,
      confidence: this.calculateConfidence(),
      uniqueFingerprint: fingerprint
    };
  }

  private calculateStatistics(values: number[]): StatisticalProfile {
    if (values.length === 0) {
      return {
        mean: 0, median: 0, stdDev: 0, min: 0, max: 0,
        percentiles: { p25: 0, p75: 0, p95: 0 }
      };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    
    return {
      mean,
      median: sorted[Math.floor(sorted.length / 2)],
      stdDev: Math.sqrt(variance),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      percentiles: {
        p25: sorted[Math.floor(sorted.length * 0.25)],
        p75: sorted[Math.floor(sorted.length * 0.75)],
        p95: sorted[Math.floor(sorted.length * 0.95)]
      }
    };
  }

  private analyzeKeystrokePattern(): KeystrokeProfile {
    if (this.metrics.keyboard.length === 0) {
      return {
        averageDwellTime: 0,
        averageFlightTime: 0,
        rhythm: [],
        consistency: 0,
        handedness: 'ambidextrous'
      };
    }

    const dwellTimes = this.metrics.keyboard.map(k => k.dwellTime);
    const flightTimes = this.metrics.keyboard.map(k => k.flightTime);
    
    return {
      averageDwellTime: dwellTimes.reduce((a, b) => a + b, 0) / dwellTimes.length,
      averageFlightTime: flightTimes.reduce((a, b) => a + b, 0) / flightTimes.length,
      rhythm: dwellTimes.slice(0, 20), // First 20 keystrokes rhythm
      consistency: this.calculateConsistency(dwellTimes),
      handedness: this.determineHandedness()
    };
  }

  private analyzeTouchPattern(): TouchProfile {
    if (this.metrics.touch.length === 0) {
      return {
        averagePressure: 0,
        averageArea: 0,
        consistencyScore: 0,
        deviceType: 'unknown'
      };
    }

    const pressures = this.metrics.touch.map(t => t.pressure);
    const areas = this.metrics.touch.map(t => t.area);

    return {
      averagePressure: pressures.reduce((a, b) => a + b, 0) / pressures.length,
      averageArea: areas.reduce((a, b) => a + b, 0) / areas.length,
      consistencyScore: this.calculateConsistency(pressures),
      deviceType: this.determineDeviceType()
    };
  }

  private analyzeScrollPattern(): ScrollProfile {
    if (this.metrics.scroll.length === 0) {
      return {
        preferredDirection: 'vertical',
        averageVelocity: 0,
        smoothness: 0,
        acceleration: 0
      };
    }

    const velocities = this.metrics.scroll.map(s => s.velocity);
    const verticalCount = this.metrics.scroll.filter(s => s.direction === 'vertical').length;
    const horizontalCount = this.metrics.scroll.filter(s => s.direction === 'horizontal').length;

    return {
      preferredDirection: verticalCount > horizontalCount ? 'vertical' : 'horizontal',
      averageVelocity: velocities.reduce((a, b) => a + b, 0) / velocities.length,
      smoothness: this.calculateSmoothness(velocities),
      acceleration: this.calculateAcceleration(velocities)
    };
  }

  private analyzeFocusPattern(): FocusProfile {
    if (this.metrics.focus.length === 0) {
      return {
        averageElementTime: 0,
        navigationPattern: 'unknown',
        multitaskingScore: 0
      };
    }

    const durations = this.metrics.focus.map(f => f.duration);
    
    return {
      averageElementTime: durations.reduce((a, b) => a + b, 0) / durations.length,
      navigationPattern: this.identifyNavigationPattern(),
      multitaskingScore: this.calculateMultitaskingScore()
    };
  }

  private async detectAnomalies(): Promise<number> {
    // Simple anomaly detection based on statistical outliers
    let anomalyScore = 0;

    // Check for unusually high mouse velocity
    const mouseVelocities = this.metrics.mouse.map(m => m.velocity);
    const avgVelocity = mouseVelocities.reduce((a, b) => a + b, 0) / mouseVelocities.length;
    if (avgVelocity > 1000) anomalyScore += 20; // Unusually fast mouse movement

    // Check for robotic keystroke patterns
    const dwellTimes = this.metrics.keyboard.map(k => k.dwellTime);
    const keystrokeVariance = this.calculateVariance(dwellTimes);
    if (keystrokeVariance < 100) anomalyScore += 30; // Too consistent (robotic)

    // Check for impossible human behavior
    if (this.metrics.touch.length > 0 && this.metrics.mouse.length > 0) {
      // Simultaneous touch and mouse (possible bot)
      anomalyScore += 15;
    }

    return Math.min(anomalyScore, 100);
  }

  private async generateFingerprint(): Promise<string> {
    const fingerprintData = {
      session: this.metrics.session,
      mousePattern: this.metrics.mouse.slice(0, 10).map(m => 
        `${Math.round(m.velocity * 100)}${Math.round(m.angle)}`
      ).join(''),
      keystrokePattern: this.metrics.keyboard.slice(0, 10).map(k =>
        `${k.dwellTime}${k.flightTime}`
      ).join(''),
      scrollPattern: this.metrics.scroll.slice(0, 5).map(s =>
        `${Math.round(s.velocity)}${s.direction[0]}`
      ).join('')
    };

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(fingerprintData));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private calculateConsistency(values: number[]): number {
    if (values.length === 0) return 0;
    const variance = this.calculateVariance(values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return 100 - Math.min(100, (variance / mean) * 100);
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  }

  private calculateSmoothness(velocities: number[]): number {
    if (velocities.length < 2) return 0;
    let smoothness = 0;
    for (let i = 1; i < velocities.length; i++) {
      smoothness += Math.abs(velocities[i] - velocities[i - 1]);
    }
    return 100 - Math.min(100, smoothness / velocities.length);
  }

  private calculateAcceleration(velocities: number[]): number {
    if (velocities.length < 2) return 0;
    let totalAcceleration = 0;
    for (let i = 1; i < velocities.length; i++) {
      totalAcceleration += Math.abs(velocities[i] - velocities[i - 1]);
    }
    return totalAcceleration / (velocities.length - 1);
  }

  private determineHandedness(): 'left' | 'right' | 'ambidextrous' {
    // Simple heuristic based on common key patterns
    const leftKeys = ['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g'];
    const rightKeys = ['y', 'u', 'i', 'o', 'p', 'h', 'j', 'k', 'l'];
    
    let leftCount = 0;
    let rightCount = 0;

    this.metrics.keyboard.forEach(k => {
      if (leftKeys.some(key => k.key.toLowerCase().includes(key))) leftCount++;
      if (rightKeys.some(key => k.key.toLowerCase().includes(key))) rightCount++;
    });

    if (leftCount > rightCount * 1.2) return 'left';
    if (rightCount > leftCount * 1.2) return 'right';
    return 'ambidextrous';
  }

  private determineDeviceType(): 'phone' | 'tablet' | 'unknown' {
    const screenWidth = this.metrics.session.screen.width;
    if (screenWidth < 480) return 'phone';
    if (screenWidth < 1024) return 'tablet';
    return 'unknown';
  }

  private identifyNavigationPattern(): string {
    const elements = this.metrics.focus.map(f => f.element);
    const uniqueElements = [...new Set(elements)];
    
    if (uniqueElements.length < 3) return 'focused';
    if (uniqueElements.length > elements.length * 0.8) return 'scattered';
    return 'balanced';
  }

  private calculateMultitaskingScore(): number {
    if (this.metrics.focus.length < 2) return 0;
    
    let switches = 0;
    for (let i = 1; i < this.metrics.focus.length; i++) {
      if (this.metrics.focus[i].element !== this.metrics.focus[i - 1].element) {
        switches++;
      }
    }
    
    return Math.min(100, (switches / this.metrics.focus.length) * 100);
  }

  private calculateConfidence(): number {
    let confidence = 0;
    
    // More data points = higher confidence
    if (this.metrics.mouse.length > 50) confidence += 25;
    if (this.metrics.keyboard.length > 20) confidence += 25;
    if (this.metrics.scroll.length > 10) confidence += 20;
    if (this.metrics.focus.length > 5) confidence += 15;
    if (this.metrics.touch.length > 10) confidence += 15;
    
    return Math.min(100, confidence);
  }

  getMetrics(): BehavioralMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      mouse: [],
      keyboard: [],
      touch: [],
      scroll: [],
      focus: [],
      session: {
        startTime: Date.now(),
        userAgent: navigator.userAgent,
        screen: {
          width: screen.width,
          height: screen.height,
          pixelRatio: window.devicePixelRatio
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      }
    };
    this.previousMouse = null;
    this.previousKeydown = 0;
    this.cleanupMouseTrail();
  }
}