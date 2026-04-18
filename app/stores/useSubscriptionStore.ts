import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubscriptionStore = defineStore('subscription', () => {
  const planName = ref('Team')
  const isAnnual = ref(true)

  function setSubscription(name: string, annual: boolean) {
    planName.value = name
    isAnnual.value = annual
  }

  return {
    planName,
    isAnnual,
    setSubscription
  }
})
