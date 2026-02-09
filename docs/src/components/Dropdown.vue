<template>
  <div class="dropdown-wrapper">
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        <h1 class="dropdown-title">
          {{ selectedTitle }}
          <el-icon class="el-icon--right">
            <CaretBottom />
          </el-icon>
        </h1>
      </span>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, key) in options"
            :key="key"
            :command="item"
            :class="{ 'dropdown-item-active': selectedTitle === item.title }"
          >
            <a :href="base + item.url" class="dropdown-link" @click.stop.prevent="selectItem(item)">
              {{ item.title }}
            </a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CaretBottom } from '@element-plus/icons-vue';

// vitepress 中获取 base 并拼接路径
const base = import.meta.env.BASE_URL;

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  defaultKey: {
    type: String,
    required: true,
  },
});

const selectedTitle = ref(props.options[props.defaultKey].title);

// 处理下拉菜单点击事件
const handleCommand = (item) => {
  // 这里可以根据实际情况进行操作，比如跳转页面
  selectedTitle.value = item.title;
  window.location.href = base + item.url;
};
</script>

<style scoped>
/* 容器样式 */
.dropdown-wrapper {
  margin: 1px 0;
  display: inline-block;
  width: 100%;
}

/* 覆盖 Element Plus 样式 */
:deep(.el-dropdown) {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  transition: border-color 0.3s;
  padding: 5px 10px;
}

:deep(.el-dropdown:hover) {
  border-color: var(--vp-c-brand-1);
}

/* 标题样式 */
.dropdown-title {
  display: flex;
  font-size: 1.5em;
  color: var(--vp-c-brand-1);
  font-weight: bold;
  align-items: center;
  justify-content: center;
  margin: 0;
}

:deep(.el-dropdown-link) {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
}

:deep(.el-icon) {
  margin-left: 8px;
  color: var(--vp-c-text-2);
}

/* 下拉菜单 */
:deep(.el-dropdown-menu) {
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
}

/* 菜单项 */
:deep(.el-dropdown-menu__item) {
  padding: 8px 16px;
  transition: background-color 0.2s;
  line-height: 1.5;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: var(--vp-c-default-soft);
}

/* 高亮当前选择的项 */
.dropdown-item-active {
  background-color: var(--vp-c-warning-soft);
  font-weight: 600;
}

.dropdown-link {
  text-decoration: none;
  color: var(--vp-c-text-1);
  display: block;
  width: 100%;
}

.dropdown-link:hover {
  text-decoration: underline;
  color: var(--vp-c-brand-2);
}
</style>