<template lang="pug">
VContainer
  VRow
    VCol(cols='12')
      h1.text-center 商品管理
    VDivider
    VCol(cols="12")
      VBtn(color="green" @click="openDialog()") 新增商品
    VCol(cols="12")
    VDataTableServer(
      v-model:items-per-page="tableItemsPerPage"
      v-model:sort-by="tableSortBy"
      v-model:page="tablePage"
      :items="tableProducts"
      :headers="tableHeaders"
      :loading="tableLoading"
      :items-length="tableItemsLength"
      :search="tableSearch"
      @update:items-per-page="tableLoadItems"
      @update:sort-by="tableLoadItems"
      @update:page="tableLoadItems"
      hover
    )
      template(#top)
        VTextField(
          label="搜尋" 
          append-icon="mdi-magnify"
          v-model="tableSearch"
          @click:append="tableApplySearch"
          @keydown.enter="tableApplySearch"
          )
      //- #[`item.image`] 解構， #_name__ => 具名插槽
      template(#[`item.image`]="{ item }")
        VImg(:src="item.image" height="50px")
      template(#[`item.sell`]="{ item }")
        VIcon(icon="mdi-check" v-if="item.sell")
      template(#[`item.edit`]="{ item }")
        VBtn(icon="mdi-pencil" variant="text" color="blue" @click="openDialog(item)")
//- persistent 點外面不能關閉視窗
VDialog(v-model="dialog" persistent width="500px")
  VForm(:disabled="isSubmitting" @submit.prevent="submit")
    VCard
      VCardTitle {{ dialogId === '' ? '新增商品' : '編輯商品' }}
      VCardText
        VTextField(
          label="名稱" 
          v-model="name.value.value" 
          :error-messages="name.errorMessage.value"
          )
        VTextField(
          label="價格" 
          type="number" min="0" 
          v-model="price.value.value" 
          :error-messages="price.errorMessage.value"
          )
        VSelect(
          label="分類" 
          :items="categories" 
          v-model="category.value.value" 
          :error-messages="category.errorMessage.value"
          )
        VCheckbox(
          label="上架" 
          v-model="sell.value.value" 
          :error-messages="sell.errorMessage.value"
          )
        VTextarea(
          label="說明" 
          v-model="description.value.value" 
          :error-messages="description.errorMessage.value"
          )
        //- VueFileAgent: https://safrazik.github.io/vue-file-agent/docs/
        //- 綁兩個V-model, accept: 可接受的檔案類型
        VueFileAgent(
          v-model="fileRecords"
          v-model:rawModelValue="rawFileRecords"
          accept="image/jpeg,image/png"
          deletable
          :error-text="{type: '檔案格式不支援', size: '檔案超過 1MB 大小限制'}"
          help-text="選擇檔案或拖曳至此"
          :max-files="1"
          max-size="1MB"
          ref="fileAgent"
          )
      VCardActions
        //- VSpacer 把物件往側邊推
        VSpacer 
        VBtn(color="red" :disabled="isSubmitting" @click="closeDialog") 取消
        VBtn(color="green" type="submit" :loading="isSubmitting") 送出
</template>

<script setup>
import { ref } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const fileAgent = ref(null)

// 表單對話框的開啟狀態
const dialog = ref(false)
// 表單對話框正在編輯的商品ID, 空的話代表是新增商品
const dialogId = ref('')

// 打開編輯對話框
const openDialog = (item) => {
  if (item) {
    dialogId.value = item._id
    name.value.value = item.name
    price.value.value = item.price
    description.value.value = item.description
    category.value.value = item.category
    sell.value.value = item.sell
  } else {
    dialogId.value = ''
  }
  // 當 dialog 的值為 true 時，對話框會顯示出來。
  dialog.value = true
}

// 關閉對話框
const closeDialog = () => {
  // 關閉對話框
  dialog.value = false
  // 重製欄位
  resetForm()
  // 在onmounted之後可以使用元件的function ---not sure
  // .deleteFileRecord() = Removes the fileRecord from the list and triggers delete event
  fileAgent.value.deleteFileRecord()
}

// 分類
const categories = ['衣服', '食品', '3C', '遊戲']
// 表單驗證
const schema = yup.object({
  name: yup.string().required('缺少商品名稱'),
  price: yup.number().typeError('商品價格格式錯誤').required('缺少商品價格').min(0, '商品價格不能小於 0'),
  description: yup.string().required('缺少商品說明'),
  // .test(自訂驗證名稱, 錯誤訊息, 驗證function)
  category: yup.string().required('缺少商品分類').test('isCategory', '商品分類錯誤', value => categories.includes(value)),
  // 上架狀態
  sell: yup.boolean()
})
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    price: 0,
    description: '',
    category: '',
    sell: false
  }
})
const name = useField('name')
const price = useField('price')
const description = useField('description')
const category = useField('category')
const sell = useField('sell')

const fileRecords = ref([]) // 編輯
const rawFileRecords = ref([])

// values = 表單各欄位
const submit = handleSubmit(async (values) => {
  // 如果沒有選擇圖片(fileRecords長度是零) 或是有錯誤的話，return
  if (fileRecords.value[0]?.error) return
  if (dialogId.value === '' && fileRecords.value.length === 0) return
  try {
    // 建立 FormData() 物件
    // 使用 fd.append(欄位, 值) 將資料放進去
    const fd = new FormData()
    for (const key in values) {
      fd.append(key, values[key])
    }

    // 有東西才會push
    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }

    if (dialogId.value === '') {
      // post('網址', 送出的資料, 請求設定)
      await apiAuth.post('/products', fd)
    } else {
      await apiAuth.patch('/products/' + dialogId.value, fd)
    }

    createSnackbar({
      text: dialogId.value === '' ? '新增成功' : '編輯成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
    closeDialog()
    tableApplySearch() // 重新執行查詢
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
  }
})

// VDataTableServer
// 表格每頁幾個
const tableItemsPerPage = ref(10) // 預設一頁有幾個商品
// 表格排序
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' }
])
// 表格頁碼
const tablePage = ref(1)
// 表格商品資料排列
const tableProducts = ref([])
// 表格欄位設定
const tableHeaders = [
  // title: 顯示名稱(thead)
  { title: '圖片', align: 'center', sortable: false, key: 'image' },
  { title: '名稱', align: 'center', sortable: true, key: 'name' },
  { title: '價格', align: 'center', sortable: true, key: 'price' },
  // { title: '說明', align: 'center', sortable: true, key: 'description' },
  { title: '分類', align: 'center', sortable: true, key: 'category' },
  { title: '上架', align: 'center', sortable: true, key: 'sell' },
  { title: '編輯', align: 'center', sortable: false, key: 'edit' }
]
// 表格載入狀態
const tableLoading = ref(true)
// 表格全部資料數
const tableItemsLength = ref(0)
// 表格搜尋文字
const tableSearch = ref('')

// 表格載入資料 => 對後端發請求
const tableLoadItems = async () => {
  tableLoading.value = true
  try {
    // get('網址', 請求設定)
    const { data } = await apiAuth.get('/products/all', {
      // 把query參數直接都打在網址後面
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key ||'createdAt',
        sortOrder: tableSortBy.value[0]?.order === 'asc' ? 1 : -1,
        search: tableSearch.value
      }
    })
    tableProducts.value.splice(0, tableProducts.value.length, ...data.result.data)
    tableItemsLength.value = data.result.total
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
  }
  tableLoading.value = false
}
tableLoadItems()

// 表格套用搜尋
const tableApplySearch = () => {
  // 把頁碼歸零
  tablePage.value = 1
  tableLoadItems()
}
</script>