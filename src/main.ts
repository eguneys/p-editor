import { App, DrawCall } from 'blah'

new DrawCall().perform()
const app = (element: HTMLElement) => {
  console.log(element)
}


app(document.getElementById('app'))


export default app
