<template>
  <el-header
    v-if="$route.path != '/' && $route.path != '/register' && $route.path != '/forgot-password'"
    class="border"
  >
    <el-menu class="el-menu-demo d-flex justify-content-end" mode="horizontal">
      <el-sub-menu index="2">
        <template #title>Hi! {{ `${user.firstName} ${user.lastName}` }}</template>
        <el-menu-item v-if="user.roleLevel == 1" @click="$router.push('/user')"
          ><i class="bi bi-people me-1"></i> Users</el-menu-item
        >
        <el-menu-item @click="$router.push('/home')"
          ><i class="bi bi-house me-1"></i> Home</el-menu-item
        >
        <el-menu-item @click="logout" class="text-danger"
          ><i class="bi bi-power me-1"></i> Logout</el-menu-item
        >
      </el-sub-menu>
    </el-menu></el-header
  >
  <RouterView />
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      user: {},
    }
  },
  methods: {
    logout() {
      localStorage.clear()
      this.$router.push('/')
      ElMessage.success('You have been logout')
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'))
  },
}
</script>
