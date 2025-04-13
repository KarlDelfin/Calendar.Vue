<template>
  <div class="d-flex justify-content-center align-items-center background">
    <div class="shadow col-sm-4 p-4 rounded bg-white">
      <h2 class="text-center">Login</h2>
      <el-form class="mt-4" label-position="top" @submit.prevent="login">
        <el-form-item>
          <el-input v-model="form.email" placeholder="Enter Email" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="Enter Password"
          />
        </el-form-item>
      </el-form>
      <div class="d-flex justify-content-end">
        <el-button type="primary" class="w-100" @click="login">Login</el-button>
      </div>
      <div class="d-flex justify-content-center mt-3 mb-2">
        <el-button type="primary" link @click="$router.push('/register')">Register</el-button>
      </div>
      <div class="d-flex justify-content-center mt-3">
        <el-button link @click="$router.push('/forgot-password')">Forgot Password?</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
const api = import.meta.env.VITE_APP_API_URL
export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      const payload = {
        email: this.form.email,
        password: this.form.password,
      }
      axios
        .post(`${api}/User/Login`, payload)
        .then((response) => {
          if (response == null) {
            ElMessage.error('Invalid Email or Password')
            this.form.email = ''
            this.form.password = ''
          } else {
            localStorage.setItem('user', JSON.stringify(response.data))
            window.location.replace('/home')
          }
          loading.close()
        })
        .catch((error) => {
          loading.close()
          this.form.email = ''
          this.form.password = ''
          ElMessage.error(error.response.data)
        })
    },
  },

  mounted() {
    if (localStorage.getItem('user') != null) {
      window.location.replace('/home')
    }
  },
}
</script>

<style>
.background {
  background-image: url('../assets/login.jpg');
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
}
</style>
