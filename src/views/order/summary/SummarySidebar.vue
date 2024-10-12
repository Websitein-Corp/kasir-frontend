<template>
  <div v-if="page.order.step === 1" class="w-full mt-8 flex justify-center p-4">
    <CustomButton
      size="md"
      iconSide="left"
      label="Tambah Diskon"
      class="bg-transparent hover:bg-slate-100 text-primary-800 border-2 border-primary-700 hover:border-primary-800"
      :icon="TicketPercent"
      @click="modal.open()"
    />
  </div>
  <hr class="mt-8" />
  <div class="p-4 mt-8 space-y-4 overflow-y-scroll">
    <div
      v-if="cart.items.length === 0"
      class="h-full flex flex-col items-center justify-center space-y-4"
    >
      <div class="w-1/3">
        <img src="@/assets/images/emptyCart.png" alt="emptyCart.png" />
      </div>
      <div class="text-slate-500 text-center">
        Keranjang kosong, tambahkan barang untuk lanjut
      </div>
    </div>
    <div v-else class="space-y-2 font-helvetica-light">
      <div class="flex justify-between">
        <div>Jumlah</div>
        <div>
          {{ cart.amount }}
        </div>
      </div>
      <div class="flex justify-between">
        <div>Subtotal</div>
        <div>
          {{ $helpers.money(cart.sum) }}
        </div>
      </div>
      <div class="flex justify-between">
        <div>PPN 10%</div>
        <div>
          {{ $helpers.money(cart.tax) }}
        </div>
      </div>
      <div v-if="cart.discount > 0" class="flex justify-between">
        <div>Diskon</div>
        <div>
          {{ $helpers.money(cart.discount) }}
        </div>
      </div>
      <div class="flex justify-between">
        <div>Total</div>
        <div>
          {{ $helpers.money(cart.total) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TicketPercent } from "lucide-vue-next";
import CustomButton from "@/components/Button/CustomButton.vue";
import useCart from "@/stores/useCart";
import useModal from "@/stores/useModal";
import { onMounted } from "vue";
import usePage from "@/stores/usePage";
import DiscountBody from "@/components/Modal/Body/DiscountBody.vue";

const cart = useCart();
const page = usePage();
const modal = useModal();

onMounted(() => {
  modal.title = "Tambah Diskon";
  modal.icon = TicketPercent;
  modal.body = DiscountBody;
});
</script>
