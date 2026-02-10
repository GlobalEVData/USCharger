<template>
  <div class="intro-section">
    <div class="content-wrapper">
      <h1>
        <span class="highlight">Improved Accessibility and Equity of Public Electric Vehicle Charger System</span>
        <br>
        <span class="subtitle" ref="subtitle">in the United States with Geospatial Disparities</span>
        <p class="watermark">This work is part of the <a class="link" href="https://globalevdata.github.io/">Global EV Data Initiative</a>.</p>
      </h1>
      <div class="links-container">
        <a href="https://globalevdata.github.io/" class="link">Global EV Data Initiative</a>
        <span class="divider">•</span>
        <a href="https://github.com/XanderPENG/global-evcs" class="link">Code</a>
      </div>
      <hr class="decorative-line">
      <div class="intro-text">
        <p>The electric vehicle charging system (EVCS) constitutes a foundational component of both urban mobility and the transportation-energy nexus. Its spatial siting and charger configuration critically shape residents’ accessibility to and availability of charging services. This study investigates the evolution of public EVCS in the United States from 2014 to 2024, with a focus on the trajectory of potential charging accessibility and equity from both population-based and facility-based perspectives, highlighting the interactions between EVCS and population distribution as well as EVCS and facility locations.</p>      </div>
    </div>
    <p class="hint">↓ Scroll down to continue ↓</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const subtitle = ref(null);

onMounted(() => {
  const subtitleElement = subtitle.value;
  const text = subtitleElement.textContent;
  subtitleElement.textContent = '';
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      subtitleElement.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }

  setTimeout(typeWriter, 500);
});
</script>

<style scoped>

.watermark{
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  max-width: 80%;
  margin: 1rem auto;
}

.intro-section {
  padding: 8rem 1.5rem 4rem 1.5rem;
  text-align: center;
  position: relative;
  background: linear-gradient(to bottom, rgba(8, 95, 135, 0.214), transparent);
  overflow: hidden;
}

.intro-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    /* Circuit board lines */
    linear-gradient(to right, rgba(87, 103, 224, 0.282) 1px, transparent 1px) 0 0 / 40px 40px,
    linear-gradient(to bottom, rgba(144, 167, 241, 0.608) 1px, transparent 1px) 0 0 / 40px 40px;
  opacity: 0.3;
  z-index: -1;
  animation: bgMove 1s linear infinite;
}

@keyframes bgMove {
  0% {
    background-position: 0 0, 0 0;
  }
  100% {
    background-position: 40px 40px, 40px 40px;
  }
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.intro-section h1 {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.intro-section .highlight {
  background: linear-gradient(90deg, var(--vp-c-green-2) 0%, var(--vp-c-indigo-1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.intro-section .subtitle {
  display: block;
  font-size: 1.8rem;
  font-weight: 400;
  margin-top: 0.75rem;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
}

.links-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.link {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  text-decoration: underline;
  opacity: 0.8;
  transition: color 0.3s ease, opacity 0.3s ease;
  cursor: pointer;
}

.link:hover {
  opacity: 1;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.divider {
  color: var(--vp-c-text-2);
  opacity: 0.5;
}

.decorative-line {
  width: 80%;
  height: 2px;
  background: linear-gradient(to right, var(--vp-c-green-2), var(--vp-c-indigo-1), transparent);
  border: none;
  margin: 1.5rem auto;
}

.intro-text {
  font-size: 1.5rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  max-width: 80%;
  margin: 1rem 0;
  text-align: left;
}

.intro-section .hint {
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-brand-2);
  letter-spacing: 0.0625rem;
  margin-top: 2.5rem;
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(0.5rem); }
}

@media (max-width: 768px) {
  .intro-section {
    padding: 5rem 1rem 3rem 1rem;
  }

  .intro-section h1 {
    font-size: 2.25rem;
  }

  .intro-section .subtitle {
    font-size: 1.5rem;
  }

  .links-container {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .intro-text {
    font-size: 1rem;
    max-width: 100%;
  }
}
</style>