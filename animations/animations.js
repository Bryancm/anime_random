import { Easing } from "react-native";
import Animated from "react-native-reanimated";

const {
  spring,
  cond,
  eq,
  set,
  clockRunning,
  startClock,
  stopClock,
  Clock,
  Value,
  timing,
  block,
} = Animated;

export function runSpring(clock, value, velocity, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    damping: 10,
    mass: 1,
    stiffness: 121.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}

export function runTiming(clock, value, dest, duration) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0), // set the current value of clock
    frameTime: new Value(0),
  };

  const config = {
    duration,
    toValue: new Value(0),
    easing: Easing.linear,
  };

  const timeSyncedWithClock = new Value(0); // flag to track if we need to sync

  return block([
    cond(
      clockRunning(clock),
      // condition to sync the state.time with clock on first invocation
      cond(eq(timeSyncedWithClock, 0), [
        set(state.time, clock),
        set(timeSyncedWithClock, 1), // set flag to not update this value second time
      ]),
      [
        set(timeSyncedWithClock, 0), // reset the flag
        set(state.finished, 0),
        set(state.time, clock), //set the current value of clock
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ]
    ),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
}
