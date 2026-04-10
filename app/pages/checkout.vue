<script setup>
import { ref } from 'vue'

useHead({
  title: 'Оформлення підписки'
})

const route = useRoute()
const planName = route.query.plan || 'Team'
const isAnnual = route.query.annual || 'true'

const { data: plan } = await useFetch(`/api/checkout?plan=${planName}&annual=${isAnnual}`)

const form = ref({
  cardNumber: '',
  expiry: '',
  cvc: '',
  fullName: '',
  address: '',
  agreedToTerms: false
})

const submitSubscription = async () => {
  if (!form.value.agreedToTerms) return

  try {
    const response = await $fetch('/api/subscription/create', {
      method: 'POST',
      body: { ...form.value, plan: plan.value?.name, isAnnual: plan.value?.isAnnual }
    })
    alert('Підписку успішно оформлено!')
    console.log(response)
  } catch (error) {
    console.error('Помилка відправки:', error)
  }
}
</script>

<template>
  <div class="min-h-screen pb-10">

    <div class="w-full bg-[#333333] py-4 text-center">
      <span class="text-white font-bold text-lg">Checkout</span>
    </div>

    <div class="max-w-[1000px] mx-auto px-6 mt-8">

      <NuxtLink to="/" class="text-gray-500 hover:text-gray-800 text-[15px] font-medium transition-colors">
        &lt;&lt; back
      </NuxtLink>

      <h1 class="text-[26px] font-bold text-gray-800 mt-6 mb-2">
        You're Almost In - Start Your 3-Day Free Trial Now!
      </h1>
      <p class="text-[17px] text-gray-600 mb-8">
        Set up your account to gain instant access! You won't be charged if you decide to cancel within 3 days
      </p>

      <div class="flex flex-col md:flex-row gap-8 items-start">

        <div v-if="plan" class="w-full md:w-[348px] shrink-0 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
          <div :class="['min-h-1.5 w-full bg-gradient-to-r', plan.gradient]"></div>

          <div class="px-7 pt-7 pb-8">
            <h2 class="text-[22px] font-bold text-zinc-900 tracking-tight">{{ plan.name }} - {{ plan.billingText }}</h2>

            <div class="inline-block mt-4 bg-zinc-100 text-zinc-500 text-xs font-semibold px-2.5 py-1.5 rounded-md">
              3-days free then:
            </div>

            <div class="mt-4 flex items-baseline">
              <span class="text-4xl font-extrabold tracking-tight text-zinc-900">${{ plan.displayMonthly }}</span>
              <span class="ml-1 text-[15px] font-medium text-zinc-500">/month</span>
            </div>

            <p v-if="plan.isAnnual" class="text-zinc-500 text-[13px] mt-2">
              billed yearly at <span class="line-through">${{ (plan.originalAnnual).toLocaleString() }}</span>
              <span class="text-zinc-700 font-medium">${{ (plan.annualPrice).toLocaleString() }}</span>
            </p>
            <p v-else class="text-zinc-500 text-[13px] mt-2">
              billed monthly
            </p>

            <div v-if="plan.isAnnual" class="mt-2 inline-block bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold px-2.5 py-1 rounded">
              ${{ plan.savings }} in savings
            </div>

            <div class="h-px bg-zinc-100 my-6"></div>

            <ul class="space-y-4">
              <li class="flex gap-3 items-start">
                <span class="text-[#72E184] text-xl shrink-0 mt-0.5">✦</span>
                <div class="text-[13px] leading-tight text-zinc-700">
                  <span class="text-zinc-900 font-bold">Primary user + {{ plan.members }} free team members</span>
                  <div class="text-zinc-400 text-xs mt-1">(extra team members for {{ plan.memberExtra }})</div>
                </div>
              </li>
              <li class="flex gap-3 items-start">
                <span class="text-[#72E184] text-xl shrink-0 mt-0.5">✦</span>
                <span class="text-[13px] text-zinc-900">Save unlimited properties</span>
              </li>
              <li class="flex gap-3 items-start">
                <span class="text-[#72E184] text-xl shrink-0 mt-0.5">✦</span>
                <div class="text-[13px] leading-tight text-zinc-700">
                  <span class="font-bold text-zinc-900">{{ plan.exports }}</span> exports
                  <div class="text-zinc-400 text-xs mt-1">(additional exports at {{ plan.exportExtra }})</div>
                </div>
              </li>
              <li class="flex gap-3 items-start">
                <span class="text-[#72E184] text-xl shrink-0 mt-0.5">✦</span>
                <div class="text-[13px] leading-tight text-zinc-700">
                  <span class="font-bold text-zinc-900">{{ plan.skipTraces }}</span> free skip traces
                  <div class="text-zinc-400 text-xs mt-1">(additional skip tracing at {{ plan.skipExtra }})</div>
                </div>
              </li>
              <li class="flex gap-3 items-start">
                <span class="text-[#72E184] text-xl shrink-0 mt-0.5">✦</span>
                <span class="text-[13px] text-zinc-900">Imports $0.01</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex-1 w-full bg-white border border-gray-200 rounded-xl p-8 shadow-sm">

          <h3 class="text-[17px] font-bold text-gray-900 mb-5">Order Summary</h3>
          <div class="flex justify-between items-center mb-3">
            <span class="text-[15px] text-gray-700">{{ plan?.billingText }} Plan</span>
            <span class="text-[15px] text-gray-900">${{ plan?.totalDue }}</span>
          </div>
          <div class="flex justify-between items-center mb-4">
            <span class="text-[15px] text-gray-700">Total Due <span class="text-xs text-gray-400">(*not including sales tax where applicable)</span></span>
            <span class="text-[15px] text-gray-900">${{ plan?.totalDue }}</span>
          </div>
          <div class="flex justify-between items-center mb-6 pt-1">
            <span class="text-[15px] font-bold text-gray-900">Due Today</span>
            <span class="text-[15px] font-bold text-gray-900">$0.00</span>
          </div>

          <div class="bg-[#F3F4F6] text-center py-3 rounded text-[14px] text-gray-600 font-medium mb-8">
            Includes 3-Day Free Trial
          </div>

          <h3 class="text-[17px] font-bold text-gray-900 mb-4 flex items-center gap-1.5">
            Billing Information
          </h3>

          <form @submit.prevent="submitSubscription">
            <label class="block text-xs text-gray-500 mb-1.5">Card Details</label>
            <div class="flex border border-gray-300 rounded overflow-hidden mb-5">
              <div class="flex-1 flex items-center px-3 border-r border-gray-300 bg-white">
                <input v-model="form.cardNumber" type="text" placeholder="Number" class="w-full py-2.5 outline-none text-[15px] placeholder-gray-400">
              </div>
              <input v-model="form.expiry" type="text" placeholder="MM / YY" class="w-24 px-3 py-2.5 outline-none text-[15px] border-r border-gray-300 placeholder-gray-400 text-center">
              <input v-model="form.cvc" type="text" placeholder="CVC" class="w-20 px-3 py-2.5 outline-none text-[15px] placeholder-gray-400 text-center">
            </div>

            <label class="block text-xs text-gray-500 mb-1.5">Address</label>
            <div class="border border-gray-300 rounded p-4 mb-6 bg-white">
              <label class="block text-[13px] text-gray-600 mb-1.5">Full name</label>
              <input v-model="form.fullName" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-[15px] mb-4 focus:outline-none focus:border-gray-400" placeholder="dev4 dev4">

              <label class="block text-[13px] text-gray-600 mb-1.5">Address</label>
              <textarea v-model="form.address" class="w-full border border-gray-300 rounded px-3 py-2 text-[15px] focus:outline-none focus:border-gray-400 h-[60px] resize-none"></textarea>
            </div>

            <label class="flex items-start gap-3 mb-6 cursor-pointer group">
              <input v-model="form.agreedToTerms" type="checkbox" class="mt-1 border-gray-300 rounded w-4 h-4 cursor-pointer accent-gray-700">
              <span class="text-[12px] text-gray-600 leading-[1.6]">
                I consent to <a href="#" class="font-bold underline text-gray-700 hover:text-black">Terms of Use</a> and understand my 3-day free trial will automatically convert to ${{ plan?.totalDue }} {{ plan?.isAnnual ? 'per year' : 'per month' }}.
              </span>
            </label>

            <button
              type="submit"
              :disabled="!form.agreedToTerms"
              :class="[
                'px-6 py-2.5 rounded font-bold text-[15px] transition-all',
                form.agreedToTerms
                  ? 'bg-gray-800 text-white hover:bg-black shadow-md cursor-pointer'
                  : 'bg-[#E5E5E5] text-gray-500 cursor-not-allowed'
              ]"
            >
              Try It Free
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>
