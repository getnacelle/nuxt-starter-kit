<template>
  <div
    :class="[
      loading ? 'product-image-skeleton loading' : 'loaded',
      visibility ? 'is-visible' : 'not-visible',
      validImage ? 'is-valid' : 'not-valid'
    ]"
    class="product-image nacelle"
    v-observe-visibility="{
      callback: visibilityChanged,
      once: true,
      intersection:{
        rootMargin: '500px'
      }
    }"
  >
    <picture>
      <template v-if="visibility && validImage">
        <source
          :srcset="optimizeSource({ ...optimizeOptions, format: 'webp' })"
          type="image/webp"
        />
        <source
          :srcset="optimizeSource({ ...optimizeOptions, format: 'jpg' })"
          type="image/jpeg"
        />
        <img
          v-bind="{ src, alt, width, height }"
          @load="loading = false"
          @error="fallback"
        />
      </template>
      <img
        v-else
        v-bind="{ src: blankImage, alt, width, height }"
        class="product-image-blank"
      />
    </picture>
  </div>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'
import imageVisibility from '~/mixins/imageVisibility'

export default {
  mixins: [imageOptimize, imageVisibility],

  data() {
    return {
      loading: true,
      blankImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 5'%3E%3C/svg%3E"
    }
  },
  props: {
    src: {
      type: String,
      default:
        'https://nacelle-assets.s3-us-west-2.amazonaws.com/default-product-image.svg'
    },
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    alt: {
      type: String,
      default: 'Featured Product Image'
    }
  },
  computed: {
    optimizeOptions() {
      return {
        url: this.src,
        width: this.width,
        height: this.height
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-image-skeleton,
img {
  position: relative;
  width: 100%;
  z-index: 0;
  font-size: 0;

  .loaded & {
    animation: fadein .5s ease-in;
  }
}
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

$color-gray: #aaa;
$color-gray-light: #fff;
.product-image-skeleton {
  background-color: rgba($color-gray, .25);

  &::after {
    content:'';
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 0;

    background-image:
      linear-gradient(
        100deg,
        rgba($color-gray-light, 0) 9%,
        rgba($color-gray-light, .25) 50%,
        rgba($color-gray-light, 0) 91%
      )
    ;

    background-size: 67% 100%;
    background-position: -200% 0;
    background-repeat: no-repeat;
    animation: loading 1.4s infinite;
  }
}
@keyframes loading {
  to {
    background-position: 300% 0;
  }
}

.product-image-blank {
  background-color: rgba($color-gray, .25);
}
</style>
