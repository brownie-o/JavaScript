export default {
  type: 'bubble',
  hero: {
    type: 'image',
    url: 'https://wdaweb.github.io/index_assets/img/node.jpg',
    size: 'full',
    aspectRatio: '20:13',
    aspectMode: 'cover',
    action: {
      type: 'uri',
      uri: 'http://linecorp.com/'
    },
    align: 'center',
    position: 'relative'
  },
  body: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: 'Brown Cafe',
        weight: 'bold',
        size: 'xl'
      }
    ]
  }
}
