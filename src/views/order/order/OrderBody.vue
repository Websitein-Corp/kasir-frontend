<template>
  <div class="p-4 px-8">
    <CategoryTab />
  </div>
  <div class="w-full grid grid-cols-2 xl:grid-cols-3 gap-2 lg:gap-4">
    <!--    <RecycleScroller-->
    <!--      class="w-full h-full"-->
    <!--      :items="products"-->
    <!--      :item-size="500"-->
    <!--      :item-secondary-size="370"-->
    <!--      key-field="title"-->
    <!--      grid-items="3"-->
    <!--      v-slot="{ item }"-->
    <!--    >-->
    <!--      <div class="col-span-1 m-4">-->
    <!--        <ProductCard-->
    <!--          :title="item.title"-->
    <!--          :price="item.price"-->
    <!--          :image="item.image"-->
    <!--          :selected="cart.has(item.title)"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </RecycleScroller>-->
    <div v-for="product in products" :key="product.title" class="col-span-1">
      <ProductCard
        :title="product.title"
        :price="product.price"
        :image="product.image"
        :selected="cart.has(product.title)"
      />
    </div>
  </div>
  <div
    class="lg:hidden fixed z-50 bottom-4 left-1/2 -translate-x-1/2 w-4/5 transition-all"
  >
    <transition name="fade">
      <CustomButton
        v-if="!page.navIsOpened"
        size="full"
        height="lg"
        iconSide="right"
        label="Summary"
        align="between"
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
import { onMounted, ref } from "vue";
import axios from "axios";

const categories = ref([]);

const products = [
  {
    title: "Burger",
    price: 10000,
    image: "https://placehold.co/400x600",
  },
  {
    title: "Bur",
    price: 5000,
    image: "https://placehold.co/400x600",
  },
  {
    title: "Ger",
    price: 5000,
    image: "https://placehold.co/400x600",
  },
  {
    title: "Burgergerbur",
    price: 40000,
    image: "https://placehold.co/400x600",
  },
  {
    title: "Burbur",
    price: 12000,
    image: "https://placehold.co/400x600",
  },
  {
    title: "Gerger",
    price: 15000,
    image: "https://placehold.co/400x600",
  },
  {
    title: "Burger2",
    price: 10000,
    image: "https://placehold.co/400x600",
  },
  {
    title: "Bur2",
    price: 5000,
    image: "https://placehold.co/400x600",
  },
  {
    title: "Ger2",
    price: 5000,
    image: "https://placehold.co/400x600",
  },
  {
    title: "Burgergerbur2",
    price: 40000,
    image: "https://placehold.co/400x600",
  },
  {
    title: "Burbur2",
    price: 12000,
    image: "https://placehold.co/400x600",
  },
  {
    title: "Gerger2",
    price: 15000,
    image: "https://placehold.co/400x600",
  },
];

const cart = useCart();
const page = usePage();

onMounted(() => {
  // axios
  //   .get(
  //     `${process.env.VUE_APP_API_BASE_URL}/api/products/categories/?shop_id=jR`,
  //     {
  //       headers: {
  //         Authorization:
  //           "Bearer 3|s0dwew6GRzItmuO7UeS19OwUq3lqrdLd4tFpKpHP2d161795",
  //       },
  //     }
  //   )
  //   .then((res) => {
  //     categories.value = res.data.data;
  //   });
});
</script>
