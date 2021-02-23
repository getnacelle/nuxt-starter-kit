import { action } from '@storybook/addon-actions'
import { withInfo } from 'storybook-addon-vue-info'

import ContentHeroBanner from '../components/nacelle/ContentHeroBanner'

const defaults = {
  imageUrl:
    'https://nacelle-assets.s3-us-west-2.amazonaws.com/default-banner-img.png',
  title: 'Hero Title',
  subtitle: 'Subtitle copy text',
  ctaText: 'CTA BUTTON'
}

export default {
  title: 'Components | Content / Hero Banner',
  decorators: [withInfo]
}

export const Default = () => ({
  components: { ContentHeroBanner },
  data() {
    return {
      ...defaults
    }
  },
  template: `
    <content-hero-banner
      :imageUrl="imageUrl"
      :title="title"
      :subtitle="subtitle"
      :ctaText="ctaText"
    />
  `
})

Default.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}

// export default {
//   title: 'Components | Content / Hero Banner',
//   decorators: [withInfo],
// };

export const FullHeight = () => ({
  components: { ContentHeroBanner },
  data() {
    return {
      ...defaults,
      size: 'fullheight'
    }
  },
  template: `
    <content-hero-banner
      :size="size"
      :imageUrl="imageUrl"
      :title="title"
      :subtitle="subtitle"
      :ctaText="ctaText"
    />
  `
})

FullHeight.story = {
  name: 'Full height',
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}

// export default {
//   title: 'Components | Content / Hero Banner',
//   decorators: [withInfo],
// };

export const TextColor = () => ({
  components: { ContentHeroBanner },
  data() {
    return {
      ...defaults,
      textColor: '#ffffff'
    }
  },
  template: `
    <content-hero-banner
      :imageUrl="imageUrl"
      :title="title"
      :subtitle="subtitle"
      :ctaText="ctaText"
      :textColor="textColor"
    />
  `
})

TextColor.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}

// export default {
//   title: 'Components | Content / Hero Banner',
//   decorators: [withInfo],
// };

export const CustomCtaEvent = () => ({
  components: { ContentHeroBanner },
  data() {
    return {
      ...defaults,
      ctaHandler: action('CTA click')
    }
  },
  template: `
    <content-hero-banner
      :imageUrl="imageUrl"
      :title="title"
      :subtitle="subtitle"
      :ctaText="ctaText"
      :ctaHandler="ctaHandler"
    />
  `
})

CustomCtaEvent.story = {
  name: 'Custom CTA event',

  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}

// export default {
//   title: 'Components | Content / Hero Banner',
//   decorators: [withInfo],
// };

export const MobileImage = () => ({
  components: { ContentHeroBanner },
  data() {
    return {
      ...defaults,
      mobileFullHeight: true,
      mobileBackgroundImgUrl:
        'https://nacelle-assets.s3-us-west-2.amazonaws.com/default-mobile-banner.png'
    }
  },
  template: `
    <content-hero-banner
      :imageUrl="imageUrl"
      :mobileBackgroundImgUrl="mobileBackgroundImgUrl"
      :mobileFullHeight="mobileFullHeight"
      :title="title"
      :subtitle="subtitle"
      :ctaText="ctaText"
    />
  `
})

MobileImage.story = {
  name: 'Mobile image',

  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}

// export default {
//   title: 'Components | Content / Hero Banner',
//   decorators: [withInfo],
// };

export const CustomSlots = () => ({
  components: { ContentHeroBanner },
  data() {
    return {
      ...defaults,
      mobileFullHeight: true,
      mobileBackgroundImgUrl:
        'https://nacelle-assets.s3-us-west-2.amazonaws.com/default-mobile-banner.png'
    }
  },
  template: `
    <content-hero-banner
      :imageUrl="imageUrl"
      :mobileBackgroundImgUrl="mobileBackgroundImgUrl"
      :mobileFullHeight="mobileFullHeight"
      :title="title"
      :subtitle="subtitle"
      :ctaText="ctaText"
    >
      <template v-slot:background="{ imageUrl }">
        <img :src="imageUrl" width="300px" alt="" />
      </template>
      <template v-slot:body>
        <h5>Testing Slots</h5>
      </template>
      <template v-slot:cta="{ ctaText }">
        <p>{{ ctaText }}</p>
      </template>
    </content-hero-banner>
  `
})

CustomSlots.story = {
  parameters: {
    info: {
      // summary: "Hello"
    }
  }
}
