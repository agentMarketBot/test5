import './style.css'

class CountdownTimer {
  constructor() {
    this.targetDate = null;
    this.intervalId = null;
    this.isRunning = false;
    
    this.elements = {
      targetDatetime: document.getElementById('target-datetime'),
      startButton: document.getElementById('start-countdown'),
      stopButton: document.getElementById('stop-countdown'),
      days: document.getElementById('days'),
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
      message: document.getElementById('message')
    };
    
    this.init();
  }
  
  init() {
    // Set default datetime to 1 hour from now
    const now = new Date();
    const defaultTarget = new Date(now.getTime() + 60 * 60 * 1000);
    this.elements.targetDatetime.value = this.formatDatetimeLocal(defaultTarget);
    
    // Bind event listeners
    this.elements.startButton.addEventListener('click', () => this.start());
    this.elements.stopButton.addEventListener('click', () => this.stop());
    
    // Initialize display
    this.updateDisplay(0, 0, 0, 0);
    this.showMessage('Set a target date and time to start countdown', 'active');
  }
  
  formatDatetimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  start() {
    const targetValue = this.elements.targetDatetime.value;
    
    if (!targetValue) {
      this.showMessage('Please select a target date and time', 'expired');
      return;
    }
    
    this.targetDate = new Date(targetValue);
    const now = new Date();
    
    if (this.targetDate <= now) {
      this.showMessage('Target date must be in the future', 'expired');
      return;
    }
    
    if (this.isRunning) {
      this.stop();
    }
    
    this.isRunning = true;
    this.elements.startButton.textContent = 'Restart';
    this.showMessage('Countdown is running...', 'active');
    
    // Update immediately, then every second
    this.updateCountdown();
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isRunning = false;
    this.elements.startButton.textContent = 'Start Countdown';
    this.showMessage('Countdown stopped', 'active');
  }
  
  updateCountdown() {
    const now = new Date();
    const timeDifference = this.targetDate - now;
    
    if (timeDifference <= 0) {
      this.stop();
      this.updateDisplay(0, 0, 0, 0);
      this.showMessage('🎉 Time\'s up! Countdown finished!', 'expired');
      return;
    }
    
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
    this.updateDisplay(days, hours, minutes, seconds);
  }
  
  updateDisplay(days, hours, minutes, seconds) {
    this.elements.days.textContent = String(days).padStart(2, '0');
    this.elements.hours.textContent = String(hours).padStart(2, '0');
    this.elements.minutes.textContent = String(minutes).padStart(2, '0');
    this.elements.seconds.textContent = String(seconds).padStart(2, '0');
  }
  
  showMessage(text, type = '') {
    this.elements.message.textContent = text;
    this.elements.message.className = `message ${type}`;
  }
}

// Initialize the countdown timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new CountdownTimer();
});