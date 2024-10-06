<template>
  <PageContainer title="Supplier Detail" subtitle="Daftar supplier yang ada...">
    <form @submit.prevent="handleSubmit">
      <!-- Supplier Detail -->
      <div class="form-section">
        <h2>Supplier Detail</h2>
        <hr />
        <TextInput
          v-model="supplierDetail.name"
          name="name"
          label="Name"
          placeholder="Enter supplier name"
          required
          class="w-full"
        />
        <div class="flex flex-row justify-between space-x-4">
          <TextInput
            v-model="supplierDetail.due_date"
            name="due_date"
            type="date"
            label="Tenggat Waktu"
            required
            class="w-1/2"
          />
          <TextInput
            v-model="supplierDetail.total_price"
            name="total_price"
            label="Total Harga"
            placeholder="Enter total price"
            required
            class="w-1/2"
          />
        </div>

        <DashboardButton class="w-1/4 mt-4" @click="updateStatus">
          Update Status
        </DashboardButton>
      </div>

      <!-- Product Detail -->
      <div
        v-for="(product, index) in productDetails"
        :key="index"
        class="form-section mt-8"
      >
        <h2>Product Detail</h2>
        <hr />
        <TextInput
          v-model="product.name"
          name="product_name"
          label="Name"
          placeholder="Enter product name"
          required
        />
        <div class="flex flex-row justify-between space-x-4">
          <TextInput
            v-model="product.sku"
            name="sku"
            label="SKU"
            placeholder="Enter SKU"
            required
            class="w-1/2"
          />
          <TextInput
            v-model="product.stock"
            name="stock"
            label="Stock"
            type="number"
            placeholder="Enter stock quantity"
            required
            class="w-1/2"
          />
        </div>
        <div class="flex flex-row justify-between space-x-4">
          <TextInput
            v-model="product.type"
            name="type"
            label="Type"
            placeholder="Enter type"
            required
            class="w-1/2"
          />
          <TextInput
            v-model="product.image"
            name="image"
            label="Gambar"
            placeholder="Enter image URL"
            required
            class="w-1/2"
          />
        </div>
        <div class="flex flex-row justify-between space-x-4">
          <TextInput
            v-model="product.price_per_unit"
            name="price_per_unit"
            label="Harga per produk"
            placeholder="Enter price per unit"
            required
            class="w-1/2"
          />
          <TextInput
            v-model="product.total_price"
            name="total_price"
            label="Total Harga"
            placeholder="Enter total price"
            required
            class="w-1/2"
          />
        </div>
      </div>

      <div class="flex flex-col space-y-4 w-full items-center justify-center">
        <DashboardButton class="w-1/4" @click="addProduct">
          Tambah Produk
        </DashboardButton>
        <DashboardButton class="w-1/4" type="submit">Submit</DashboardButton>
      </div>
    </form>
  </PageContainer>
</template>

<script setup>
import { defineProps, ref, onMounted, defineAsyncComponent } from "vue";
import PageContainer from "@/views/PageContainer.vue";
import DashboardButton from "@/components/Button/DashboardButton.vue";
import axios from "axios";

const TextInput = defineAsyncComponent(() =>
  import("@/components/Input/TextInput.vue")
);

// Define props to receive data
const props = defineProps({
  supplierData: {
    type: Object,
    default: null,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

// Reactive data for supplier detail
const supplierDetail = ref({
  id: props.supplierData ? props.supplierData.id : "",
  name: props.supplierData ? props.supplierData.name : "",
  due_date: props.supplierData ? props.supplierData.due_date : "",
  total_price: props.supplierData ? props.supplierData.total_price : "",
});

// Reactive data for product details
const productDetails = ref([]);

// Function to add a new product detail section
const addProduct = () => {
  productDetails.value.push({
    name: "",
    sku: "",
    stock: 0,
    type: "",
    image: "",
    price_per_unit: 0,
    total_price: 0,
  });
};

// Load existing data if editing
const loadExistingData = async () => {
  if (!props.supplierData || !props.supplierData.id) {
    return;
  }

  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply/detail`,
      {
        params: { id: props.supplierData.id, shop_id: 1 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        withCredentials: true,
      }
    );

    // Populate product details if data exists
    if (response.data.data && response.data.data.length > 0) {
      response.data.data.forEach((productData) => {
        const product = productData.product;
        productDetails.value.push({
          name: product.name,
          sku: product.sku,
          stock: product.stock,
          type: product.type,
          image: product.image_url,
          price_per_unit: productData.capital_price,
          total_price: productData.total_price,
        });
      });
    }

    fetchSuppliers();
  } catch (error) {
    console.error("Error fetching supply details:", error);
  }
};

// Submit handler
const handleSubmit = async () => {
  try {
    const requestBody = {
      shop_id: "76L1",
      supplier: supplierDetail.value.id,
      due_date: supplierDetail.value.due_date,
      data: productDetails.value.map((product) => ({
        type: product.type,
        sku: product.sku,
        capital_price: product.price_per_unit,
        amount: product.stock,
      })),
    };
    const response = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply/add`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        withCredentials: true,
      }
    );
    console.log("Supply successfully added:", response.data);
  } catch (error) {
    console.error("Error adding supply:", error);
  }
};

// Update status handler
const updateStatus = async () => {
  if (!supplierDetail.value.id) {
    console.error("No supplier ID available for updating status.");
    return;
  }

  try {
    const requestBody = {
      shop_id: "76L1",
      supplier: supplierDetail.value.id,
    };
    const response = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply/pay`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        withCredentials: true,
      }
    );
    console.log("Supply status updated:", response.data);
  } catch (error) {
    console.error("Error updating supply status:", error);
  }
};

// Mounting logic for loading data if in edit mode
onMounted(() => {
  console.log("Is edit mode:", props.isEdit);
  console.log("Supplier data:", props.supplierData);
  if (props.isEdit && props.supplierData) {
    loadExistingData();
  }
});

// Function to fetch suppliers (for dropdown or related use)
const fetchSuppliers = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/supplier?shop_id=1`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        withCredentials: true,
      }
    );
    supplierDetail.value.name = response.data.data[0].name;
    console.log(response.data.data);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
  }
};
</script>
