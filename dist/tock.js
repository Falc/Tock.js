(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('tock.js', [], function () {
      return (root['Tock.js'] = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Tock.js'] = factory();
  }
}(this, function () {

/**
 * Tock.js
 *
 * A nice and accurate Javascript count-up/countdown timer.
 *
 * Based on:
 * - Tock by Mr Chimp: https://github.com/mrchimp/Tock
 * - An idea by James Edwards: http://www.sitepoint.com/creating-accurate-timers-in-javascript/
 *
 * Authors:
 * - Aitor García (aitor.falc@gmail.com)
 * - Roberto Salicio
 *
 * Version: 2.1.0
 * License: MIT (https://github.com/Falc/Tock.js/blob/master/LICENSE)
 */

// Date.now polyfill for IE<9
Date.now = Date.now || function() {return +new Date();};

var Tock = (function() { // jshint ignore:line
  /**
   * Constructor.
   */
  function Tock(options) {
    options = options || {};

    // Default params
    this.isCountdown = options.countdown || false;
    this.startTime = options.startTime || 0;
    this.interval = options.interval || 10;
    this.onTick = options.onTick || function() {console.warn('Callback function for "onTick" is not defined.');};
    this.onComplete = options.onComplete || function() {console.warn('Callback function for "onComplete" is not defined.');};
    this.onStart = options.onStart || function() {};
    this.onStop = options.onStop || function() {};
    this.onReset = options.onReset || function() {};

    this.isRunning = false;
    this.timeout = null;

    this.stoppedTime = this.startTime;
    this.startedAt = 0;
    this.time = 0;
    this.elapsed = '0.0';
  }

  /**
  * Starts the timer.
  */
  Tock.prototype.start = function() {
    // Don't try to start if it is already running
    if (this.isRunning) {
      return;
    }

    // A countdown that has finished should be reseted before starting again
    if (this.isCountdown && this.stoppedTime <= 0) {
      return;
    }

    var me = this;

    this.startedAt = Date.now();
    this.time = 0;
    this.elapsed = '0.0';
    this.isRunning = true;

    this.timeout = window.setTimeout(
      function() {me.tick();},
      this.interval
    );

    if (typeof this.onStart === 'function') {
      this.onStart();
    }
  };

  /**
   * Stops the timer.
   */
  Tock.prototype.stop = function() {
    // Don't try to stop if it is not running
    if (!this.isRunning) {
      return;
    }

    // Keep the lap time before stopping
    this.stoppedTime = this.lap();
    this.isRunning = false;

    window.clearTimeout(this.timeout);

    if (typeof this.onTick === 'function') {
      this.onTick();
    }

    if (typeof this.onStop === 'function') {
      this.onStop();
    }
  };

  /**
   * Resets the timer.
   */
  Tock.prototype.reset = function() {
    this.isRunning = false;
    window.clearTimeout(this.timeout);
    this.timeout = null;

    this.stoppedTime = this.startTime;
    this.startedAt = 0;
    this.time = 0;
    this.elapsed = '0.0';

    if (typeof this.onTick === 'function') {
      this.onTick();
    }

    if (typeof this.onReset === 'function') {
      this.onReset();
    }
  };

  /**
   * Tick.
   *
   * Called every "this.interval" seconds.
   */
  Tock.prototype.tick = function() {
    var me = this;

    this.time += this.interval;

    this.elapsed = Math.floor(this.time / this.interval) / 10;

    if (Math.round(this.elapsed) === this.elapsed) {
      this.elapsed += '.0';
    }

    var diff = (Date.now() - this.startedAt) - this.time;

    var nextIntervalIn = this.interval - diff;

    if (typeof this.onTick === 'function') {
      this.onTick();
    }

    if (this.isCountdown && (this.stoppedTime - this.time < 0)) {
      this.stoppedTime = 0;
      this.isRunning = false;

      if (typeof this.onComplete === 'function') {
        this.onComplete();
      }
    }

    if (nextIntervalIn <= 0) {
      var missedTicks = Math.floor(Math.abs(nextIntervalIn) / this.interval);
      this.time += missedTicks * this.interval;

      if (this.isRunning) {
        this.tick();
      }

      return;
    }

    if (this.isRunning) {
      this.timeout = window.setTimeout(
        function() {me.tick();},
        nextIntervalIn
      );
    }
  };

  /**
   * Gets the current time in the specified format (default is milliseconds).
   */
  Tock.prototype.lap = function(format) {
    if (!this.isRunning) {
      // Initial status
      if (this.startedAt === 0) {
        return this.format(this.startTime, format);
      }

      return this.format(this.stoppedTime, format);
    }

    if (this.isCountdown) {
      var lapTime = this.stoppedTime - (Date.now() - this.startedAt);
      if (lapTime < 0) {
        lapTime = 0;
      }

      return this.format(lapTime, format);
    }

    return this.format(this.stoppedTime + (Date.now() - this.startedAt), format);
  };

  /**
   * Returns a time (in milliseconds) formatted as specified.
   *
   * The format is passed as a string and can contain placeholders that will be replaced.
   * Double letters are used for leading zeros.
   * Capital letters are raw values.
   *
   * {H}: Hours
   * {h}: Hours (same as H)
   * {M}: Minutes
   * {m}: Minutes (0 - 59)
   * {S}: Seconds
   * {s}: Seconds (0 - 59)
   * {L}: Milliseconds (Default)
   * {l}: Milliseconds (0 - 999)
   *
   * Example: 3877012 (1 hour, 4 minutes, 37 seconds and 12 milliseconds)
   * '{hh}:{mm}:{ss}.{ll}'        => 01:04:37.012
   * '{MM}'                       => 64
   * '{SS}.{ll}'                  => 3877.012
   * '{MM} min and {ss} s'        => 64 min and 37 s
   * '{h}:{m} vs {hh}:{mm}'       => 1:4 vs 01:04
   */
  Tock.prototype.format = function(time, format) {
    if (format === undefined || format === '{L}') {
      return time;
    }

    var formatted = format;

    var info = {};
    var x = time;

    var milliseconds = x % 1000;
    info.L = x.toString();
    info.LL = '000'.substring(0, 3 - x.toString().length) + x.toString();
    info.l = milliseconds.toString();
    info.ll = '000'.substring(0, 3 - milliseconds.toString().length) + milliseconds.toString();

    x = (x - milliseconds) / 1000;
    var seconds = x % 60;
    info.S = x.toString();
    info.SS = '00'.substring(0, 2 - x.toString().length) + x.toString();
    info.s = seconds.toString();
    info.ss = '00'.substring(0, 2 - seconds.toString().length) + seconds.toString();

    x = (x - seconds) / 60;
    var minutes = x % 60;
    info.M = x.toString();
    info.MM = '00'.substring(0, 2 - x.toString().length) + x.toString();
    info.m = minutes.toString();
    info.mm = '00'.substring(0, 2 - minutes.toString().length) + minutes.toString();

    var hours = (x - minutes) / 60;
    info.H = hours.toString();
    info.HH = '00'.substring(0, 2 - hours.toString().length) + hours.toString();
    info.h = info.H;
    info.hh = info.h;

    var letters = ['HH', 'H', 'hh', 'h', 'MM', 'M', 'mm', 'm', 'SS', 'S', 'ss', 's', 'LL', 'L', 'll', 'l'];

    for (var i = letters.length - 1; i >= 0; i--) {
      formatted = formatted.replace(new RegExp('{' + letters[i] + '}', 'g'), info[letters[i]]);
    }

    return formatted;
  };

  return Tock;
}());

return Tock.js;

}));
