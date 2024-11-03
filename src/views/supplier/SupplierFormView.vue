<template>
  <PageContainer title="Supplier Detail" subtitle="Daftar supplier yang ada...">
    <!-- Apply a max-height to the form and enable scrolling -->
    <form @submit.prevent="handleSubmit" class="max-h-[95vh] overflow-y-auto">
      <!-- Supplier Detail -->
      <DashboardCard class="form-section">
        <!-- If not editing, show input field for supplier name -->
        <div v-if="!isEdit">
          <TextInput
            v-model="supplierDetail.name"
            name="supplier_name"
            label="Supplier Name"
            placeholder="Enter supplier name"
            required
            class="w-full"
          />
        </div>

        <!-- If editing, show supplier name as static text -->
        <div v-else>
          <p><strong>Supplier:</strong> {{ supplierDetail.name }}</p>
        </div>

        <div class="flex flex-row justify-between space-x-4 mt-4">
          <TextInput
            v-model="supplierDetail.due_date"
            name="due_date"
            type="date"
            label="Tenggat Waktu"
            required
            class="w-1/2"
          />
          <TextInput
            :value="totalPrice"
            v-model="supplierDetail.total_price"
            name="total_price"
            label="Total Harga"
            placeholder="Enter total price"
            readonly
            class="w-1/2"
          />
        </div>

        <CustomButton
          class="w-1/4 mt-4 bg-primary-600"
          @click="updateStatus"
          v-if="isEdit"
        >
          Update Status
        </CustomButton>
      </DashboardCard>

      <!-- Product/Ingredient Detail -->
      <DashboardCard
        v-for="(product, index) in productDetails"
        :key="index"
        class="form-section mt-8"
      >
        <h2>Product/Ingredient Detail</h2>
        <hr />
        <div class="flex flex-row justify-between space-x-4">
          <TextInput
            v-model="product.type"
            name="type"
            label="Type (PRODUCT/INGREDIENT)"
            placeholder="Enter type"
            required
            class="w-1/2"
          />
          <TextInput
            v-model="product.sku"
            name="sku"
            label="SKU"
            placeholder="Enter SKU"
            required
            class="w-1/2"
          />
        </div>
        <div class="flex flex-row justify-between space-x-4">
          <TextInput
            v-model="product.amount"
            name="amount"
            label="Amount"
            type="number"
            placeholder="Enter amount"
            required
            class="w-1/2"
          />
          <TextInput
            v-model="product.capital_price"
            name="capital_price"
            label="Capital Price"
            type="number"
            placeholder="Enter capital price"
            required
            class="w-1/2"
          />
        </div>
      </DashboardCard>

      <div
        class="flex flex-col space-y-4 w-full items-center justify-center mt-8"
      >
        <CustomButton class="w-1/4 bg-primary-600" @click="addProduct">
          Tambah Produk/Ingredient
        </CustomButton>
        <CustomButton class="w-1/4 bg-primary-600" type="submit">
          Submit
        </CustomButton>
        <CustomButton class="w-1/4 bg-red-600" @click="cancelForm">
          Cancel
        </CustomButton>
      </div>
    </form>
  </PageContainer>
</template>

<script setup>
import {
  ref,
  onMounted,
  defineProps,
  defineAsyncComponent,
  defineEmits,
  computed,
} from "vue";
import axios from "axios";
import CustomButton from "@/components/Button/CustomButton.vue";
import DashboardCard from "@/components/Card/DashboardCard.vue";
import useAuth from "@/stores/useAuth";
import PageContainer from "@/views/PageContainer.vue";

const auth = useAuth();

const TextInput = defineAsyncComponent(() =>
  import("@/components/Input/TextInput.vue")
);

const props = defineProps({
  isEdit: Boolean,
  supplierData: Object,
});

const emit = defineEmits(["cancel", "save"]);

const totalPrice = computed(() => {
  return productDetails.value.reduce((sum, product) => {
    // Ensure capital_price is treated as a number
    const price = parseFloat(product.capital_price) || 0;
    return sum + price;
  }, 0);
});

const supplierDetail = ref({
  id: props.supplierData ? props.supplierData.id : "",
  name: props.supplierData ? props.supplierData.name : "",
  due_date: props.supplierData ? props.supplierData.due_date : "",
  total_price: props.supplierData ? props.supplierData.total_price : "",
});

const productDetails = ref([]);

const loadExistingData = () => {
  if (props.isEdit && props.supplierData) {
    productDetails.value = props.supplierData.products.map((product) => ({
      type: product.type,
      sku: product.sku,
      amount: product.amount,
      capital_price: product.capital_price,
    }));
  }
};

const addProduct = () => {
  productDetails.value.push({
    type: "PRODUCT",
    sku: "",
    amount: 0,
    capital_price: 0,
  });
};

const handleSubmit = async () => {
  try {
    const requestBody = {
      shop_id: auth.shopId,
      supplier: supplierDetail.value.name,
      supply_id: supplierDetail.value.id ?? 0,
      due_date: supplierDetail.value.due_date,
      data: productDetails.value.map((product) => ({
        type: product.type,
        sku: product.sku,
        capital_price: product.capital_price,
        amount: product.amount,
      })),
    };

    let response;
    if (props.isEdit) {
      // Update existing supply
      response = await axios.put(
        `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
    } else {
      // Add new supply
      response = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
    }

    toast.message = "Sukses";
    toast.description = response?.message || "Login berhasil!";
    toast.type = "SUCCESS";
    toast.trigger();
    emit("save");
  } catch (error) {
    toast.message = "Gagal";
    toast.description = error.response?.data || error.message;
    toast.type = "FAILED";
    toast.trigger();
  }
};

const cancelForm = () => {
  emit("cancel");
};

onMounted(() => {
  if (props.isEdit) {
    loadExistingData();
  }
});
</script>
