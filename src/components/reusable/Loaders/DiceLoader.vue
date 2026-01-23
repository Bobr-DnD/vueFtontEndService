<style scoped>
.loader {
  width: 54px;
  height: 54px;
  position: relative;
  border-radius: 6px;
  border-width: 4px;
  border-style: solid;
  border-color: #19191a;
  background-color: #fff;
  background-image: radial-gradient(circle 5px, #19191a 100%, transparent 0),
    radial-gradient(circle 5px, #19191a 100%, transparent 0),
    radial-gradient(circle 5px, #19191a 100%, transparent 0),
    radial-gradient(circle 5px, #19191a 100%, transparent 0),
    radial-gradient(circle 5px, #19191a 100%, transparent 0),
    radial-gradient(circle 5px, #19191a 100%, transparent 0);
  background-repeat: no-repeat;
  animation: move 8s linear infinite, rotate 4s linear infinite;
}

@keyframes rotate {

  0%,
  10% {
    transform: rotate(0deg);
  }

  15%,
  20% {
    transform: rotate(90deg);
  }

  25%,
  30% {
    transform: rotate(180deg);
  }

  35%,
  40% {
    transform: rotate(270deg);
  }

  45%,
  50% {
    transform: rotate(360deg);
  }

  55%,
  60% {
    transform: rotate(270deg);
  }

  65%,
  70% {
    transform: rotate(180deg);
  }

  75%,
  80% {
    transform: rotate(90deg);
  }

  85%,
  90% {
    transform: rotate(0deg);
  }

  95%,
  100% {
    transform: rotate(0deg);
  }
}

@keyframes move {

  0%,
  4.5% {
    background-position: -12px -15px, -12px 0px, -12px 15px, 12px -15px,
      12px 0px, 12px 15px;
  }

  5%,
  12.5% {
    background-position: 0px -15px, -12px 0px, -12px 15px, 34px -15px, 12px 0px,
      12px 15px;
  }

  15%,
  22.5% {
    background-position: 0px -34px, -12px -10px, -12px 12px, 34px -15px,
      12px -10px, 12px 12px;
  }

  25%,
  32.5% {
    background-position: 0px -34px, -12px -34px, -12px 12px, 34px -12px,
      0px -10px, 12px 12px;
  }

  35%,
  42.5% {
    background-position: 0px -34px, -12px -34px, 0px 12px, 34px -12px, 0px -10px,
      34px 12px;
  }

  45%,
  50% {
    background-position: 0px -34px, -12px -34px, 0px 0px, 34px -12px, 0px 0px,
      34px 12px;
  }

  50%,
  57.5% {
    background-position: 0px -34px, -12px -34px, 0px 12px, 34px -12px, 0px -10px,
      34px 12px;
  }

  60%,
  67.5% {
    background-position: 0px -34px, -12px -34px, -12px 12px, 34px -12px,
      0px -10px, 12px 12px;
  }

  70%,
  77.5% {
    background-position: 0px -34px, -12px -10px, -12px 12px, 34px -15px,
      12px -10px, 12px 12px;
  }

  80%,
  87.5% {
    background-position: 0px -15px, -12px 0px, -12px 15px, 34px -15px, 12px 0px,
      12px 15px;
  }

  90%,
  100% {
    background-position: -12px -15px, -12px 0px, -12px 15px, 12px -15px,
      12px 0px, 12px 15px;
  }
}
</style>

<template>
  <div class="loader"></div>
</template>