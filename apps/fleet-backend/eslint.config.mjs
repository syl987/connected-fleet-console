import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
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
          ],
        },
      ],
    },
  },
];
