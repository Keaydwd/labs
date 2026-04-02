<script setup>
import { ref, computed } from 'vue'

useHead({
  title: 'Таблиця продуктів',
  script: [
    { src: 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4' },
    { src: 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js' }
  ]
})

const { data } = await useFetch('/api/products')
const products = computed(() => data.value?.products || [])
const search = ref('')
const sortKey = ref('title')
const sortOrder = ref(1)
const page = ref(1)
const itemsPerPage = ref(5)
const selectedIds = ref([])

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value *= -1
  } else {
    sortKey.value = key
    sortOrder.value = 1
  }
}

const processedRows = computed(() => {
  let result = products.value

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
  }

  result = [...result].sort((a, b) => {
    let valA = a[sortKey.value]
    let valB = b[sortKey.value]

    const isEmptyA = valA === null || valA === undefined || valA === ''
    const isEmptyB = valB === null || valB === undefined || valB === ''

    if (isEmptyA && !isEmptyB) return 1
    if (!isEmptyA && isEmptyB) return -1
    if (isEmptyA && isEmptyB) return 0

    if (valA === valB) return 0
    if (valA > valB) return 1 * sortOrder.value
    return -1 * sortOrder.value
  })

  return result
})

const selectAll = computed({
  get: () => processedRows.value.length > 0 && selectedIds.value.length === processedRows.value.length,
  set: (value) => {
    if (value) {
      selectedIds.value = processedRows.value.map(p => p.id)
    } else {
      selectedIds.value = []
    }
  }
})

const isIndeterminate = computed(() => {
  return selectedIds.value.length > 0 && selectedIds.value.length < processedRows.value.length
})

const totalRows = computed(() => processedRows.value.length)
const paginatedRows = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  return processedRows.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => Math.ceil(totalRows.value / itemsPerPage.value))
</script>

<template>
  <div class="bg-[#F9FAFB] min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-7xl bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

      <div class="flex items-center justify-between p-4 border-b border-gray-100">
        <div class="flex items-center gap-4">
          <div class="text-sm font-medium" :class="selectedIds.length > 0 ? 'text-blue-600' : 'text-gray-500'">
            {{ selectedIds.length }} selected
          </div>
          <input v-model="search" type="text" placeholder="Search..." class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500">
        </div>
        <div class="flex items-center gap-6 text-sm text-gray-600">
          <button class="flex items-center gap-2 hover:text-black transition-colors cursor-pointer">
            <iconify-icon icon="lucide:list-filter" class="text-lg"></iconify-icon>
            Sort by
          </button>
          <button class="flex items-center gap-2 hover:text-black transition-colors cursor-pointer">
            <iconify-icon icon="lucide:more-vertical" class="text-lg"></iconify-icon>
            Actions
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
          <tr class="text-[13px] font-medium text-gray-500 border-b border-gray-100">
            <th class="p-4 w-12">
              <div class="flex items-center gap-1">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  :indeterminate="isIndeterminate"
                  class="w-4 h-4 rounded border-gray-300 accent-blue-600 shadow-sm hover:shadow cursor-pointer"
                >
                <iconify-icon icon="lucide:chevron-down" class="text-xs shadow-sm hover:shadow cursor-pointer"></iconify-icon>
              </div>
            </th>
            <th class="p-4 font-medium">Фото</th>
            <th class="p-4 font-medium cursor-pointer hover:text-black" @click="sortBy('title')">Назва</th>
            <th class="p-4 font-medium cursor-pointer hover:text-black hidden sm:table-cell" @click="sortBy('description')">Опис</th>
            <th class="p-4 font-medium cursor-pointer hover:text-black text-right sm:text-left" @click="sortBy('price')">Ціна</th>
            <th class="p-4 font-medium cursor-pointer hover:text-black" @click="sortBy('rating')">Оцінка</th>
            <th class="p-4 font-medium cursor-pointer hover:text-black hidden md:table-cell" @click="sortBy('brand')">Бренд</th>
            <th class="p-4 font-medium cursor-pointer hover:text-black hidden md:table-cell" @click="sortBy('category')">Категорія</th>
            <th class="p-4 w-10"></th>
          </tr>
          </thead>

          <tbody class="text-sm text-gray-900">
          <tr
            v-for="product in paginatedRows"
            :key="product.id"
            :class="['border-b border-gray-50 transition-colors group', selectedIds.includes(product.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50']"
          >
            <td class="p-4">
              <input
                type="checkbox"
                v-model="selectedIds"
                :value="product.id"
                class="shadow-md:bg-gray-50 w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
              >
            </td>

            <td class="p-4">
              <img :src="product.thumbnail" class="w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] object-cover rounded shadow-sm border border-gray-100" />
            </td>

            <td class="p-4 font-medium text-gray-900">
              <span class="truncate max-w-[150px] block" :title="product.title">{{ product.title }}</span>
            </td>

            <td class="p-4 hidden sm:table-cell text-gray-500 truncate max-w-xs" :title="product.description">
              {{ product.description }}
            </td>

            <td class="p-4 text-right sm:text-left font-medium">
              ${{ product.price }}
            </td>

            <td class="p-4 font-semibold" :class="product.rating < 4.5 ? 'text-red-500' : 'text-green-600'">
              {{ product.rating }}
            </td>

            <td class="p-4 hidden md:table-cell text-gray-900 font-medium">
              {{ product.brand || 'No Brand' }}
            </td>

            <td class="p-4 hidden md:table-cell text-gray-500 capitalize">
              {{ product.category }}
            </td>

            <td class="p-4 text-center">
              <button class="p-1 rounded-full hover:bg-gray-200 text-gray-400 group-hover:text-gray-600 transition-colors cursor-pointer">
                <iconify-icon icon="lucide:more-vertical"></iconify-icon>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between p-4 bg-white border-t border-gray-100">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <div class="relative">
            <input
              type="number"
              v-model.number="itemsPerPage"
              min="1"
              class="w-12 h-8 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
            >
          </div>
          <span>of {{ totalRows }} results</span>
        </div>

        <div class="flex gap-2">
          <button
            @click="page > 1 ? page-- : null"
            :class="['w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-colors', page > 1 ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-50 cursor-not-allowed']"
          >&lt;</button>

          <div class="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-700 text-sm font-semibold border border-green-200">
            {{ page }}
          </div>

          <button
            @click="page < totalPages ? page++ : null"
            :class="['w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-colors', page < totalPages ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-50 cursor-not-allowed']"
          >&gt;</button>
        </div>
      </div>

    </div>
  </div>
</template>
