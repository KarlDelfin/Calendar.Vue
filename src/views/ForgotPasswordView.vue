<template>
  <div class="d-flex justify-content-center align-items-center background">
    <!-- START FORGOT PASSWORD -->
    <div
      v-if="isVerifyCode == false && isResetPassword == false"
      class="shadow col-sm-4 p-4 rounded bg-white"
    >
      <h2 class="text-center">Forgot Password</h2>
      <el-form class="mt-4" label-position="top" @submit.prevent="sendCode">
        <el-form-item>
          <el-input v-model="email" placeholder="Email" />
        </el-form-item>
      </el-form>
      <div class="d-flex justify-content-end">
        <el-button type="primary" class="w-100" @click="sendCode">Login</el-button>
      </div>
      <div class="d-flex justify-content-center mt-3 mb-2">
        <el-button type="primary" link @click="$router.push('/')">Back to Login</el-button>
      </div>
    </div>
    <!-- END FORGOT PASSWORD -->

    <!-- START VERIFY CODE -->
    <div
      v-if="isVerifyCode == true && isResetPassword == false"
      class="shadow col-sm-4 p-4 rounded bg-white"
    >
      <h2 class="text-center">Verify Code</h2>
      <el-form class="mt-4" label-position="top" @submit.prevent="verifyCode">
        <el-form-item>
          <el-input v-model="code" placeholder="Code" />
        </el-form-item>
      </el-form>
      <div class="d-flex justify-content-end">
        <el-button type="primary" class="w-100" @click="verifyCode">Verify Code</el-button>
      </div>
      <div class="d-flex justify-content-center mt-3 mb-2">
        <el-button type="primary" link @click="$router.push('/')">Back to Login</el-button>
      </div>
    </div>
    <!-- END VERIFY CODE -->

    <!-- START RESET PASSWORD -->
    <div
      v-if="isVerifyCode == false && isResetPassword == true"
      class="shadow col-sm-4 p-4 rounded bg-white"
    >
      <h2 class="text-center">Reset Password</h2>
      <el-form class="mt-4" label-position="top" @submit.prevent="resetPassword">
        <el-form-item>
          <el-input v-model="password" type="password" show-password placeholder="Password" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="confirmPassword"
            type="password"
            show-password
            placeholder="Confirm Password"
          />
        </el-form-item>
      </el-form>
      <div class="d-flex justify-content-end">
        <el-button type="primary" class="w-100" @click="resetPassword">Login</el-button>
      </div>
      <div class="d-flex justify-content-center mt-3 mb-2">
        <el-button type="primary" link @click="$router.push('/')">Back to Login</el-button>
      </div>
    </div>
    <!-- END RESET PASSWORD -->
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
// const api = import.meta.env.VITE_APP_API_URL
const api = 'https://calendar-api-eufwfccudhaebee4.eastasia-01.azurewebsites.net/api'
export default {
  data() {
    return {
      isVerifyCode: false,
      isResetPassword: false,

      email: '',
      code: '',
      password: '',
      confirmPassword: '',
    }
  },
  methods: {
    sendCode() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      if (this.email == '') {
        setTimeout(() => {
          loading.close()
        }, 500),
          ElMessage.error('Please input email address!')
        return
      }
      axios
        .get(`${api}/User/Email/${this.email}`)
        .then((response) => {
          this.email = response.data.email
          this.isVerifyCode = true
          this.isResetPassword = false
          loading.close()
          ElMessage.success('Verification code sent successfully')
        })
        .catch((e) => {
          loading.close()
          ElMessage.error(e)
          this.email = ''
        })
    },
    verifyCode() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      axios
        .get(`${api}/User/Email/${this.email}/VerificationCode/${this.code}`)
        .then((response) => {
          if (this.code != response.data.verificationCode) {
            ElMessage.error('Invalid verification code!')
            loading.close()
            return
          }
          this.isVerifyCode = false
          this.isResetPassword = true
          loading.close()
        })
        .catch((error) => {
          loading.close()
          ElMessage.error(error)
          this.code = ''
        })
    },
    resetPassword() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      if (this.password == '' || this.confirmPassword == '') {
        setTimeout(() => {
          loading.close()
        }, 500),
          ElMessage.error('Please input fields!')
        return
      }
      if (this.password != this.confirmPassword) {
        setTimeout(() => {
          loading.close()
        }, 500),
          ElMessage.error('Password not match!')
        return
      }

      axios
        .put(`${api}/User/Email/${this.email}/Password/${this.password}`)
        .then((response) => {
          if (response.data == 'success') {
            loading.close()

            ElMessage.success('Password reset successfully')
            setTimeout(() => {
              this.$router.push('/')
            }, 500)
          }
        })
        .catch((e) => {
          loading.close()
          ElMessage.error(e)
        })
    },
  },

  mounted() {
    if (localStorage.getItem('user') != null) {
      this.$router.push('/home')
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
