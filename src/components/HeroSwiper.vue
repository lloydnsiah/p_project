<script setup>
import { heroSlides } from "../data/heroSlides";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
</script>

<template>
  <div class="relative h-125 sm:h-screen w-full">
    <Swiper
      :modules="[Autoplay, EffectFade, Pagination]"
      effect="fade"
      :fadeEffect="{ crossFade: true }"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
        waitForTransition: true,
        pauseOnMouseEnter: true,
      }"
      :speed="4000"
      :loop="true"
      :pagination="{
        clickable: true,
        dynamicBullets: true,
        el: '.custom-pagination',
        bulletClass: 'swiper-bullet-custom',
        bulletActiveClass: 'swiper-bullet-active-custom',
      }"
      class="w-full"
    >
      <!-- Slides content remains the same -->
      <SwiperSlide v-for="slide in heroSlides" :key="slide.id">
        <div
          class="h-full w-full bg-cover bg-center"
          :style="{ backgroundImage: `url(${slide.bgImage})` }"
        >
          <div
            class="absolute inset-0 bg-black/30 flex items-center justify-center"
          >
            <div
              class="text-center flex flex-col items-center text-white px-4 max-w-4xl"
            >
              <h2 class="text-5xl sm:text-7xl font-light">
                {{ slide.title }}
              </h2>
              <div class="bg-neutral-200 w-50 h-px my-5 sm:mt-8 sm:mb-10"></div>
              
              <p
                class="text-xl uppercase tracking-lg text-neutral-200 tracking-[0.25rem]"
              >
                {{ slide.subtitle }}
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>

      <!-- Custom pagination container -->
      <div class="custom-pagination"></div>
    </Swiper>
  </div>
</template>

<style>
/* Using standard CSS instead of Tailwind for Swiper internals */

/* Ensures no white flash during transitions */
.swiper {
  background-color: black; /* Prevents white background flash */
}

.swiper-slide-active {
  opacity: 1;
}

.custom-pagination {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 2rem;
  z-index: 10;
  display: flex;
  justify-content: center;
  width: auto !important;
}

/* Bullet styling */
.swiper-bullet-custom {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  margin: 0 6px !important;
  cursor: pointer;
  transition: all 0.3s ease;
  transform-origin: center center;
}

/* Active bullet styling */
.swiper-bullet-active-custom {
  width: 24px;
  background: white;
  opacity: 1 !important;
}

/* Fix for Swiper's dynamic bullets */
.swiper-pagination-dynamic .swiper-pagination-bullet {
  transform: scale(1) !important;
  transition: all 0.3s ease !important;
}
.swiper-pagination-dynamic .swiper-pagination-bullet-active {
  transform: scale(1.2) !important;
}
</style>
