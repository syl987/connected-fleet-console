import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      // ==== eslint: suggestions ====
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: 'rxjs/operators',
              message: "Please import from 'rxjs' instead.",
            },
            {
              name: '@angular/forms',
              importNames: [
                'FormsModule',
                'NgForm',
                'NgModel',
                'NgModelGroup',
              ],
              message: 'Please use reactive forms instead.',
            },
          ],
        },
      ],

      // ==== @angular-eslint: typescript ====
      '@angular-eslint/component-max-inline-declarations': 'warn',
      '@angular-eslint/consistent-component-styles': 'warn',
      '@angular-eslint/contextual-decorator': 'error',
      '@angular-eslint/no-async-lifecycle-method': 'warn',
      '@angular-eslint/no-conflicting-lifecycle': 'warn',
      '@angular-eslint/no-duplicates-in-metadata-arrays': 'warn',
      '@angular-eslint/no-inputs-metadata-property': 'off', // recommended override: necessary for extending a component
      '@angular-eslint/no-outputs-metadata-property': 'off', // recommended override: necessary for extending a component
      '@angular-eslint/no-queries-metadata-property': 'off', // recommended override: necessary for extending a component
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@angular-eslint/prefer-output-readonly': 'warn',
      '@angular-eslint/prefer-standalone': 'warn',
      '@angular-eslint/relative-url-prefix': 'warn',
      '@angular-eslint/sort-lifecycle-methods': 'warn',
      '@angular-eslint/use-component-selector': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      // ==== @angular-eslint: template ====
      '@angular-eslint/template/eqeqeq': ['warn', { allowNullOrUndefined: true }], // recommended override: provide options
      '@angular-eslint/template/no-any': 'warn',
      '@angular-eslint/template/no-duplicate-attributes': 'warn',
      '@angular-eslint/template/no-interpolation-in-attributes': 'warn',
      '@angular-eslint/template/no-positive-tabindex': 'warn',
      '@angular-eslint/template/prefer-control-flow': 'warn',
      '@angular-eslint/template/prefer-self-closing-tags': 'warn',
    },
  },
];
