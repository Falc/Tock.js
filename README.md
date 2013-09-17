# Tock.js

A nice Javascript count-up/countdown timer.

Based on [Tock](https://github.com/mrchimp/Tock) by Mr Chimp and [an idea by James Edwards](http://www.sitepoint.com/creating-accurate-timers-in-javascript/).

License: [MIT](https://github.com/Falc/Tock.js/blob/master/LICENSE)

## Features

* Pure Javascript, no dependencies.
* Self-correcting time based on the system clock.
* Count-up/countdown.
* Custom intervals and starting times.
* Start, stop, resume and reset.
* Callback functions on every tick and when a countdown reaches zero.

## The problem with setInterval/setTimeout

Javascript's iteration timers using `setInterval()` or `setTimeout()` are not realiable enough. They create a difference between the iterated time and the real time.
That difference can be compensated by using the actual time to adjust the timer.

These examples made by James Edwards illustrates the differences: http://www.sitepoint.com/examples/timeradjust/examples.html

## Usage

**Tock.js** is not a full widget for a website, it is a timer library. You can use it either to display the result on screen or to make things work in the backend.

Let's see an example:

### 1) Some HTML
```html
<span id="time">0</span>
<button id="start">Start</button>
<button id="stop">Stop</button>
<button id="reset">Reset</button>
```

### 2) Tock instance
```js
var timer = new Tock(options);
```

The `options` parameter allows to customize the timer easily. All of them are optional, of course.
```js
var options = {
    countdown: true,
    start_time: 10000
    interval: 15,
    on_tick: onTickFunction,
    on_complete: onCompleteFunction
}
```

#### Options

* **countdown**: *boolean*
  * If true, the timer will count down. Otherwise, it will count up.
  * Default: false.
* **start_time**: *integer*
  * The starting time in milliseconds. This should be set to a number greater than 0 when `countdown` is true.
  * Default: 0.
* **interval**: *integer*
  * The interval in milliseconds. This defines how often the timer will tick.
  * Default: 0.
* **on_tick**: *function*
  * A callback function that will be called on every tick.
  * Default: A mockup function that will suggest to set a real one.
* **on_complete**: *function*
  * A callback function that will be called when a countdown reaches zero.
  * Default: A mockup function that will suggest to set a real one.

#### Methods

* **start()**
  * Starts the timer.
* **stop()**
  * Stops the timer. It is possible to resume the timer calling `start()` again.
* **reset()**
  * Resets the timer to `start_time`.
* **lap(format)**
  * Gets the current time in milliseconds.
  * The `format` parameter is optional, it is passed to the `format()` method.
* **format(time, format)**
  * Returns a `time` (milliseconds) in the specified `format`. (See the [Time Format](#time-format) section)

#### Callback functions: on_tick() and on_complete()

On every tick (every `interval` milliseconds), `on_tick()` will be called.
```js
var options = {
    // some options...
    on_tick: function() {
        $('#time').text(timer.lap());
    }
}
```

When a countdown timer reaches zero, `on_complete()` will be called.
```js
var options = {
    // some options...
    on_complete: function() {
        alert("Countdown complete!");
    }
}
```

### 3) Add some controls

The timer can be controlled easily with some buttons and events.

Start button:
```js
$('#start').on('click', function() {
    timer.start();
});
```

Stop button:
```js
$('#stop').on('click', function() {
    timer.stop();
});
```

Reset button:
```js
$('#start').on('click', function() {
    timer.reset();
});
```

It is possible to set a "lap" button too:
```js
$('#lap').on('click', function() {
    $('#time').append('<br />' + timer.lap());
});
```

## Time Format

The `format(time, format)` method allows to customize the `format` of the given `time` (passed as milliseconds). It will replace the placeholders found in the `format` parameter, with the corresponding time information:

* **{H}**: Hours
* **{h}**: Hours (same as `{H}`)
* **{M}**: Minutes
* **{m}**: Minutes (0 - 59)
* **{S}**: Seconds
* **{s}**: Seconds (0 - 59)
* **{L}**: Milliseconds (Default)
* **{l}**: Milliseconds (0 - 999)

Capital letters are raw values. This means that `{M}` displays the full number of minutes (i.e. 127 minutes), but `{m}` displays only the number of minutes elapsed since the last hour (7 in 127).

Double letters are used to retrieve the time with leading zeros. If `{m}` returns **7**, `{mm}` will return **07**.

Examples:
```php
    Time: 3877012 (1 hour, 4 minutes, 37 seconds and 12 milliseconds)
    '{hh}:{mm}:{ss}.{ll}'        // 01:04:37.012
    '{MM}'                       // 64
    '{SS}.{ll}'                  // 3877.012
    '{MM} min and {ss} s'        // 64 min and 37 s
    '{h}:{m} vs {hh}:{mm}'       // 1:4 vs 01:04
```
