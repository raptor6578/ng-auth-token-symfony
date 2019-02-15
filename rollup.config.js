export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/bundles/tokenAuth.umd.js',
    format: 'umd',
    name: 'token-auth',
    globals: {
      '@angular/core': 'vendor._angular_core',
      '@angular/common': 'vendor._angular_common',
      '@angular/router': 'vendor._angular_router',
      '@angular/common/http': 'vendor._angular_common_http',
      'rxjs': 'vendor._rxjs',
      'rxjs/operators': 'vendor._rxjs_operators',
    },
  },
  external: [
    '@angular/core',
    '@angular/common',
    '@angular/router',
    '@angular/common/http',
    'rxjs',
    'rxjs/operators',
    'js-base64',
  ],
  onwarn: (warning) => {
    const skip_codes = [
      'THIS_IS_UNDEFINED',
      'MISSING_GLOBAL_NAME'
    ];
    if (skip_codes.includes(warning.code)) return;
    console.error(warning);
  }
};
