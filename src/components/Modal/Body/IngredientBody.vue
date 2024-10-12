<template>
  <DataTable>
    <template v-slot:action-2>
      <div class="flex space-x-2">
        <SearchInput v-model="table.filters.keyword"></SearchInput>
      </div>
    </template>
    <template v-slot:thead>
      <tr>
        <th>Nama</th>
        <th>Jumlah</th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr v-for="(item, index) in table.items" :key="index">
        <td>{{ item.name || "-" }}</td>
        <td class="flex justify-center space-x-2">
          <NumberInput v-model="item.amount" />
          {{ item.unitName }}
        </td>
      </tr>
    </template>
  </DataTable>
</template>

<script setup>
import useCart from "@/stores/useCart";
import { onMounted, ref } from "vue";
import useModal from "@/stores/useModal";
import useToast from "@/stores/useToast";
import SearchInput from "@/components/Input/SearchInput.vue";
import DataTable from "@/components/Table/DataTable.vue";
import NumberInput from "@/components/Input/NumberInput.vue";

const discount = ref(0);

const cart = useCart();
const modal = useModal();
const toast = useToast();

onMounted(() => {
  if (cart.discount > 0) {
    discount.value = cart.discount;
  }
});

const onSubmit = () => {
  cart.discount = discount.value;

  toast.message = "Sukses";
  toast.description = "Diskon berhasil ditambah!";
  toast.type = "SUCCESS";
  toast.trigger();

  modal.close();
};
</script>
