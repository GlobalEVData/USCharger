<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { Loading } from '@element-plus/icons-vue';

// 异步加载 ElImage 组件
const ElImage = defineAsyncComponent({
    loader: () => import('element-plus').then(module => module.ElImage),
    delay: 20, // 延迟200ms触发loading
    timeout: 30000, // 30秒超时
});

const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' },
    width: { type: [String, Number], default: '60%' },
    containerWidth: { type: [String, Number], default: '80%' },
    containerPadding: { type: [String, Number], default: '16px' },
    fit: { type: String, default: 'contain' },
    borderRadius: { type: String, default: '8px' },
    background: { type: String, default: 'white' },
});

const figureStyle = computed(() => ({
    '--background': props.background,
    '--border-radius': props.borderRadius,
    '--container-padding': typeof props.containerPadding === 'number'
        ? `${props.containerPadding}px`
        : props.containerPadding,
    '--container-width': typeof props.containerWidth === 'number'
        ? `${props.containerWidth}px`
        : props.containerWidth,
    '--image-width': typeof props.width === 'number'
        ? `${props.width}px`
        : props.width,
}));
</script>

<template>
    <figure :style="figureStyle" class="image-wrapper">
        <Suspense>
            <template #default>
                <ElImage :src="src" :alt="alt" :fit="fit" class="image-content" lazy />
            </template>
            <template #fallback>
                <div class="loading-overlay">
                    <div class="loading-spinner">
                        <el-icon class="is-loading" size="50">
                            <Loading />
                        </el-icon>
                        <p>图片加载中...</p>
                    </div>
                </div>
            </template>
        </Suspense>
        <figcaption v-if="caption" class="image-caption">{{ caption }}</figcaption>
    </figure>
</template>

<style scoped>
.image-wrapper {
    position: relative;
    background: var(--background, white);
    border-radius: var(--border-radius, 8px);
    padding: var(--container-padding, 16px);
    transition: all 0.3s ease;
    overflow: hidden;
    width: var(--container-width, 80%);
    max-width: 100%;
    margin: 24px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.image-content {
    width: var(--image-width, 60%);
    max-width: 100%;
    border-radius: var(--border-radius, 8px);
    transition: transform 0.3s ease;
}

.image-content:hover {
    transform: scale(1.02);
}

.image-caption {
    color: var(--vp-c-text-2);
    font-size: 0.9em;
    margin-top: 8px;
    line-height: 1.4;
    width: var(--image-width, 60%);
    max-width: 100%;
    text-align: left;
    word-wrap: break-word;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.loading-spinner {
    text-align: center;
}

.loading-spinner p {
    margin-top: 10px;
    font-size: 16px;
    color: #333;
}
</style>