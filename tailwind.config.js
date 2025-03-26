// https://unpkg.com/browse/tailwindcss@3.1.6/stubs/defaultConfig.stub.js

/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./src/**/*.{js,ts,tsx,jsx}'],
  corePlugins: {
    preflight: false,
    container: false
  },
  theme: {
    spacing: () => {
      let baseObj = {
        120: '120px',
        130: '130px',
        140: '140px',
        160: '160px',
        180: '180px',
        200: '200px',
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': '16.666667%',
        '5/6': '83.333333%',
        '1/12': '8.333333%',
        '5/12': '41.666667%',
        '7/12': '58.333333%',
        '11/12': '91.666667%',
        full: '100%'
        // auto: 'auto',
      }

      // 0-100 px
      let obj = {}
      for (let i = 0; i <= 100; i++) {
        obj[i] = `${i}px`
      }

      return {
        ...obj,
        ...baseObj
      }
    },
    fontSize: (theme) => theme('spacing'),
    borderRadius: (theme) => theme('spacing'),
    borderWidth: (theme) => theme('spacing'),
    // lineHeight: (theme) => theme('spacing'),

    width: (theme) => ({
      ...theme('spacing'),
      'max-content': 'max-content',
      screen: '100vw'
    }),
    maxWidth: (theme) => theme('width'),
    minWidth: (theme) => theme('width'),
    height: (theme) => ({
      ...theme('width'),
      screen: '100vh'
    }),
    maxHeight: (theme) => theme('height'),
    minHeight: (theme) => theme('height')
  }
}
