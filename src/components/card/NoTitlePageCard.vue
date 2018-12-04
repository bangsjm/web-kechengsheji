<template>
    <el-card class="fill-card no-title-page-card">
        <slot name="notscoll"></slot>
        <div class="scoll" style="flex: 1; overflow: auto;">
            <slot name="scoll"></slot>
        </div>
    </el-card>
</template>

<style>
.no-title-page-card .el-card__body {
    display: flex; flex-direction: column;
}
</style>


<style scoped>
.scoll {
    flex: 1;
}
</style>