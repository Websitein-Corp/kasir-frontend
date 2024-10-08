<template>
  <div class="p-4 lg:px-8 mb-4">
    <CategoryTab
      :items="categories"
      @tab-change="(category) => (currentCategory = category)"
    />
  </div>
  <div class="w-full grid grid-cols-2 xl:grid-cols-3 gap-2 lg:gap-4">
    <div v-for="product in products" :key="product.sku" class="col-span-1">
      <ProductCard
        :sku="product.sku"
        :name="product.name"
        :type="product.type"
        :selling-price="product.selling_price"
        :image-url="product.image_url"
        :selected="cart.has(product.sku)"
      />
    </div>
  </div>
  <div
    class="lg:hidden fixed z-50 bottom-4 left-1/2 -translate-x-1/2 w-11/12 transition-all"
  >
    <transition name="fade">
      <CustomButton
        v-if="!page.navIsOpened && cart.items.length > 0"
        size="full"
        height="lg"
        iconSide="right"
        label="Summary"
        align="between"
        class="bg-primary-700 hover:bg-primary-800"
        :icon="CornerDownRight"
        @click="page.order.step++"
      >
        <div class="font-bold">Subtotal | {{ $helpers.money(cart.sum) }}</div>
      </CustomButton>
    </transition>
  </div>
</template>

<script setup>
import ProductCard from "@/components/Card/ProductCard.vue";
import useCart from "@/stores/useCart";
import { CornerDownRight } from "lucide-vue-next";
import CustomButton from "@/components/Button/CustomButton.vue";
import usePage from "@/stores/usePage";
import CategoryTab from "@/components/Tab/CategoryTab.vue";
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import useAuth from "@/stores/useAuth";

const categories = ref([
  {
    name: "All",
    code: "",
  },
  {
    name: "Bumbu Masak",
    code: "bmbmsk",
  },
  {
    name: "Makanan",
    code: "mkn",
  },
  {
    name: "Hiburan",
    code: "hbrn",
  },
]);

const products = ref([
  {
    sku: "sarimi2ag",
    name: "Sarimi Isi 2 Rasa Ayam Goreng",
    selling_retail_price: 3000,
    selling_price: 2500,
    discount_price: 500,
    stock: 170,
    image_url: "https://placehold.co/400x600",
    type: "SERVICE",
    category: {
      name: "Bumbu Masak",
      code: "bmbmsk",
    },
    barcode: "0012345678",
    is_active: false,
  },
  {
    sku: "burger",
    name: "Burger Biasa",
    selling_retail_price: 15000,
    selling_price: 15000,
    discount_price: 0,
    stock: null,
    image_url: "https://placehold.co/400x600",
    type: "FOODS",
    category: {
      name: "Makanan",
      code: "mkn",
    },
    barcode: null,
    is_active: false,
  },
  {
    sku: "burgerblng",
    name: "Burger Blenger",
    selling_retail_price: 25000,
    selling_price: 22000,
    discount_price: 3000,
    stock: null,
    image_url: "https://placehold.co/400x600",
    type: "FOODS",
    category: {
      name: "Makanan",
      code: "mkn",
    },
    barcode: null,
    is_active: false,
  },
  {
    sku: "blrd1",
    name: "Meja Billiard 1",
    selling_retail_price: 25000,
    selling_price: 25000,
    discount_price: 0,
    stock: null,
    image_url: "https://placehold.co/400x600",
    type: "SERVICE TIME",
    category: {
      name: "Hiburan",
      code: "hbrn",
    },
    barcode: null,
    is_active: false,
  },
  {
    sku: "blrd2",
    name: "Meja Billiard 2",
    selling_retail_price: 25000,
    selling_price: 25000,
    discount_price: 0,
    stock: null,
    image_url: "https://placehold.co/400x600",
    type: "SERVICE TIME",
    category: {
      name: "Hiburan",
      code: "hbrn",
    },
    barcode: null,
    is_active: false,
  },
  {
    sku: "blrd3",
    name: "Meja Billiard 3",
    selling_retail_price: 25000,
    selling_price: 25000,
    discount_price: 0,
    stock: null,
    image_url: "https://placehold.co/400x600",
    type: "SERVICE TIME",
    category: {
      name: "Hiburan",
      code: "hbrn",
    },
    barcode: null,
    is_active: false,
  },
  {
    sku: "blrd4",
    name: "Meja Billiard 4",
    selling_retail_price: 25000,
    selling_price: 25000,
    discount_price: 0,
    stock: null,
    image_url: "https://placehold.co/400x600",
    type: "SERVICE TIME",
    category: {
      name: "Hiburan",
      code: "hbrn",
    },
    barcode: null,
    is_active: false,
  },
]);

const auth = useAuth();
const cart = useCart();
const page = usePage();

const currentCategory = ref("");

onMounted(async () => {
  await fetchCategories();
  await fetchProducts();
});

watch(currentCategory, async () => {
  await fetchProducts();
});

const fetchCategories = async () => {
  const response = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/products/categories?shop_id=${auth.shopId}`,
    {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
      withCredentials: true,
    }
  );

  categories.value = response.data.data;
  categories.value.unshift({
    name: "All",
    code: "",
  });
};

const fetchProducts = async () => {
  const response = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/products?category=${currentCategory.value}&shop_id=${auth.shopId}`,
    {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
      withCredentials: true,
    }
  );

  products.value = response.data.data;
};
</script>
