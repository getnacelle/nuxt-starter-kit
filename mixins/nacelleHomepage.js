import { mapState } from 'vuex'
import { getPage } from './getPage'
import { getCollection } from './getCollection'

export default params => {
  return {
    mixins: [
      getPage({ pageHandle: 'homepage', ...params }),
      getCollection({ pageHandle: 'homepage', ...params })
    ],
    computed: {
      ...mapState('space', ['name'])
    }
  }
}
