<script setup lang="ts">
    import { onMounted, useTemplateRef } from "vue";
    import Asteroids from "./asteroids";


    const canvas = useTemplateRef<HTMLCanvasElement>("canvasRef");
    let ctx: CanvasRenderingContext2D | null | undefined;

    onMounted(() => {
        ctx = canvas.value?.getContext("2d");

        if (ctx) {
            const asteroids = new Asteroids({
                ctx: ctx
            });

            asteroids.init();
        }
    });
</script>

<template>
    <canvas ref="canvasRef" width="700" height="700" class="game-view"></canvas>
</template>

<style>
.game-view {
    border: solid 1px white;
}
</style>
