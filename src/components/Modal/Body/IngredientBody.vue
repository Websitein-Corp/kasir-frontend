<template>
  <DataTable>
    <template v-slot:action-2>
      <div class="flex space-x-2">
        <SearchInput v-model="ingredient.filters.keyword"></SearchInput>
      </div>
    </template>
    <template v-slot:thead>
      <tr>
        <th>Nama</th>
        <th>Jumlah</th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr v-for="(item, index) in usedIngredients" :key="index">
        <td>{{ item.name || "-" }}</td>
        <td class="flex justify-center items-center space-x-2">
          <NumberInput v-model="item.qty" />
          <div class="w-20 ml-2 text-slate-500">
            {{ item.unitName }}
          </div>
        </td>
      </tr>
    </template>
  </DataTable>
  <div class="flex justify-center pt-4">
    <CustomButton
      size="xl"
      label="Save"
      :icon="Save"
      class="bg-primary-700 hover:bg-primary-800"
      @click="onSubmit"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import useModal from "@/stores/useModal";
import useToast from "@/stores/useToast";
import SearchInput from "@/components/Input/SearchInput.vue";
import DataTable from "@/components/Table/DataTable.vue";
import NumberInput from "@/components/Input/NumberInput.vue";
import axios from "axios";
import useIngredient from "@/stores/useIngredient";
import { Save } from "lucide-vue-next";
import CustomButton from "@/components/Button/CustomButton.vue";
import useAuth from "@/stores/useAuth";

const auth = useAuth();
const modal = useModal();
const toast = useToast();
const ingredient = useIngredient();

let debounce;

const usedIngredients = ref(ingredient.used);
const formattedUsedIngredients = computed(() =>
  usedIngredients.value
    .filter((item) => item.qty > 0)
    .map((item) => {
      return {
        id: item.name,
        amount: item.qty,
      };
    })
);

onMounted(() => {
  filterUsedIngredients();
});

watch(ingredient.filters, () => {
  ingredient.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }
  debounce = setTimeout(() => fetchIngredients(), 500);
});

watch(
  () => ingredient.page.current,
  () => {
    filterUsedIngredients();
  }
);

const filterUsedIngredients = async () => {
  await fetchIngredients();

  usedIngredients.value = ingredient.list.map((item) => {
    if (ingredient.used.includes(item)) {
      item.qty = ingredient.used.find(
        (subItem) => subItem.name === item.name
      ).qty;
    }

    return item;
  });
};

const onSubmit = () => {
  try {
    const response = axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/api/products/set-ingredient`,
      {
        shop_id: auth.shopId,
        sku: ingredient.sku,
        adjust_price: true,
        ingredients: formattedUsedIngredients.value,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    );

    toast.message = "Sukses";
    toast.description = response.data.message;
    toast.type = "SUCCESS";
    toast.trigger();

    modal.close();
  } catch (response) {
    toast.message = "Gagal";
    toast.description = response.data.message;
    toast.type = "FAILED";
    toast.trigger();
  }
};

const fetchIngredients = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/ingredients?shop_id=${auth.shopId}&keyword=${ingredient.filters.keyword}&page=${ingredient.page.current}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    );

    ingredient.list = data.data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        stock: item.stock,
        unitName: item.unit_name,
        price: item.price,
        qty: 0,
      };
    });

    ingredient.page.current = data.meta.current_page;
    ingredient.page.last = data.meta.last_page;
    ingredient.page.per = data.meta.per_page;
    ingredient.page.total = data.meta.total;
  } catch (response) {
    auth.handleUnauthenticated(response);
  }
};
</script>
