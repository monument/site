export const categories = [
  'Monument',
  'Bench',
  'Inscription',
  'Statue',
  'Reference',
  'WIP',
  'Other',
]

export const materials = ['Granite', 'Bronze', 'Marble', 'Other']

export const sizes = ['Single', 'Double', 'Family', 'Monumental']

export const detailList = ['shape', 'style', 'color', 'finish', 'attributes']

const graniteDetails = {
  shape: {
    $type: 'or',
    $options: [
      'Serp Top',
      'Flat Marker',
      'Cross',
      'Flat Top',
      'Heart',
      'Double Heart',
      'Teardrop',
      'Flame',
      'Gothic',
      'Custom',
      'Boulder',
      'Other',
    ],
  },
  style: {
    $type: 'or',
    $options: ['Upright', 'Slant', 'Flat', 'VA Marker'],
  },
  color: {
    $type: 'or',
    $options: [
      'Black',
      'Gray',
      'Rose',
      'Pink',
      'Mahogany',
      'Red',
      'Green',
      'Blue',
      'Other',
    ],
  },
  finish: {
    $type: 'or',
    $dependsOn: 'style',
    upright: [
      'Polish 2',
      'Polish 3',
      'All Polish',
      'Flamed',
      'Frosted',
      'Sawn',
      'Other',
    ],
    slant: [
      'Polish Slant Face',
      'All Polish',
      'Flamed',
      'Frosted',
      'Sawn',
      'Other',
    ],
    flat: ['Polish Flat Top', 'Flamed', 'Frosted', 'Sawn', 'Other'],
    'va marker': ['Normal', 'Other'],
  },
  attributes: {
    $type: 'and',
    $options: [
      'Porcelain Photo',
      'Laser Etching',
      'Gold Leaf',
      'Shape Carving',
      'US Metalcraft Vase',
      'Bronze Vase',
      'Granite Vase',
      'Other',
      'Frosted Lettering',
      'Frosted Outline Lettering',
    ],
  },
}

const bronzeDetails = {
  shape: null,
  style: {
    $type: 'or',
    $options: ['Flat', 'VA Marker', 'Upright'],
  },
  color: null,
  finish: {
    $type: 'or',
    $dependsOn: 'style',
    upright: ['Normal', 'Other'],
    flat: ['Normal', 'Other'],
    'va marker': ['Normal', 'Other'],
  },
  attributes: {
    $type: 'and',
    $options: ['Bronze Montage', 'Bronze Vase', 'Other'],
  },
}

const marbleDetails = {
  shape: {
    $type: 'or',
    $options: [
      'Serp Top',
      'Cross',
      'Heart',
      'Double Heart',
      'Teardrop',
      'Flame',
      'Gothic',
      'Other',
    ],
  },
  style: {$type: 'or', $options: ['Upright', 'Flat', 'VA Marker']},
  color: {$type: 'or', $options: ['White', 'Other']},
  finish: {
    $type: 'or',
    $dependsOn: 'style',
    upright: ['Normal', 'Rock Pitch', 'Other'],
    flat: ['Normal', 'Other'],
    'va marker': ['Normal', 'Other'],
  },
  attributes: {
    $type: 'and',
    $options: ['Other'],
  },
}

export const details = {
  granite: graniteDetails,
  bronze: bronzeDetails,
  marble: marbleDetails,
}
