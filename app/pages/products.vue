<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

useHead({
  title: 'Список продуктів'
})

const { data } = await useFetch('/api/products')

const isAnnual = ref(true)
const subscriptionStore = useSubscriptionStore()
const router = useRouter()

const selectPlan = (name: string) => {
  subscriptionStore.setSubscription(name, isAnnual.value)
  router.push('/checkout')
}

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 83.25,
    annualPrice: 999,
    originalAnnual: 1188,
    savings: 189,
    members: '0',
    memberExtra: '$35/month',
    exports: '10,000',
    exportExtra: '$0.02 each',
    skipTraces: '500',
    skipExtra: '$0.08 each',
  },
  {
    name: 'Team',
    monthlyPrice: 207.50,
    annualPrice: 2490,
    originalAnnual: 2988,
    savings: 498,
    members: '2',
    memberExtra: '$25/month',
    exports: '50,000',
    exportExtra: '$0.01 each',
    skipTraces: '1,000',
    skipExtra: '$0.08 each',
  },
  {
    name: 'Business',
    monthlyPrice: 457.50,
    annualPrice: 5490,
    originalAnnual: 6588,
    savings: 1098,
    members: '6',
    memberExtra: '$20/month',
    exports: '100,000',
    exportExtra: '$0.01 each',
    skipTraces: '2,000',
    skipExtra: '$0.08 each',
  },
]
</script>

<template>
  <div class="bg-gray-50 min-h-screen p-10">
    <div class="flex items-center justify-between mb-8 max-w-5xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900">Start Your 3 Day Free Trial</h1>
      <div class="flex items-center gap-3">
        <span class="text-green-600 text-sm font-medium flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          </svg>
          Save up to 20%
        </span>
        <div class="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
          <button
            :class="isAnnual ? 'bg-white text-black' : 'bg-gray-100 text-gray-400'"
            class="px-4 py-1.5 font-medium transition-colors cursor-pointer"
            @click="isAnnual = true"
          >Annual</button>
          <button
            :class="!isAnnual ? 'bg-white text-black' : 'bg-gray-100 text-gray-400'"
            class="px-4 py-1.5 font-medium transition-colors cursor-pointer"
            @click="isAnnual = false"
          >Monthly</button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <div
        v-for="plan in plans"
        :key="plan.name"
        class="bg-white rounded-2xl shadow border border-gray-200 hover:border-gray-400 transition-colors overflow-hidden"
      >
        <div class="h-1.5 w-full bg-gradient-to-r from-green-500 to-cyan-400"></div>
        <div class="p-6">
          <h2 class="text-lg font-bold text-gray-900">{{ plan.name }} - {{ isAnnual ? 'Annual' : 'Monthly' }}</h2>
          <div class="mt-3 bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1.5 rounded-md inline-block">
            3-days free then:
          </div>
          <div class="mt-3 flex items-baseline">
            <span class="text-4xl font-extrabold text-gray-900">
              ${{ isAnnual ? plan.monthlyPrice.toFixed(2) : (plan.monthlyPrice * 1.2).toFixed(2) }}
            </span>
            <span class="ml-1 text-gray-400 font-medium">/month</span>
          </div>
          <p class="text-gray-400 text-xs mt-1">
            billed yearly at
            <span class="line-through">${{ plan.originalAnnual.toLocaleString() }}</span>
            <span class="text-gray-700 font-semibold ml-1">${{ plan.annualPrice.toLocaleString() }}</span>
          </p>
          <div class="mt-2 bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-1.5 rounded-md inline-block">
            ${{ plan.savings }} in savings
          </div>

          <button
            @click="selectPlan(plan.name)"
            class="mt-4 flex justify-center w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 rounded-lg text-sm transition-all duration-200 hover:brightness-70 active:brightness-75 cursor-pointer"
          >
            Try It Free
          </button>
          <div class="h-px bg-gray-100 my-5"></div>

          <ul class="space-y-3 text-sm">
            <li class="flex gap-2 items-start">
              <span class="text-green-500 mt-0.5">✦</span>
              <div>
                <span class="font-medium text-gray-800">Primary user + {{ plan.members }} free team members</span>
                <div class="text-gray-400 text-xs">(extra team members for {{ plan.memberExtra }})</div>
              </div>
            </li>
            <li class="flex gap-2 items-start">
              <span class="text-green-500 mt-0.5">✦</span>
              <span class="font-medium text-gray-800">Save unlimited properties</span>
            </li>
            <li class="flex gap-2 items-start">
              <span class="text-green-500 mt-0.5">✦</span>
              <div>
                <span class="font-medium text-gray-800"><strong>{{ plan.exports }}</strong> exports</span>
                <div class="text-gray-400 text-xs">(additional exports at {{ plan.exportExtra }})</div>
              </div>
            </li>
            <li class="flex gap-2 items-start">
              <span class="text-green-500 mt-0.5">✦</span>
              <div>
                <span class="font-medium text-gray-800"><strong>{{ plan.skipTraces }}</strong> free skip traces</span>
                <div class="text-gray-400 text-xs">(additional skip tracing at {{ plan.skipExtra }})</div>
              </div>
            </li>
            <li class="flex gap-2 items-start">
              <span class="text-green-500 mt-0.5">✦</span>
              <span class="font-medium text-gray-800">Imports $0.01</span>
            </li>
            <li class="flex gap-2 items-start">
              <span class="text-green-500 mt-0.5">✦</span>
              <span class="font-medium text-gray-800">FREE daily product trainings and support</span>
            </li>
            <li class="flex gap-2 items-start">
              <span class="text-green-500 mt-0.5">✦</span>
              <span class="font-medium text-gray-800">Full suite of next-gen investing tools</span>
            </li>
            <li class="flex gap-2 items-start">
              <span class="text-green-500 mt-0.5">✦</span>
              <span class="font-medium text-gray-800">Industry first AI powered comp tool</span>
            </li>
            <li class="flex gap-2 items-start">
              <span class="text-green-500 mt-0.5">✦</span>
              <span class="font-medium text-gray-800">Includes dedicated support agent</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
