<template>
  <div
    class="p-4 xl:px-0 lg:px-8 flex flex-col xl:flex-row space-y-4 xl:space-y-0 xl:space-x-2"
  >
    <CategoryTab
      :items="categories"
      @tab-change="(category) => (currentCategory = category)"
    />
    <SearchInput v-model="keyword"></SearchInput>
  </div>
  <div
    class="w-full h-3/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4 mb-16 lg:mb-0"
  >
    <div
      v-if="products.every((product) => !product.is_active)"
      class="col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3 h-full flex flex-col items-center justify-center space-y-8"
    >
      <div class="w-1/3">
        <img
          src="@/assets/images/productInactive.svg"
          alt="productInactive.svg"
        />
      </div>
      <div class="text-slate-500 text-center text-xl">
        Belum ada produk yang aktif, silakan mengaktifkan di menu produk
      </div>
    </div>
    <div
      v-else
      v-for="product in products"
      :key="product.sku"
      class="col-span-1"
    >
      <ProductCard
        v-if="product.is_active"
        :sku="product.sku"
        :name="product.name"
        :type="product.type"
        :amount="cart.getItem(product.sku) && cart.getItem(product.sku).amount"
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
import { axios } from "@/sdk/axios";
import useAuth from "@/stores/useAuth";
import { useRoute } from "vue-router";
import SearchInput from "@/components/Input/SearchInput.vue";

const auth = useAuth();
const cart = useCart();
const page = usePage();
const route = useRoute();

const categories = ref([]);
const products = ref([]);
const currentCategory = ref("");
const keyword = ref(null);

onMounted(() => {
  Promise.all([fetchCategories(), fetchProducts()]);
});

watch(currentCategory, () => {
  fetchProducts();
});

watch(keyword, () => {
  fetchProducts();
});

const fetchCategories = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/products/categories?shop_id=${auth.shopId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      categories.value = data.data;
      categories.value.unshift({
        name: "All",
        code: "",
      });
    });
};

const fetchProducts = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/products?category=${
        currentCategory.value
      }&shop_id=${auth.shopId}${
        keyword.value ? "&keyword=" + keyword.value : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      products.value = data.data;
    });
};
</script>
