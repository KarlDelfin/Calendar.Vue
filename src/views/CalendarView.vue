<template>
  <el-main>
    <el-card class="menuCard">
      <div>
        <el-button @click="this.$router.push('/home')">Back</el-button>
      </div>
      <div class="d-flex justify-content-between mt-3">
        <h4>Calendar</h4>

        <el-button type="primary" @click="openForm('Create Calendar', [])"
          >Create Calendar</el-button
        >
      </div>
      <el-scrollbar height="500px">
        <div v-if="calendars.length == 0">
          <el-empty description="No Data" />
        </div>
        <div v-else>
          <el-collapse accordion>
            <el-collapse-item title="Filter Results" name="1">
              <el-form @submit.prevent="">
                <el-input placeholder="Search Calendar" v-model="searchCalendar" />
                <div class="d-flex justify-content-end mt-2">
                  <el-button @click="clear"> Reset </el-button>
                  <el-button type="primary" @click="viewUsers"> Apply </el-button>
                </div>
              </el-form>
            </el-collapse-item>
          </el-collapse>
          <el-table :data="calendars">
            <el-table-column label="Calendar Name" prop="calendarName" />
            <el-table-column label="Shared User" align="center">
              <template #default="scope">
                <el-button @click="viewUsers(scope.row.calendarId)">View Users</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Operation" align="center">
              <template #default="scope">
                <el-button @click="openForm('Edit Calendar', scope.row)">Edit</el-button>
                <el-button type="danger" @click="deleteCalendar(scope.row.calendarId)"
                  >Delete</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </el-card>
    <el-card class="mt-2">
      <el-pagination
        v-model:current-page="calendarPagination.currentPage"
        v-model:page-size="calendarPagination.elementsPerPage"
        :page-sizes="[5, 10, 25, 50]"
        :total="calendarPagination.totalElements"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="getCalendarByUserId"
        @current-change="getCalendarByUserId"
      />
    </el-card>
  </el-main>

  <el-dialog title="Shared Users" center v-model="dialog.sharedCalendar">
    <el-collapse accordion>
      <el-collapse-item title="Filter Results" name="1">
        <el-form @submit.prevent="">
          <el-input placeholder="Search User" v-model="searchUser" />
          <div class="d-flex justify-content-end mt-2">
            <el-button @click="clear"> Reset </el-button>
            <el-button type="primary" @click="viewUsers(calendarId)"> Apply </el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div v-if="sharedUsers.length == 0">
      <el-empty description="No Data" />
    </div>
    <div v-else>
      <el-table :data="sharedUsers">
        <el-table-column label="Name" prop="">
          <template #default="scope">
            {{ `${scope.row.firstName} ${scope.row.lastName}` }}
          </template>
        </el-table-column>
        <el-table-column label="Email" prop="email" />
        <el-table-column label="Name" prop="">
          <template #default="scope">
            <el-button
              type="primary"
              v-if="searchUser != ''"
              @click="grantUser(scope.row.sharedUserId)"
              >Grant</el-button
            >
            <el-button type="danger" v-else @click="revokeUser(scope.row.sharedCalendarId)"
              >Revoke</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-card class="mt-2">
      <el-pagination
        v-model:current-page="sharedCalendarPagination.currentPage"
        v-model:page-size="sharedCalendarPagination.elementsPerPage"
        :page-sizes="[5, 10, 25, 50]"
        :total="sharedCalendarPagination.totalElements"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="getCalendarByUserId"
        @current-change="getCalendarByUserId"
      />
    </el-card>
  </el-dialog>

  <CalendarForm
    :openForm="dialog.calendarForm"
    :title="title"
    :calendarData="calendarData"
    @close="dialog.calendarForm = false"
    @refresh="getCalendarByUserId(user.userId)"
  />
