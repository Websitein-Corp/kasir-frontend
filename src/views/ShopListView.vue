<template>
  <PageContainer
    title="Pilih Toko"
    subtitle="
      Pilih toko yang ingin dikunjungi...
    "
  >
    <div class="grid grid-cols-2 gap-8 p-8">
      <FormCard
        v-for="shop in shopList"
        v-bind:key="shop.id"
        :title="shop.name"
        :icon="Store"
        class="col-span-2 lg:col-span-1 hover:shadow-2xl cursor-pointer transition-all"
        @click="() => pickShop(shop.id, shop.name)"
      >
        <div>{{ shop.address }}</div>
      </FormCard>
    </div>
  </PageContainer>
</template>

<script setup>
import { Store } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import PageContainer from "@/views/PageContainer.vue";
import axios from "axios";
import FormCard from "@/components/Card/FormCard.vue";
import useToast from "@/stores/useToast";
import router from "@/router";
import useAuth from "@/stores/useAuth";
import { useRoute } from "vue-router";

const props = defineProps({
  subuserData: {
    type: Object,
    default: null,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const auth = useAuth();
const toast = useToast();
const route = useRoute();

const shopList = ref([]);

onMounted(() => {
  auth.checkLoginSession(route);
  fetchShopList();
});

const fetchShopList = async () => {
  const { data } = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/shop-list`,
    {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
      withCredentials: true,
    }
  );

  shopList.value = data.data;
};

const pickShop = (id, name) => {
  auth.setShopId(id);

  toast.message = "Sukses";
  toast.description = `${name} berhasil dipilih!`;
  toast.type = "SUCCESS";
  toast.trigger();

  router.push("/");
};
</script>
