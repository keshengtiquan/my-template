<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useChangeRouter } from '@/composables/useChangeRouter';
import { getTenantListApi } from '@/api/setting/tenant';
const {changeToProject} = useChangeRouter();
const view = ref('list')
const columns = [
  { title: '项目名称', dataIndex: 'companyName', ellipsis: true },
  { title: '项目经理', dataIndex: 'manager', width: 100 },
  { title: '项目地址', dataIndex: 'projectAddress', ellipsis: true },
  { title: '所属机构', dataIndex: 'companyDept', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 120 },
  { title: '操作', dataIndex: 'actions', width: 80, align: 'center' },
]
const dataSource = ref<any[]>([])
const toggleView = () => {
  view.value = view.value === 'list' ? 'card' : 'list'
}
const onCardSelect = (id: number) => {
  changeToProject(id)
}
onMounted(async () => {
  const res =  await getTenantListApi()
  if(res.code === 200) {
    dataSource.value = res.data.results
    console.log(res.data.results);
    
  }
}) 
</script>
<template>
  <div mb-8px>
    <div class="bg-[var(--bg-page-container)] flex justify-between items-center p-x-20px p-y-15px ">
      <span font-size-16px font-600>项目</span>
      <span font-size-14px text-blue @click="toggleView">切换</span>
    </div>
    <a-card v-show="view === 'list'">
      <a-card-grid v-for="item in dataSource" @click="onCardSelect(item.id)" class="!md:w-1/3 !w-full cursor-pointer">
        <div font-size-18px font-600 truncate>
          {{ item.companyName }}
        </div>
        <div mt-2 h-14 style="color: #00000073;">
          <div truncate>{{ item.TenantInfo?.projectAddress || '' }}</div>
          <div truncate>{{  }}</div>
        </div>
        <div flex justify-between style="color: #00000073;">
          <span>{{ item.TenantInfo?.manager }}</span>
          <span>{{ item.createTime }}</span>
        </div>
      </a-card-grid>
    </a-card>
    <div v-show="view === 'card'" class="bg-[var(--bg-page-container)]">
      <a-table :columns="columns" size="small" :dataSource="dataSource">
        <template #bodyCell="{ column }">
          <template v-if="column.dataIndex === 'actions'">
            <a-space :size="10">
              <TooltipIcon title="进入">
                <SendOutlined class="text-blue" />
              </TooltipIcon>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

  </div>

</template>
<style scoped>
.ant-card .ant-card-grid {
  padding: 15px 24px;
}
</style>