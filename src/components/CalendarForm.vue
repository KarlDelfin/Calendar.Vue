<template>
  <!-- START DIALOG -->
  <el-dialog v-model="calendarForm" :title="title" width="500" center :before-close="clear">
    <el-form @submit.prevent="submitForm" label-position="top">
      <el-form-item>
        <el-input v-model="form.calendarName" placeholder="Enter Calendar Name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="d-flex justify-content-end">
        <el-button type="primary" @click="submitForm">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- END DIALOG -->
</template>
<script>
import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
// const api = import.meta.env.VITE_APP_API_URL
// const api = 'https://calendar-api-eufwfccudhaebee4.eastasia-01.azurewebsites.net/api'
export default {
  props: {
    openForm: Boolean,
    title: String,
    calendarData: Object,
  },
  data() {
    return {
      user: {},
      calendarForm: false,
      form: {
        calendarName: '',
      },
      calendarId: '',
    }
  },
  methods: {
    clear() {
      this.$emit('close')
      this.form.calendarName = ''
    },
    submitForm() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      // CREATE CALENDAR
      if (this.title == 'Create Calendar') {
        const payload = {
          userId: this.user.userId,
          calendarName: this.form.calendarName,
        }
        axios
          .post(`${this.api}/Calendar`, payload)
          .then(() => {
            loading.close()
            ElMessage.success('Calendar created successfully')
            this.clear()
            this.$emit('refresh')
          })
          .catch((error) => {
            loading.close()
            ElMessage.error(error.response.data)
          })
        return
      }

      // EDIT CALENDAR
      if (this.title == 'Edit Calendar') {
        const payload = {
          calendarName: this.form.calendarName,
        }
        axios.put(`${this.api}/Calendar/${this.calendarId}`, payload).then(() => {
          loading.close()
          ElMessage.success('Calendar updated successfully')
          this.clear()
        })
        loading.close().catch((error) => {
          loading.close()
          ElMessage.error(error.response.data)
        })
        return
      }
    },
  },
  watch: {
    openForm(val) {
      this.calendarForm = val
    },

    calendarData(val) {
      this.calendarId = val.calendarId
      this.form.calendarName = val.calendarName
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'))
    if (this.user == null) {
      this.$router.push('/')
    }
  },
}
</script>
