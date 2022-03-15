import {
  Tag,
  Row,
  Col,
  Menu,
  Card,
  Main,
  Aside,
  Button,
  Header,
  Footer,
  MenuItem,
  Container,
  Pagination,
  Autocomplete,
} from 'element-ui'
import routes from './routes'

import 'imStyles/palette.styl'
import 'imStyles/index.styl'
import 'imStyles/element-variables.scss'
import 'imStyles/iconfont.css'
import 'imStyles/code.styl'
import 'imStyles/content.styl'

export default ({ Vue, router }) => {
  Vue.use(Tag)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Menu)
  Vue.use(Card)
  Vue.use(Main)
  Vue.use(Aside)
  Vue.use(Button)
  Vue.use(Header)
  Vue.use(Footer)
  Vue.use(MenuItem)
  Vue.use(Container)
  Vue.use(Pagination)
  Vue.use(Autocomplete)

  Vue.use(routes, { router })
  Vue.use(importElement)
}
