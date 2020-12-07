<template>
  <div
    :class="[
      loading ? 'image-skeleton loading' : 'loaded',
      visibility ? 'is-visible' : 'not-visible',
      validImage ? 'is-valid' : 'not-valid',
      fill ? 'fill' : 'intrinsic'
    ]"
    class="nacelle-image"
    v-observe-visibility="{
      callback: visibilityChanged,
      once: true,
      intersection: { rootMargin }
    }"
  >
    <picture v-if="visibility">
      <template v-if="validImage">
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
          @load="onLoad"
          @error="fallback"
        />
      </template>
      <img
        v-else
        v-bind="{ src: blankImage, alt, width, height }"
        class="blank-image"
      />
    </picture>
  </div>
</template>

<script>
import { ObserveVisibility } from 'vue-observe-visibility'
import optimizeSource from './optimizeSource'
import delay from '~/utils/delay'

export default {
  directives: {
    ObserveVisibility
  },
  props: {
    src: {
      type: String,
      default: '//nacelle-assets.s3-us-west-2.amazonaws.com/default-product-image.svg'
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
    },
    cropDirection: {
      type: String,
      default: 'center'
    },
    fill: {
      type: Boolean,
      default: true
    },
    lazy: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      loading: true,
      validImage: true,
      rootMargin: '0px',
      blankImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 5'%3E%3C/svg%3E"
    }
  },
  computed: {
    visibility() {
      return this.lazy ? this.visible : true
    },
    optimizeOptions() {
      return {
        url: this.src,
        width: this.width,
        height: this.height
      }
    }
  },
  async mounted() {
    // NOTE: use a delay before setting the desired rootMargin.
    // This prevent images from getting loaded while page elements are still rendering.
    await delay(500)
    this.rootMargin = '500px'
  },
  methods: {
    optimizeSource,

    fallback() {
      this.validImage = false
    },
    onLoad() {
      this.loading = false
      this.$emit('load')
    },
    visibilityChanged(isVisible) {
      this.visible = isVisible
    }
  }
}
</script>

<style lang="scss" scoped>
.nacelle-image {
  &.fill img {
    width: 100%;
  }
}
.loaded img {
  animation: fadein .25s ease-in;
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
.image-skeleton {
  position: relative;
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
.blank-image {
  background-color: rgba($color-gray, .25);
}
</style>
