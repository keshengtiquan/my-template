<script setup lang="ts">
import {message} from "ant-design-vue";

const onCopy = () => {
  message.success('复制成功')
}
</script>
<template>
  <a-row >
    <a-col :span="19">
      <a-descriptions title="哈尔滨地铁项目" :column="2">
        <a-descriptions-item label="项目全称">
          <a-typography-paragraph :copyable="{ onCopy: onCopy, tooltip: false, }">
            中铁一局集团电务工程有限公司哈尔滨地铁3号线
          </a-typography-paragraph>
        </a-descriptions-item>
        <a-descriptions-item label="项目经理">
          <a-typography-paragraph :copyable="{ onCopy: onCopy, tooltip: false, }">
            高晓斌
          </a-typography-paragraph>
        </a-descriptions-item>
        <a-descriptions-item label="项目地址">
          <a-typography-paragraph :copyable="{ onCopy: onCopy, tooltip: false, }">
            哈尔滨市道里区东湖路副8号
          </a-typography-paragraph>
        </a-descriptions-item>
        <a-descriptions-item label="项目总工">
          <a-typography-paragraph :copyable="{ onCopy: onCopy, tooltip: false, }">
            杨路线
          </a-typography-paragraph>
        </a-descriptions-item>
        <a-descriptions-item label="项目性质">
          <a-typography-paragraph :copyable="{ onCopy: onCopy, tooltip: false, }">
            总承包
          </a-typography-paragraph>
        </a-descriptions-item>
        <a-descriptions-item label="安全总监">
          <a-typography-paragraph :copyable="{ onCopy: onCopy, tooltip: false, }">
            姚强国
          </a-typography-paragraph>
        </a-descriptions-item>
      </a-descriptions>
    </a-col>
    <a-col :span="5">
      <div class="text-right">
        <a-button type="primary">编辑</a-button>
      </div>
      <div class="flex mt-40px">
        <div class="flex flex-col items-end mr-5">
          <p class="text-gray-400 w-full text-center">
           状态
          </p>
          <p class="text-24px">
           未开工
          </p>
        </div>
        <div class="flex flex-col items-end ">
          <p class="text-gray-400 w-full text-center">
           合同金额
          </p>
          <p class="text-24px">
            ￥888,888,888.88
          </p>
        </div>
      </div>
    </a-col>
  </a-row>

</template>
<style scoped>
.ant-typography {
  margin-bottom: 0;
}
</style>