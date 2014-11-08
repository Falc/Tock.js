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
 * Version: 1.2
 * License: MIT (https://github.com/Falc/Tock.js/blob/master/LICENSE)
 */
var Tock = function(options) {
  options = options || {};

  // Default params
  this.is_countdown = options.countdown || false;
  this.start_time = options.start_time || 0;
  this.interval = options.interval || 10;
  this.on_tick = options.on_tick || function() {console.warn('Callback function for "on_tick" is not defined.');};
  this.on_complete = options.on_complete || function() {console.warn('Callback function for "on_complete" is not defined.');};

  this.is_running = false;
  this.timeout = null;

  this.stopped_time = this.start_time;
  this.started_at = 0;
  this.time = 0;
  this.elapsed = '0.0';
};

Tock.prototype = {
  /**
   * Starts the timer.
   */
  start: function() {
    // Don't try to start if it is already running
    if (this.is_running) {
      return;
    }

    // A countdown that has finished should be reseted before starting again
    if (this.is_countdown && this.stopped_time <= 0) {
      return;
    }

    var me = this;

    this.started_at = Date.now();
    this.time = 0;
    this.elapsed = '0.0';
    this.is_running = true;

    this.timeout = window.setTimeout(
      function() {me.tick();},
      this.interval
    );
  },

  /**
   * Stops the timer.
   */
  stop: function() {
    // Don't try to stop if it is not running
    if (!this.is_running) {
      return;
    }

    // Keep the lap time before stopping
    this.stopped_time = this.lap();
    this.is_running = false;

    window.clearTimeout(this.timeout);

    this.on_tick();
  },

  /**
   * Resets the timer.
   */
  reset: function() {
    this.is_running = false;
    window.clearTimeout(this.timeout);
    this.timeout = null;

    this.stopped_time = this.start_time;
    this.started_at = 0;
    this.time = 0;
    this.elapsed = '0.0';

    this.on_tick();
  },

  /**
   * Tick.
   *
   * Called every "this.interval" seconds.
   */
  tick: function() {
    var me = this;

    this.time += this.interval;

    this.elapsed = Math.floor(this.time / this.interval ) / 10;

    if (Math.round(this.elapsed) === this.elapsed) {
      this.elapsed += '.0';
    }

    var diff = (Date.now() - this.started_at) - this.time;

    var next_interval_in = this.interval - diff;

    if (typeof this.on_tick === 'function') {
      this.on_tick();
    }

    if (this.is_countdown && (this.stopped_time - this.time < 0)) {
      this.stopped_time = 0;
      this.is_running = false;
      this.on_complete();
    }

    if (next_interval_in <= 0) {
      var missed_ticks = Math.floor(Math.abs(next_interval_in) / this.interval);
      this.time += missed_ticks * this.interval;

      if (this.is_running) {
        this.tick();
      }

      return;
    }

    if (this.is_running) {
      this.timeout = window.setTimeout(
        function() {me.tick();},
        next_interval_in
      );
    }
  },

  /**
   * Gets the current time in the specified format (default is milliseconds).
   */
  lap: function(format) {
    if (!this.is_running) {
      // Initial status
      if (this.started_at === 0) {
        return this.format(this.start_time, format);
      }

      return this.format(this.stopped_time, format);
    }

    if (this.is_countdown) {
      var lap_time = this.stopped_time - (Date.now() - this.started_at);
      if (lap_time < 0) {
        lap_time = 0;
      }

      return this.format(lap_time, format);
    }

    return this.format(this.stopped_time + (Date.now() - this.started_at), format);
  },

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
  format: function(time, format) {
    if (format === undefined || format === '{L}') {
      return time;
    }

    var formatted = format,
        info = {},
        x = time;

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

    var letters = ['HH','H','hh','h','MM','M','mm','m','SS','S','ss','s','LL','L','ll','l'];

    for (var i = letters.length - 1; i >= 0; i--) {
      formatted = formatted.replace(new RegExp('{' + letters[i] + '}', 'g'), info[letters[i]]);
    }

    return formatted;
  }
};
