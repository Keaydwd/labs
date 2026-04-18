<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { name, isLoggedIn, welcomeMessage } = storeToRefs(userStore)

const inputName = ref('')

const handleLogin = () => {
  if (inputName.value) {
    userStore.login(inputName.value)
    inputName.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white max-w-md w-full rounded-2xl shadow border border-gray-200 overflow-hidden">
      <div class="h-1.5 w-full bg-gradient-to-r from-green-500 to-cyan-400"></div>

      <div class="p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          {{ welcomeMessage }}
        </h1>

        <div v-if="!isLoggedIn" class="space-y-4">
          <div>
            <label class="block text-[13px] font-medium text-gray-700 mb-1.5">Ваше ім'я</label>
            <input
              v-model="inputName"
              type="text"
              placeholder="Введіть ваше ім'я"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[15px] focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              @keyup.enter="handleLogin"
            />
          </div>
          <button
            @click="handleLogin"
            class="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-lg text-[15px] shadow-sm transition-colors cursor-pointer"
          >
            Увійти
          </button>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
            <span class="text-green-500 mt-0.5">✦</span>
            <div>
              <p class="text-sm font-bold text-green-900">Успішний вхід</p>
              <p class="text-xs text-green-800 mt-1">Ви зайшли о: <span class="font-semibold">{{ userStore.loginTime }}</span></p>
            </div>
          </div>

          <button
            @click="userStore.logout"
            class="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2.5 rounded-lg text-[15px] shadow-sm transition-colors cursor-pointer"
          >
            Вийти
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
