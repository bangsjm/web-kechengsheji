<template>
    <el-card class="fill-card page-card" style="display: flex; flex-direction: column;">
        <template slot="header"><slot name="header"></slot></template>
        <div class="card-body">
            <slot name="body"></slot>
        </div>
    </el-card>
</template>

<style>

.page-card .el-card__header {
    padding-top: 6px;
    padding-bottom: 6px;
}

.page-card .el-card__body{
    overflow: auto; flex: 1;
}
</style>


<style scoped>
.card-body {
    padding: 18px 20px;
}
</style>