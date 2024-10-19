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
      <tr v-for="(item, index) in ingredient.updated" :key="index">
        <td>{{ item.name || "-" }}</td>
        <td class="flex justify-center items-center space-x-2">
          <NumberInput
            :model-value="item.qty"
            allow-zero
            @update:model-value="(val) => setIngredientQuantity(item.name, val)"
          />
          <div class="w-20 ml-2 text-slate-500">
            {{ item.unit_name }}
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

const formattedUsedIngredients = computed(() =>
  ingredient.updated
    .filter((item) => item.qty > 0)
    .map((item) => {
      return {
        id: item.name,
        amount: item.qty,
      };
    })
);

onMounted(async () => {
  await fetchAllIngredients();
  await filterAllUsedIngredients();
  await fetchIngredients();
  await filterUsedIngredients();

  console.log("list: ", ingredient.list);
  console.log("used: ", ingredient.used);
  console.log("all: ", ingredient.all);
  console.log("updated: ", ingredient.updated);
  console.log("updatedAll: ", ingredient.updatedAll);
});

watch(ingredient.filters, () => {
  ingredient.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }
  debounce = setTimeout(async () => {
    await fetchIngredients();
    filterUsedIngredients();
  }, 500);
});

watch(
  () => ingredient.page.current,
  async () => {
    await fetchIngredients();
    filterUsedIngredients();
  }
);

const filterAllUsedIngredients = async () => {
  ingredient.updatedAll = ingredient.all.map((item) => {
    const itemOnHold = item;

    if (
      ingredient.used.find(
        (itemToCompare) => itemToCompare.name === itemOnHold.name
      )
    ) {
      itemOnHold.qty = ingredient.used.find(
        (subItem) => subItem.name === itemOnHold.name
      ).qty;
    }

    return itemOnHold;
  });
};

const filterUsedIngredients = () => {
  ingredient.updated = ingredient.list.map((item) => {
    const itemOnHold = item;

    ingredient.updatedAll.map((itemToBeReset) => ({
      ...itemToBeReset,
      qty: 0,
    }));

    if (
      ingredient.updatedAll.find(
        (itemToCompare) =>
          itemToCompare.name === itemOnHold.name && itemToCompare.qty > -1
      )
    ) {
      itemOnHold.qty = ingredient.updatedAll.find(
        (subItem) => subItem.name === itemOnHold.name
      ).qty;
    }

    return itemOnHold;
  });
};

const setIngredientQuantity = (name, qty) => {
  const ingredientIndex = ingredient.updatedAll.indexOf(
    ingredient.updatedAll.find((item) => item.name === name)
  );

  ingredient.updatedAll[ingredientIndex].qty = qty;
  filterUsedIngredients();
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

const fetchAllIngredients = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/ingredients?shop_id=${auth.shopId}&keyword=&page=`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    );

    ingredient.all = data.data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        stock: item.stock,
        unit_name: item.unit_name,
        price: item.price,
        qty: 0,
      };
    });
  } catch (response) {
    auth.handleUnauthenticated(response);
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
        unit_name: item.unit_name,
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
