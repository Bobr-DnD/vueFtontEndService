import { runTask } from './src/runTask.js';

const result =
  await runTask(
    `I want to make smth like eqiuped table, where characters can pick perks or weapons for the fight. Moslty I mean that for maing their builds for different situations. So I need help to make nice ui/ux and which logic will be better for backend. I want to make it without needing to rearrange character schema for mongo`
  );

console.log(result);