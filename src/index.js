import { a, change } from './a'

import './style.css'

setInterval(() => {
  change()
  console.log([...['你好啊'], a])
  document.body.innerHTML += a
  change()
}, 1000)
