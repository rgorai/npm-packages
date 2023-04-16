import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import scss from 'rollup-plugin-scss'
import sass from 'rollup-plugin-scss'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import styles from 'rollup-plugin-styles'

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    scss({
      insert: true,
      output: 'dist/styles.css',
    }),
    // postcss({
    //   plugins: [autoprefixer(), cssnano()],
    //   extract: true,
    //   minimize: true,
    //   sourceMap: true,
    //   extensions: ['.css', '.scss'],
    // }),
    terser(),
  ],
  external: ['react', 'react-dom'],
}
