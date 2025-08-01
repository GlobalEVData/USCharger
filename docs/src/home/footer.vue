<template>
  <footer class="footer">
    <!-- <div class="footer-names">
      Xiong Yang, Zhenhan Peng, Chengxiang Zhuge*,
      Justin Hayse, Chiwing G. Tang, Ruichen Ma, Binru Wei, and Wenzhong Shi*
    </div> -->
    <div class="footer-content">
      <span>
        <a href="https://thetipteam.editorx.io/website/" target="_blank" rel="noopener">The TIP Research Group</a>
        @
        <a href="https://www.polyu.edu.hk/" target="_blank" rel="noopener">HKPolyU</a>
      </span>
    </div>
    <a href="https://globalevdata.github.io/" target="_blank" rel="noopener">
      <img class="footer-logo" :src="logoSrc" alt="Logo" />
    </a>
  </footer>
</template>

<script setup>
import logoSrc from './assets/logo.png'
</script>

<style scoped>
.footer {
  position: relative;
  padding: 32px 0;
  text-align: center;
  font-size: 15px;
}

.footer-names {
  margin-bottom: 8px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.footer-content {
  color: var(--vp-c-text-3);
  font-size: 14px;
  line-height: 1.6;
}

.footer-content a {
  text-decoration: underline;
}

.footer-content a:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  transition: color 0.3s ease;
}

.footer-logo {
  position: absolute;
  left: 16px;
  bottom: 16px;
  width: 80px;
  height: auto;
  opacity: 0.3;
  cursor: pointer;
}

.footer-logo:hover {
  opacity: 1;
}

</style>