</template>
<script>
import axios from 'axios'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import CalendarForm from '../components/CalendarForm.vue'
// const api = import.meta.env.VITE_APP_API_URL
const api = 'https://calendar-api-eufwfccudhaebee4.eastasia-01.azurewebsites.net/api'
export default {
  components: { CalendarForm },
  data() {
    return {
      searchUser: '',
      searchCalendar: '',
      title: '',
      calendarId: '',
      calendarData: {},
      dialog: {
        calendarForm: false,
        sharedCalendar: false,
      },

      calendarPagination: {
        currentPage: 1,
        elementsPerPage: 10,
        totalElements: 0,
      },
      sharedCalendarPagination: {
        currentPage: 1,
        elementsPerPage: 10,
        totalElements: 0,
      },

      sharedUsers: [],
      user: {},
      calendars: [],
    }
  },
  methods: {
    grantUser(sharedUserId) {
      ElMessageBox.confirm('Do you want to grant this user?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        // CONFIRM
        .then(() => {
          const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          const payload = {
            sharedUserId: sharedUserId,
            calendarId: this.calendarId,
          }
          axios
            .post(`${api}/SharedCalendar`, payload)
            .then((response) => {
              if (response.data == 'success') {
                loading.close()
                ElMessage.success('User grant successfully')
                this.clear()
              } else {
                ElMessage.error(response.data)
              }
            })
            .catch((e) => {
              loading.close()
              ElMessage.error(e)
            })
        })
        // CANCEL
        .catch(() => {})
    },
    revokeUser(sharedCalendarId) {
      ElMessageBox.confirm('Do you want to revoke this user?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        // CONFIRM
        .then(() => {
          const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          axios
            .delete(`${api}/SharedCalendar/${sharedCalendarId}`)
            .then((response) => {
              if (response.data == 'success') {
                loading.close()
                ElMessage.success('User revoked successfully')
                this.clear()
              } else {
                ElMessage.error(response.data)
              }
            })
            .catch((e) => {
              loading.close()
              ElMessage.error(e)
            })
        })
        // CANCEL
        .catch(() => {})
    },
    clear() {
      console.log('CLEAR')
      this.searchUser = ''
      this.viewUsers(this.calendarId)
    },
    viewUsers(calendarId) {
      this.calendarId = calendarId
      axios
        .get(
          `${api}/SharedCalendar/Calendar/${this.calendarId}?search=${this.searchUser}&currentPage=${this.sharedCalendarPagination.currentPage}&elementsPerPage=${this.sharedCalendarPagination.elementsPerPage}`,
        )
        .then((response) => {
          this.dialog.sharedCalendar = true
          this.sharedUsers = response.data.results
          this.sharedCalendarPagination.totalElements = response.data.totalElements
        })
        .catch((e) => {
          ElMessage.error(e)
        })
    },
    openForm(title, data) {
      this.title = title
      this.dialog.calendarForm = true

      if (title == 'Edit Calendar') {
        this.calendarData = data
      }
    },

    // DELETE CALENDAR
    deleteCalendar(calendarId) {
      ElMessageBox.confirm('Do you want to delete this calendar?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        // CONFIRM
        .then(() => {
          axios
            .delete(`${api}/Calendar/${calendarId}`)
            .then((response) => {
              if (response.data == 'success') {
                ElMessage.success('Calendar deleted successfully')
                this.getCalendarByUserId(this.user.userId)
              } else {
                ElMessage.error(response.data)
              }
            })
            .catch((e) => {
              ElMessage.error(e)
            })
        })
        // CANCEL
        .catch(() => {})
    },
    getCalendarByUserId() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      axios
        .get(
          `${api}/Calendar/User/${this.user.userId}?currentPage=${this.calendarPagination.currentPage}&elementsPerPage=${this.calendarPagination.elementsPerPage}`,
        )
        .then((response) => {
          this.calendars = response.data.results
          this.calendarPagination.totalElements = response.data.totalElements
          loading.close()
        })
        .catch((e) => {
          ElMessage.error(e)
        })
    },
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    if (this.user == null) {
      this.$router.push('/')
    }
    this.getCalendarByUserId(this.user.userId)
  },
}
</script>

<style>
.menuCard {
  min-height: 70vh;
  max-height: calc(92vh - 32px);
  overflow: hidden;
}
</style>
