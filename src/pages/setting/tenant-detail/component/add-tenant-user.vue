<script setup lang="ts">
import Modal from '@/components/modal/index.vue'
import { ref } from 'vue';
import UserSelect from '@/components/user-select/index.vue'
import { useRoute } from 'vue-router';
import { addTenantUserAPi } from '@/api/setting/tenant';

const route = useRoute()
const emit = defineEmits(['submit'])
const open = ref(false)
const selectUser = ref<any[]>([])
const showModal = () => {
  open.value = true
}
const submit = async () => {
  const params = {
    tenantId: Number(route.query.tenantId as string),
    userIds: selectUser.value.map(item => item.id)
  }
  const res = await addTenantUserAPi(params)
  if (res.code === 200) {
    close()
    emit('submit')
  }
}

const close = () => {
  selectUser.value = []
  open.value = false
}
defineExpose({ showModal })
</script>
<template>
  <Modal v-model="open" title="添加用户" destroyOnClose width="60%" @ok="submit" @cancel="close">
    <UserSelect v-model="selectUser" :tenant-id="Number(route.query.tenantId as string)" />
  </Modal>
</template>
<style scoped></style>